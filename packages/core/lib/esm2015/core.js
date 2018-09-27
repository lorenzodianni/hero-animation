function css(element, style) {
  for (const prop in style) {
    if (style.hasOwnProperty(prop)) {
      element.style[prop] = style[prop];
    }
  }
  return element;
}

function ensureFunction(fn) {
  return fn && typeof fn === 'function' ? fn : () => {
  };
}

class Animator {

  constructor(fromElement, toElement) {
    this.fromElement = fromElement;
    this.toElement = toElement;
    this.done = this.done.bind(this);
    this.cloneElement();
  }

  cloneElement() {
    this._fromRect = this.fromElement.getBoundingClientRect();
    this._clonedElement = this.fromElement.cloneNode(true);
    document.body.appendChild(this._clonedElement);
    css(this._clonedElement, {
      top: `${this._fromRect.top}px`,
      left: `${this._fromRect.left}px`,
      width: `${this._fromRect.width}px`,
      height: `${this._fromRect.height}px`,
      margin: '0',
    });
    css(this.fromElement, {visibility: 'hidden'});
    css(this.toElement, {visibility: 'hidden'});
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
      const toRect = this.toElement.getBoundingClientRect();
      css(this._clonedElement, {
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
    css(this.toElement, {visibility: ''});
    this._clonedElement.removeEventListener('transitionend', this.done);
    this._clonedElement.remove();
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        this[prop] = null;
      }
    }
  }
}

const HERO_SELECTOR = 'hero-id';

class HeroAnimation {

  constructor({onInit, onAnimationStart, onAnimationEnd, onDestroy} = {}) {
    this.onInit = ensureFunction(onInit);
    this.onAnimationStart = ensureFunction(onAnimationStart);
    this.onAnimationEnd = ensureFunction(onAnimationEnd);
    this.onDestroy = ensureFunction(onDestroy);
    this.init();
    this.onInit();
  }

  init() {
    this.isRunningPrevAnimation = false;
    this.fromView = null;
    this.toView = null;
    this.animatorList = [];
  }

  destroy() {
    this.animatorList.forEach(animator => animator.destroy());
    this.init();
    this.onDestroy();
  }

  animate(from, to) {
    if (this.isRunningPrevAnimation) {
      this.destroy();
    }
    this.fromView = from;
    this.toView = to;
    return this.startHeroAnimation()
      .then(() => this.destroy())
      .catch(() => this.destroy());
  }

  startHeroAnimation() {
    this.isRunningPrevAnimation = true;
    this.onAnimationStart();
    const from = this.fromView.querySelectorAll(`[${HERO_SELECTOR}]`);
    const to = this.toView.querySelectorAll(`[${HERO_SELECTOR}]`);
    const pairs = [];
    for (let n = 0; n < from.length; n++) {
      for (let m = 0; m < to.length; m++) {
        if (from[n].getAttribute(HERO_SELECTOR) === to[m].getAttribute(HERO_SELECTOR)) {
          pairs.push({from: from[n], to: to[m]});
        }
      }
    }
    const animations = pairs.map(pair => this.animateElement(pair.from, pair.to));
    return Promise.all(animations).then(() => this.onAnimationEnd());
  }

  animateElement(fromElement, toElement) {
    return new Promise((resolve) => {
      const animator = new Animator(fromElement, toElement);
      this.animatorList.push(animator);
      requestAnimationFrame(() => {
        animator.move().then(() => resolve());
      });
    })
  }
}

export { Animator, HERO_SELECTOR, HeroAnimation, css, ensureFunction };
