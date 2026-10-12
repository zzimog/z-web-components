import { ZElement } from '@core';
import { component, property } from '@core/decorators';
import { TAG_NAME } from './ZAccordion';
import { createContext, createContextProvider } from '@core/context';

export type AccordionItemContext = {
  open: boolean;
  triggerId?: string;
  contentId?: string;
  onOpenChange(open: boolean): void;
  onTriggerIdChange(id?: string): void;
  onContentIdChange(id?: string): void;
};

export const accordionItemContext =
  createContext<AccordionItemContext>('accordion-item');

type ContextProvider = {
  set(...args: unknown[]): void;
};

@component(`${TAG_NAME}-item`)
export class ZAccordionItem extends ZElement {
  @property({ type: 'boolean' })
  open = false;

  context?: ContextProvider;

  onMount() {
    this.open = this.hasAttribute('open');

    this.context = createContextProvider(this, accordionItemContext, {
      open: this.open,
      triggerId: undefined,
      contentId: undefined,
      onOpenChange: (open) => {
        this.open = open;
        this.context?.set({ open });
      },
      onTriggerIdChange: (id) => {
        this.context?.set({ triggerId: id });
      },
      onContentIdChange: (id) => {
        this.context?.set({ contentId: id });
      },
    });
  }
}
