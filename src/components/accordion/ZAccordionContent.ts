import { ZElement } from '@core';
import { useContext } from '@core/context';
import { component, property } from '@core/decorators';
import { useId } from '@core/utils';
import { TAG_NAME } from './ZAccordion';
import { accordionItemContext } from './ZAccordionItem';

@component(`${TAG_NAME}-content`)
export class ZAccordionContent extends ZElement {
  @property()
  id;

  @property({ attribute: 'aria-labelledby' })
  labelledby?: string;

  @property({ type: 'boolean' })
  hidden: boolean;

  protected _$fragment: DocumentFragment | null = null;

  protected _$itemContext?: typeof accordionItemContext;

  constructor() {
    super();
    this.id ??= useId();
    this.role ??= 'region';
    this.hidden ??= false;
  }

  onMount() {
    this._$itemContext = useContext(this, accordionItemContext, (context) => {
      const { triggerId, open, onContentIdChange } = context;
      this.labelledby = triggerId;
      this.hidden = !open;
      onContentIdChange(this.id);
    });
  }

  onIdChange() {
    const context = this._$itemContext?.value;
    context?.onContentIdChange(this.id);
  }

  update() {
    this._$fragment ??= document.createDocumentFragment();

    if (this.hidden) {
      while (this.firstChild) {
        this._$fragment.appendChild(this.firstChild);
      }
    } else {
      this.appendChild(this._$fragment);
    }
  }
}
