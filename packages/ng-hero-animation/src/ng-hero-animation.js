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
      // todo: trovare un modo per non fare if (modal) else (view)
      if (this._isModal(element[0])) {
        const viewElement = document.querySelector('div.hero-animation');
        if (this._modalType(element[0]) === 'enter') {
          this.from = viewElement;
          this.to = element[0];
        } else {
          this.from = element[0];
          this.to = viewElement;
        }
        return this.heroAnimation.animate(this.from, this.to);
      } else {
        return this._waitBothViews(eventType, element[0]).then(() => {
          return this.heroAnimation.animate(this.from, this.to);
        })
      }
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

  _isModal(element) {
    return element.classList.contains('modal');
  }

  _modalType(element) {
    return element.classList.contains('ng-leave') ? 'leave' : 'enter';
  }
}

export default angular
  .module('ngHeroAnimation', ['ngAnimate'])
  .animation('.hero-animation', ['$animateCss', NgHeroAnimation])
  .name;
