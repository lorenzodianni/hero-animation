export class Animator {

  static getScreenRect(element, view) {
    const elementRect = element ? element.getBoundingClientRect() : {};
    const viewRect = view ? view.getBoundingClientRect() : {};
    return {
      top: elementRect.top - viewRect.top,
      left: elementRect.left - viewRect.left,
      width: elementRect.width,
      height: elementRect.height
    };
  }

  static css(element, style) {
    for (const prop in style) {
      if (style.hasOwnProperty(prop)) {
        element.style[prop] = style[prop];
      }
    }
    return element;
  }

  constructor(fromElement, toElement, fromView, toView) {
    this.fromElement = fromElement;
    this.toElement = toElement;
    this.fromView = fromView;
    this.toView = toView;
    this.done = this.done.bind(this);
    this.cloneElement();
  }

  cloneElement() {
    this._fromRect = Animator.getScreenRect(this.fromElement, this.fromView);
    this._clonedElement = this.fromElement.cloneNode(true);
    this.fromView.parentNode.appendChild(this._clonedElement);
    Animator.css(this._clonedElement, {
      top: `${this._fromRect.top}px`,
      left: `${this._fromRect.left}px`,
      width: `${this._fromRect.width}px`,
      height: `${this._fromRect.height}px`,
      margin: '0',
    });
    Animator.css(this.fromElement, {visibility: 'hidden'});
    Animator.css(this.toElement, {visibility: 'hidden'});
  }

  done() {
    if (!this.complete) {
      this.complete = true;
      typeof this._resolve === 'function' && this._resolve();
    }
  }

  move() {
    return new Promise((resolve) => {
      this._resolve = resolve;
      const toRect = Animator.getScreenRect(this.toElement, this.toView);
      Animator.css(this._clonedElement, {
        transform: `translate3d(${toRect.left - this._fromRect.left}px, ${toRect.top - this._fromRect.top}px, 0)`,
        width: `${toRect.width}px`,
        height: `${toRect.height}px`,
      });
      // Switch the animating element to the target's classes, which allows us
      // to animate other properties like color, border, corners, etc.
      this._clonedElement.setAttribute('class', `${this.toElement.getAttribute('class')} hero-animation__animator`);
      this._clonedElement.addEventListener('transitionend', this.done);
    });
  }

  destroy() {
    Animator.css(this.toElement, {visibility: ''});
    this._clonedElement.removeEventListener('transitionend', this.done);
    this._clonedElement.remove();
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        this[prop] = null;
      }
    }
  }
}