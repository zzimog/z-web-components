import { ZElement } from '@core';
import { component, property } from '@core/decorators';
import { TAG_NAME } from './ZAccordion';
import { createContext, createContextProvider } from '@core/context';

type AccordionItemContextValue = {
  open: boolean;
  triggerId?: string;
  contentId?: string;
  onOpenChange(open: boolean): void;
  onTriggerIdChange(id?: string): void;
  onContentIdChange(id?: string): void;
  onContentChange(element: HTMLElement): void;
};

export const accordionItemContext =
  createContext<AccordionItemContextValue>('accordion-item');

@component(`${TAG_NAME}-item`)
export class ZAccordionItem extends ZElement {
  @property({ type: 'boolean' })
  open = true;

  content: HTMLElement | null = null;

  constructor() {
    super();

    //let parent: HTMLElement | null = null;
    //let next: HTMLElement | null = null;

    const context = createContextProvider(this, accordionItemContext, {
      open: this.open,
      triggerId: undefined,
      contentId: undefined,
      onOpenChange: (open) => {
        this.open = open;
        context.set({ open });

        /*
        const content = this.content;
        if (!content) return;
        if (open) {
          parent?.insertBefore(content, next);
        } else {
          parent = content.parentNode as HTMLElement;
          next = content.nextElementSibling as HTMLElement;
          content.remove();
        }
        */
      },
      onTriggerIdChange: (id) => {
        context.set({ triggerId: id });
      },
      onContentIdChange: (id) => {
        context.set({ contentId: id });
      },
      onContentChange: (element) => {
        this.content = element;
      },
    });
  }
}
