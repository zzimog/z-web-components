import { ZElement } from '@core';
import { component, property } from '@core/decorators';

@component('z-greetings')
export class ZGreetings extends ZElement {
  @property({ attribute: false })
  base = 'Hello %name%!';

  @property()
  name?: string;

  onNameChange(newValue: string, oldValue: string) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { newValue, oldValue },
      }),
    );
  }

  onMount() {
    this.useEffect(() => {
      function handleMouseMove(event: MouseEvent) {
        const { clientX, clientY } = event;
        console.log('Mouse:', clientX, clientY);
      }

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    });
  }

  update() {
    const base = this.base;
    const name = this.name ?? 'everyone';
    if (base) this.innerHTML = base.replace('%name%', name);
    else this.innerHTML = '';
  }
}
