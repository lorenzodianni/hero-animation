// export function getScreenRect(element, view) {
//   const elementRect = element ? element.getBoundingClientRect() : {};
//   const viewRect = view ? view.getBoundingClientRect() : {};
//   return {
//     top: elementRect.top - viewRect.top,
//     left: elementRect.left - viewRect.left,
//     width: elementRect.width,
//     height: elementRect.height
//   };
// }

export function css(element, style) {
  for (const prop in style) {
    if (style.hasOwnProperty(prop)) {
      element.style[prop] = style[prop];
    }
  }
  return element;
}

export function ensureFunction(fn) {
  return fn && typeof fn === 'function' ? fn : () => {
  };
}
