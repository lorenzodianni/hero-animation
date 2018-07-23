import {Animator} from './animator';

export class HeroAnimation {

  static get ENTER() {
    return 'enter';
  }

  static get LEAVE() {
    return 'leave';
  }

  static get SELECTOR() {
    return 'hero-id';
  }

  constructor($animateCss) {
    this.$animateCss = $animateCss;
    this.resetHeroAnimation();
    this.enter = this.heroAnimation(HeroAnimation.ENTER);
    this.leave = this.heroAnimation(HeroAnimation.LEAVE);
  }

  resetHeroAnimation() {
    this.isRunningPrevAnimation = false;
    this.fromView = null;
    this.toView = null;
    if (this.doneFnList) {
      this.doneFnList.forEach(doneFn => doneFn());
    }
    if (this.animatorList) {
      this.animatorList.forEach(animator => animator.destroy());
    }
    this.doneFnList = [];
    this.animatorList = [];
  }

  heroAnimation(eventType) {
    return (element, doneFn) => {
      if (this.isRunningPrevAnimation) {
        this.resetHeroAnimation()
      }
      this.$animateCss(element, {event: eventType, structural: true}).start();
      this.doneFnList.push(doneFn);
      return this.setViewType(eventType, element[0])
        .then(() => this.startHeroAnimation())
        .finally(() => this.resetHeroAnimation());
    }
  }

  setViewType(eventType, element) {
    return new Promise((resolve) => {
      if (eventType === HeroAnimation.ENTER) {
        this.toView = element;
      } else {
        this.fromView = element;
      }
      this.toView && this.fromView && resolve();
    });
  }

  startHeroAnimation() {
    this.isRunningPrevAnimation = true;
    const from = this.fromView.querySelectorAll(`[${HeroAnimation.SELECTOR}]`);
    const to = this.toView.querySelectorAll(`[${HeroAnimation.SELECTOR}]`);
    const pairs = [];
    for (let n = 0; n < from.length; n++) {
      for (let m = 0; m < to.length; m++) {
        if (from[n].getAttribute(HeroAnimation.SELECTOR) === to[m].getAttribute(HeroAnimation.SELECTOR)) {
          pairs.push({from: from[n], to: to[m]});
        }
      }
    }
    const animations = pairs.map(pair => this.animateElement(pair.from, pair.to));
    return Promise.all(animations);
  }

  animateElement(fromElement, toElement) {
    return new Promise((resolve) => {
      const animator = new Animator(fromElement, toElement, this.fromView, this.toView);
      this.animatorList.push(animator);
      requestAnimationFrame(() => animator.move().then(resolve));
    })
  }
}