export function component(tagName: string) {
  return (target: CustomElementConstructor, context: ClassDecoratorContext) => {
    context.addInitializer(() => {
      customElements.define(tagName, target);
    });
  };
}
