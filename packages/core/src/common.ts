export interface ScreenRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function getScreenRect(element: HTMLElement, view: HTMLElement): ScreenRect {
  const elementRect = element ? element.getBoundingClientRect() : ({} as ScreenRect);
  const viewRect = view ? view.getBoundingClientRect() : ({} as ScreenRect);
  return {
    top: elementRect.top - viewRect.top,
    left: elementRect.left - viewRect.left,
    width: elementRect.width,
    height: elementRect.height
  };
}

export function css(element: HTMLElement, style: { [key: string]: string | number }): HTMLElement {
  for (const prop in style) {
    if (style.hasOwnProperty(prop)) {
      (element.style as any)[prop] = style[prop];
    }
  }
  return element;
}

export function ensureFunction(fn: any): Function {
  return fn && typeof fn === 'function' ? fn : () => {
  };
}