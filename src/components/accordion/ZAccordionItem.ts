import { ZElement } from '@core';
import { component, property } from '@core/decorators';
import { TAG_NAME } from './ZAccordion';
import { createContext, createContextProvider } from '@core/context';

type AccordionItemContextValue = {
  open: boolean;
  onOpenChange(open: boolean): void;
};

export const accordionItemContext =
  createContext<AccordionItemContextValue>('accordion-item');

@component(`${TAG_NAME}-item`)
export class ZAccordionItem extends ZElement {
  @property({ type: 'boolean' })
  open = true;

  constructor() {
    super();

    const context = createContextProvider(this, accordionItemContext, {
      open: this.open,
      onOpenChange: (open) => {
        this.open = open;
        context.set({ open });
      },
    });
  }
}
