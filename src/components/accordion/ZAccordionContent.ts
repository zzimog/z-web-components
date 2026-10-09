import { ZElement } from '@core';
import { component } from '@core/decorators';
import { TAG_NAME } from './ZAccordion';
import { useId } from '@core/utils';

@component(`${TAG_NAME}-content`)
export class ZAccordionContent extends ZElement {
  constructor() {
    super();

    this.id = this.id || useId();
    this.role = this.role || 'region';
    this.setAttribute('aria-labelledby', 'ACCORDION_TRIGGER_ID');
  }
}
