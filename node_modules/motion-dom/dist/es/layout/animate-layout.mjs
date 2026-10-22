import { parseAnimateLayoutArgs, LayoutAnimationBuilder } from './LayoutAnimationBuilder.mjs';

/**
 * Animate layout changes made within `updateDom` on elements tagged
 * with `data-layout` or `data-layout-id`.
 *
 * ```
 * animateLayout(() => {
 *     element.style.justifyContent = "flex-end"
 * })
 * ```
 */
function animateLayout(scopeOrUpdateDom, updateDomOrOptions, options) {
    const { scope, updateDom, defaultOptions } = parseAnimateLayoutArgs(scopeOrUpdateDom, updateDomOrOptions, options);
    return new LayoutAnimationBuilder(scope, updateDom, defaultOptions);
}

export { animateLayout };
//# sourceMappingURL=animate-layout.mjs.map
