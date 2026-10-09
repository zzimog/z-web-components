import { ZElement } from '@core';
import { component } from '@core/decorators';

@component('z-button')
export class ZButton extends ZElement {
  constructor() {
    super();

    this.role ??= 'button';
    this.tabIndex ??= 0;
    this.addEventListener('pointerdown', (event: PointerEvent) => {
      event.preventDefault();
      this.focus({ preventScroll: true });
    });
  }
}
