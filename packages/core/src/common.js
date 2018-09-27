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
