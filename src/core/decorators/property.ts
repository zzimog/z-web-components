import type { ContextMetadata, ReactiveElement } from '../ReactiveElement';

type PropertyType = 'string' | 'number' | 'boolean' | 'object' | 'array';

/*
type PropertyParser = {
  toAttribute(value: unknown, type?: PropertyType): string | null;
  toProperty(value: string | null, type?: PropertyType): unknown;
};
*/

const DefaultParser = {
  toAttribute(value: unknown, type?: PropertyType): string | null {
    switch (type) {
      case 'string':
      case 'number':
        return `${value}`;
      case 'boolean':
        return value ? '' : null;
      case 'object':
      case 'array':
        return value == null ? null : JSON.stringify(value);
      default:
        return null;
    }
  },
  toProperty(value: string | null, type?: PropertyType): unknown {
    switch (type) {
      case 'number':
        return value === null ? null : Number(value);
      case 'boolean':
        return value !== null;
      case 'object':
      case 'array':
        try {
          return JSON.parse(value!);
        } catch {
          return null;
        }
      default:
        return value;
    }
  },
};

export type PropertyOptions = {
  /**
   * Type of property value
   */
  type: PropertyType;
  /**
   * If should be syncronized with attribute, eventually
   * use provided string as attribute name
   */
  attribute: string | boolean;
  /**
   * Property changing value should trigger an update
   */
  reactive: boolean;
  /**
   * The parser for the property value, as attribute
   * values are string only
   */
  parser: typeof DefaultParser;
};

export function property<T extends ReactiveElement, V>(
  opts: Partial<PropertyOptions> = {},
) {
  const options = {
    type: 'string' as const,
    attribute: true,
    reactive: true,
    parser: DefaultParser,
    ...opts,
  };

  return function (_: undefined, context: ClassFieldDecoratorContext<T, V>) {
    const meta = context.metadata as ContextMetadata;
    meta.properties = new Map(meta.properties ?? []);
    meta.properties.set(context.name, options);

    const values = new WeakMap<T, V>();

    context.addInitializer(function (this: T) {
      Object.defineProperty(this, context.name, {
        get() {
          return values.get(this);
        },
        set(newValue: V) {
          const { type, parser } = options;
          const parsedOldValue = parser.toAttribute(values.get(this), type);
          const parsedNewValue = parser.toAttribute(newValue, type);
          if (!Object.is(parsedOldValue, parsedNewValue)) {
            values.set(this, newValue);
            this._$updateProperty(context.name, newValue);
          }
        },
      });
    });

    return function (this: T, initialValue: V) {
      values.set(this, initialValue);
      if (initialValue) {
        this._$updateProperty(context.name, initialValue);
      }
      return initialValue;
    };
  };
}
