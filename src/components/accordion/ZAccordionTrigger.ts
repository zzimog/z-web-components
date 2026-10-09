import { component } from '@core/decorators';
import { useId } from '@core/utils';
import { ZButton } from '../button';
import { TAG_NAME } from './ZAccordion';
import { useContext } from '@core/context';
import { accordionItemContext } from './ZAccordionItem';

@component(`${TAG_NAME}-trigger`)
export class ZAccordionTrigger extends ZButton {
  constructor() {
    super();

    this.id = this.id || useId();

    const context = useContext(this, accordionItemContext, (value) => {
      const expanded = value.open ? 'true' : 'false';
      this.setAttribute('aria-controls', 'ACCORDION_CONTENT_ID');
      this.setAttribute('aria-expanded', expanded);
    });

    if (context) {
      const { open, onOpenChange } = context;
      this.addEventListener('click', () => onOpenChange(!open));
    }
  }
}
