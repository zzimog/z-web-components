import { useContext } from '@core/context';
import { component, property } from '@core/decorators';
import { useId } from '@core/utils';
import { ZButton } from '../button';
import { TAG_NAME } from './ZAccordion';
import { accordionItemContext } from './ZAccordionItem';

@component(`${TAG_NAME}-trigger`)
export class ZAccordionTrigger extends ZButton {
  @property()
  id;

  @property({ attribute: 'aria-controls', reactive: false })
  controls?: string;

  @property({ attribute: 'aria-expanded', reactive: false })
  expanded?: boolean;

  protected _$itemContext?: typeof accordionItemContext;

  constructor() {
    super();
    this.id = useId();
  }

  onMount() {
    this._$itemContext = useContext(this, accordionItemContext, (context) => {
      const { contentId, open, onTriggerIdChange } = context;
      this.controls = contentId;
      this.expanded = open;
      onTriggerIdChange(this.id);
    });
  }

  onIdChange() {
    const context = this._$itemContext!.value;
    context?.onTriggerIdChange(this.id);
  }

  onClick() {
    const context = this._$itemContext!.value;
    context?.onOpenChange(!context?.open);
  }
}
