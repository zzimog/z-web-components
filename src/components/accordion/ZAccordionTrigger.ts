import { useContext } from '@core/context';
import { component, property } from '@core/decorators';
import { useId } from '@core/utils';
import { ZButton } from '../button';
import { TAG_NAME } from './ZAccordion';
import { accordionItemContext } from './ZAccordionItem';

@component(`${TAG_NAME}-trigger`)
export class ZAccordionTrigger extends ZButton {
  @property()
  id = useId();

  @property({ attribute: 'aria-controls', reactive: false })
  controls?: string;

  @property({ attribute: 'aria-expanded', reactive: false })
  expanded?: boolean;

  constructor() {
    super();

    const getContext = useContext(this, accordionItemContext, (context) => {
      this.controls = context.contentId;
      this.expanded = context.open;
      context.onTriggerIdChange(this.id);
    });

    this.update = () => {
      const context = getContext();
      context?.onTriggerIdChange(this.id);
    };

    this.addEventListener('click', () => {
      const context = getContext();
      context?.onOpenChange(!context?.open);
    });
  }
}
