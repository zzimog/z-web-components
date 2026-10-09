import { ZElement } from '@core';
import { useContext } from '@core/context';
import { component, property } from '@core/decorators';
import { useId } from '@core/utils';
import { TAG_NAME } from './ZAccordion';
import { accordionItemContext } from './ZAccordionItem';

@component(`${TAG_NAME}-content`)
export class ZAccordionContent extends ZElement {
  @property()
  id = useId();

  @property({ attribute: 'aria-labelledby' })
  labelledby?: string;

  @property({ attribute: 'data-open' })
  expanded?: boolean;

  getContext: unknown;

  constructor() {
    super();

    this.role ??= 'region';

    this.getContext = useContext(this, accordionItemContext, (context) => {
      const { open, triggerId, onContentIdChange, onContentChange } = context;
      this.labelledby = triggerId;
      this.expanded = open;
      onContentIdChange(this.id);
      onContentChange(this);
    });
  }

  update() {
    const context = this.getContext();
    context?.onContentIdChange(this.id);

    const fragment = document.createDocumentFragment();
    if (this.expanded) {
      this.appendChild(fragment);
    } else {
      while (this.firstChild) {
        fragment.appendChild(this.firstChild);
      }
    }
  }
}
