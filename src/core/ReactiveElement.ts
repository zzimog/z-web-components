import type { PropertyOptions } from './decorators';
import { capitalize } from './utils';

export type ContextMetadata = {
  properties?: Map<string | symbol, PropertyOptions>;
};

/** Polyfill for Symbol.metadata */
const _symbol = Symbol as unknown as { metadata: symbol };
_symbol.metadata ??= Symbol.for('Symbol.metadata');

export abstract class ReactiveElement extends HTMLElement {
  /**
   * Properties options map.
   */
  protected static _$propsOptions: Map<PropertyKey, PropertyOptions>;

  /**
   * Attribute to property key map.
   */
  protected static _$attributeToPropMap: Map<string, PropertyKey>;

  /**
   * Returns a list of attributes created from element properties.
   *
   * @todo Needs refactoring
   */
  static get observedAttributes() {
    const superCtor = Object.getPrototypeOf(this) as typeof ReactiveElement;
    this._$propsOptions = new Map(superCtor._$propsOptions);
    this._$attributeToPropMap = new Map(superCtor._$attributeToPropMap);

    const meta = this[Symbol.metadata] as ContextMetadata | undefined;
    if (meta && meta.properties) {
      const entries = meta.properties.entries() || [];
      for (const [name, opts] of entries) {
        const attrName = getAttributeName(name, opts.attribute);
        if (attrName) this._$attributeToPropMap.set(attrName, name);
        this._$propsOptions.set(name, opts);
      }
    }

    return [...this._$attributeToPropMap.keys()];
  }

  /**
   * Set to `true` on `connectedCallback` and
   * `false` on `disconnectedCallback`.
   */
  protected _$connected = false;

  /**
   * Flag used when setting attribute from `_$updateProperty`
   * to prevent loop from `attributeChangedCallback`.
   */
  protected _$reflectingProperty: string | null = null;

  /**
   * Return the class constructor.
   */
  protected get _$ctor() {
    return this.constructor as typeof ReactiveElement;
  }

  /**
   * Handle property update.
   */
  protected _$updateProperty<T>(name: string | symbol, value: T) {
    const options = this._$ctor._$propsOptions.get(name);
    if (!options) return;

    const { type, attribute, parser } = options;
    const attrName = getAttributeName(name, attribute);
    const newValue = parser.toAttribute(value, type);

    if (attrName) {
      const currentValue = this.getAttribute(attrName);
      if (!Object.is(newValue, currentValue)) {
        this._$reflectingProperty = attrName;
        if (newValue !== null) this.setAttribute(attrName, newValue);
        else this.removeAttribute(attrName);
        this._$reflectingProperty = null;
      }
    }

    /**
     * Dispatch component update and property change callback
     * only if the element is connected to the DOM.
     */
    if (this._$connected) {
      if (options.reactive) {
        this._$update();
      }

      if (typeof name === 'string') {
        const method = `on${capitalize(name)}Change` as keyof this;
        if (typeof this[method] === 'function') {
          const oldValue = this[name as keyof this];
          this[method](newValue, oldValue);
        }
      }
    }
  }

  /**
   * Handle component update.
   */
  protected _$update() {
    this.update?.();
    this.dispatchEvent(new CustomEvent('update'));
  }

  onMount?(): void;
  onUnmount?(): void;
  update?(): void;

  connectedCallback() {
    this._$connected = true;
    this.onMount?.();
    this.dispatchEvent(new CustomEvent('mount'));
    this._$update();
  }

  disconnectedCallback() {
    this._$connected = false;
    this.onUnmount?.();
    this.dispatchEvent(new CustomEvent('unmount'));
  }

  attributeChangedCallback(name: string, _: string, value: string) {
    /**
     * Prevent `attributeChangedCallback` from running if setting
     * an attribute from a property change.
     */
    if (this._$reflectingProperty === name) return;

    const attrsMap = this._$ctor._$attributeToPropMap;
    const propName = attrsMap.get(name);
    if (!propName) return;

    const ptor = Object.getOwnPropertyDescriptor(this, propName);
    const options = this._$ctor._$propsOptions.get(propName);
    if (options && ptor && typeof ptor.set === 'function') {
      const { type, parser } = options;
      const newValue = parser.toProperty(value, type);
      ptor.set.call(this, newValue);
    }
  }
}

/*---------------------------------------------------------------------------*/

function getAttributeName(name: string | symbol, attribute?: string | boolean) {
  return !attribute
    ? undefined
    : typeof attribute === 'string'
      ? attribute
      : typeof name === 'string'
        ? name.toLowerCase()
        : undefined;
}
