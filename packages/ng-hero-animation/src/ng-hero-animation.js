import {HeroAnimation} from '../../core';

const NG_ENTER = 'enter';
const NG_LEAVE = 'leave';

class NgHeroAnimation {

  constructor($animateCss) {
    this.heroAnimation = new HeroAnimation({
      onInit: () => this._onInit(),
      onDestroy: () => this._onDestroy(),
    });
    this.$animateCss = $animateCss;
    this.leave = this._prepare(NG_LEAVE);
    this.enter = this._prepare(NG_ENTER);
  }

  _onInit() {
    this.doneFnList = [];
  }

  _onDestroy() {
    this.doneFnList.forEach(doneFn => doneFn());
    this.doneFnList = [];
    this.from = null;
    this.to = null;
  }

  _prepare(eventType) {
    return (element, doneFn) => {
      if (this.heroAnimation.isRunningPrevAnimation) {
        this.heroAnimation.destroy();
      }
      this.$animateCss(element, {event: eventType, structural: true}).start();
      this.doneFnList.push(doneFn);
      return this._waitBothViews(eventType, element[0]).then(() => {
        return this.heroAnimation.animate(this.from, this.to);
      })
    }
  }

  _waitBothViews(eventType, element) {
    return new Promise((resolve) => {
      if (eventType === NG_LEAVE) {
        this.from = element;
      } else {
        this.to = element;
      }
      if (this.from && this.to) {
        resolve();
      }
    });
  }
}

export default angular
  .module('ngHeroAnimation', ['ngAnimate'])
  .animation('.hero-animation', ['$animateCss', NgHeroAnimation])
  .name;