import { Animator } from './animator';
import { ensureFunction } from './common';

export interface HeroAnimationConfig {
  onInit?: Function;
  onAnimationStart?: Function;
  onAnimationEnd?: Function;
  onDestroy?: Function;
}

export const HERO_SELECTOR = 'hero-id';

export class HeroAnimation {
  private readonly onInit: Function;
  private readonly onAnimationStart: Function;
  private readonly onAnimationEnd: Function;
  private readonly onDestroy: Function;

  private isRunningPrevAnimation: boolean;
  private fromView: HTMLElement | null;
  private toView: HTMLElement | null;
  private animatorList: Animator[];

  constructor({onInit, onAnimationStart, onAnimationEnd, onDestroy}: HeroAnimationConfig = {}) {
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

  animate(from: HTMLElement, to: HTMLElement) {
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
    const from = (this.fromView as HTMLElement).querySelectorAll(`[${HERO_SELECTOR}]`);
    const to = (this.toView as HTMLElement).querySelectorAll(`[${HERO_SELECTOR}]`);
    const pairs: Array<{from: HTMLElement, to: HTMLElement}> = [];
    for (let n = 0; n < from.length; n++) {
      for (let m = 0; m < to.length; m++) {
        if (from[n].getAttribute(HERO_SELECTOR) === to[m].getAttribute(HERO_SELECTOR)) {
          pairs.push({from: <HTMLElement>from[n], to: <HTMLElement>to[m]});
        }
      }
    }
    const animations = pairs.map(pair => this.animateElement(pair.from, pair.to));
    return Promise.all(animations).then(() => this.onAnimationEnd());
  }

  animateElement(fromElement: HTMLElement, toElement: HTMLElement) {
    return new Promise((resolve) => {
      const animator = new Animator(fromElement, toElement, <HTMLElement>this.fromView, <HTMLElement>this.toView);
      this.animatorList.push(animator);
      requestAnimationFrame(() => {
        animator.move().then(() => resolve());
      });
    })
  }
}