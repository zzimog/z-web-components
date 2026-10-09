import { ReactiveElement } from './ReactiveElement';
import { shallowEqual } from './utils';

type Effect = () => EffectCleanup;
type EffectCleanup = () => void;
type EffectsStack = Map<number, [EffectCleanup, unknown[] | null]>;

export abstract class ZElement extends ReactiveElement {
  protected _$mountEffects = [] as EffectCleanup[];
  protected _$effects = new Map() as EffectsStack;
  protected _$isMounting = false;
  protected _$isUpdating = false;
  protected _$updateCounter = 0;

  protected _$update() {
    this._$isUpdating = true;
    super._$update();
    this._$isUpdating = false;
    this._$updateCounter = 0;
  }

  connectedCallback() {
    this._$isMounting = true;
    super.connectedCallback();
    this._$isMounting = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    /**
     * Executes all effects clean up when
     * removing from DOM.
     */
    const effects = this._$effects.values();
    const cleanUps = [...this._$mountEffects, ...effects.map(([fn]) => fn)];
    cleanUps.forEach((fn) => fn());
  }

  useEffect(callback: Effect, deps: unknown[] | null = null) {
    if (this._$isUpdating) {
      const count = this._$updateCounter++;
      const effects = this._$effects;
      const current = effects.get(count);
      if (current) {
        const [cleanUp, oldDeps] = current;
        if (oldDeps && shallowEqual(deps, oldDeps)) return;
        cleanUp();
      }

      this._$effects.set(count, [callback(), deps]);
    } else if (this._$isMounting) {
      const cleanUp = callback();
      this._$mountEffects.push(cleanUp);
    } else {
      console.error(
        '`useEffect` must be used inside `onMount` or `update` callbacks',
      );
    }
  }
}
