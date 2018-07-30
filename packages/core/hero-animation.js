import {Animator} from './animator';
import {ensureFunction} from './common';

export const HERO_SELECTOR = 'hero-id';

export class HeroAnimation {

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
      const animator = new Animator(fromElement, toElement, this.fromView, this.toView);
      this.animatorList.push(animator);
      requestAnimationFrame(() => {
        animator.move().then(() => resolve());
      });
    })
  }
}
