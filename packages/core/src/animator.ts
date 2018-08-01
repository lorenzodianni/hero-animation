import { getScreenRect, css, ScreenRect } from './common';

export class Animator {

  private fromRect: ScreenRect;
  private clonedElement: HTMLElement;
  private complete: boolean;
  private resolve: Function;

  constructor(
    private fromElement: HTMLElement,
    private toElement: HTMLElement,
    private fromView: HTMLElement,
    private toView: HTMLElement
  ) {
    this.done = this.done.bind(this);
    this.cloneElement();
  }

  cloneElement() {
    this.fromRect = getScreenRect(this.fromElement, this.fromView);
    this.clonedElement = <HTMLElement>this.fromElement.cloneNode(true);
    (this.fromView.parentNode as HTMLElement).appendChild(this.clonedElement);
    css(this.clonedElement, {
      top: `${this.fromRect.top}px`,
      left: `${this.fromRect.left}px`,
      width: `${this.fromRect.width}px`,
      height: `${this.fromRect.height}px`,
      margin: '0',
    });
    css(this.fromElement, {visibility: 'hidden'});
    css(this.toElement, {visibility: 'hidden'});
  }

  done() {
    if (!this.complete) {
      this.complete = true;
      typeof this.resolve === 'function' && this.resolve();
    }
  }

  move() {
    return new Promise((resolve) => {
      this.resolve = resolve;
      const toRect = getScreenRect(this.toElement, this.toView);
      css(this.clonedElement, {
        transform: `translate3d(${toRect.left - this.fromRect.left}px, ${toRect.top - this.fromRect.top}px, 0)`,
        width: `${toRect.width}px`,
        height: `${toRect.height}px`,
      });
      // Switch the animating element to the target's classes, which allows us
      // to animate other properties like color, border, corners, etc.
      this.clonedElement.setAttribute('class', `${this.toElement.getAttribute('class')} hero-animation__animator`);
      this.clonedElement.addEventListener('transitionend', this.done);
    });
  }

  destroy() {
    css(this.toElement, {visibility: ''});
    this.clonedElement.removeEventListener('transitionend', this.done);
    this.clonedElement.remove();
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        (this[prop] as any) = null;
      }
    }
  }
}