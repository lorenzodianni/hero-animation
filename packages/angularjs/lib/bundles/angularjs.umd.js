(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('angular'), require('@hero-animation/core')) :
  typeof define === 'function' && define.amd ? define('@hero-animation/angularjs', ['exports', 'angular', '@hero-animation/core'], factory) :
  (factory((global.HeroAnimation = global.HeroAnimation || {}, global.HeroAnimation.angularjs = {}),global.angular,global.core));
}(this, (function (exports,angular,core) { 'use strict';

  const NG_ENTER = 'enter';
  const NG_LEAVE = 'leave';
  const ANIMATION_SELECTOR = '.hero-animation';

  class NgHeroAnimation {
    constructor($animateCss) {
      this.heroAnimation = new core.HeroAnimation({
        onInit: () => this._onInit(),
        onDestroy: () => this._onDestroy()
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

        this.$animateCss(element, {
          event: eventType,
          structural: true
        }).start();
        this.doneFnList.push(doneFn);
        return this._waitBothViews(eventType, element[0]).then(() => this.heroAnimation.animate(this.from, this.to));
      };
    }

    _isSingleAnimation() {
      return !(document.querySelector(`${ANIMATION_SELECTOR}[class*='ng-enter']`) && document.querySelector(`${ANIMATION_SELECTOR}[class*='ng-leave']`));
    }

    _getStaticElement() {
      return Array.from(document.querySelectorAll(ANIMATION_SELECTOR)).filter(dom => !dom.classList.contains('ng-enter') && !dom.classList.contains('ng-leave'))[0];
    }

    _waitBothViews(eventType, element) {
      return new Promise(resolve => {
        setTimeout(() => {
          const staticElement = this._isSingleAnimation() && this._getStaticElement();

          if (staticElement) {
            const isModalTypeEnter = eventType === NG_ENTER;
            this.from = isModalTypeEnter ? staticElement : element;
            this.to = isModalTypeEnter ? element : staticElement;
            return resolve();
          }

          if (eventType === NG_LEAVE) {
            this.from = element;
          } else {
            this.to = element;
          }

          if (this.from && this.to) {
            resolve();
          }
        });
      });
    }

  }

  var index = angular.module('ngHeroAnimation', ['ngAnimate']).animation(ANIMATION_SELECTOR, ['$animateCss', NgHeroAnimation]).name;

  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
