import { ZElement } from '@core';
import { component } from '@core/decorators';

@component('z-button')
export class ZButton extends ZElement {
  constructor() {
    super();
    this.role ??= 'button';
    this.tabIndex = this.hasAttribute('tabindex')
      ? Number(this.getAttribute('tabindex'))
      : 0;
  }

  /*
  onPointerDown(event: PointerEvent) {
    event.preventDefault();
    this.focus({ preventScroll: true });
  }
  */
}
