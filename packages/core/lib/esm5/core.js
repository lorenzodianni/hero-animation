function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function css(element, style) {
  for (var prop in style) {
    if (style.hasOwnProperty(prop)) {
      element.style[prop] = style[prop];
    }
  }

  return element;
}
function ensureFunction(fn) {
  return fn && typeof fn === 'function' ? fn : function () {};
}

var Animator =
/*#__PURE__*/
function () {
  function Animator(fromElement, toElement) {
    _classCallCheck(this, Animator);

    this.fromElement = fromElement;
    this.toElement = toElement;
    this.done = this.done.bind(this);
    this.cloneElement();
  }

  _createClass(Animator, [{
    key: "cloneElement",
    value: function cloneElement() {
      this._fromRect = this.fromElement.getBoundingClientRect();
      this._clonedElement = this.fromElement.cloneNode(true);
      document.body.appendChild(this._clonedElement);
      css(this._clonedElement, {
        top: "".concat(this._fromRect.top, "px"),
        left: "".concat(this._fromRect.left, "px"),
        width: "".concat(this._fromRect.width, "px"),
        height: "".concat(this._fromRect.height, "px"),
        margin: '0'
      });
      css(this.fromElement, {
        visibility: 'hidden'
      });
      css(this.toElement, {
        visibility: 'hidden'
      });
    }
  }, {
    key: "done",
    value: function done() {
      if (!this.complete) {
        this.complete = true;
        typeof this._resolve === 'function' && this._resolve();
      }
    }
  }, {
    key: "move",
    value: function move() {
      var _this = this;

      return new Promise(function (resolve) {
        _this._resolve = resolve;

        var toRect = _this.toElement.getBoundingClientRect();

        css(_this._clonedElement, {
          transform: "translate3d(".concat(toRect.left - _this._fromRect.left, "px, ").concat(toRect.top - _this._fromRect.top, "px, 0)"),
          width: "".concat(toRect.width, "px"),
          height: "".concat(toRect.height, "px")
        }); // Switch the animating element to the target's classes, which allows us
        // to animate other properties like color, border, corners, etc.

        _this._clonedElement.setAttribute('class', "".concat(_this.toElement.getAttribute('class'), " hero-animation__animator"));

        _this._clonedElement.addEventListener('transitionend', _this.done);
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      css(this.toElement, {
        visibility: ''
      });

      this._clonedElement.removeEventListener('transitionend', this.done);

      this._clonedElement.remove();

      for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
          this[prop] = null;
        }
      }
    }
  }]);

  return Animator;
}();

var HERO_SELECTOR = 'hero-id';
var HeroAnimation =
/*#__PURE__*/
function () {
  function HeroAnimation() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        onInit = _ref.onInit,
        onAnimationStart = _ref.onAnimationStart,
        onAnimationEnd = _ref.onAnimationEnd,
        onDestroy = _ref.onDestroy;

    _classCallCheck(this, HeroAnimation);

    this.onInit = ensureFunction(onInit);
    this.onAnimationStart = ensureFunction(onAnimationStart);
    this.onAnimationEnd = ensureFunction(onAnimationEnd);
    this.onDestroy = ensureFunction(onDestroy);
    this.init();
    this.onInit();
  }

  _createClass(HeroAnimation, [{
    key: "init",
    value: function init() {
      this.isRunningPrevAnimation = false;
      this.fromView = null;
      this.toView = null;
      this.animatorList = [];
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.animatorList.forEach(function (animator) {
        return animator.destroy();
      });
      this.init();
      this.onDestroy();
    }
  }, {
    key: "animate",
    value: function animate(from, to) {
      var _this = this;

      if (this.isRunningPrevAnimation) {
        this.destroy();
      }

      this.fromView = from;
      this.toView = to;
      return this.startHeroAnimation().then(function () {
        return _this.destroy();
      }).catch(function () {
        return _this.destroy();
      });
    }
  }, {
    key: "startHeroAnimation",
    value: function startHeroAnimation() {
      var _this2 = this;

      this.isRunningPrevAnimation = true;
      this.onAnimationStart();
      var from = this.fromView.querySelectorAll("[".concat(HERO_SELECTOR, "]"));
      var to = this.toView.querySelectorAll("[".concat(HERO_SELECTOR, "]"));
      var pairs = [];

      for (var n = 0; n < from.length; n++) {
        for (var m = 0; m < to.length; m++) {
          if (from[n].getAttribute(HERO_SELECTOR) === to[m].getAttribute(HERO_SELECTOR)) {
            pairs.push({
              from: from[n],
              to: to[m]
            });
          }
        }
      }

      var animations = pairs.map(function (pair) {
        return _this2.animateElement(pair.from, pair.to);
      });
      return Promise.all(animations).then(function () {
        return _this2.onAnimationEnd();
      });
    }
  }, {
    key: "animateElement",
    value: function animateElement(fromElement, toElement) {
      var _this3 = this;

      return new Promise(function (resolve) {
        var animator = new Animator(fromElement, toElement);

        _this3.animatorList.push(animator);

        requestAnimationFrame(function () {
          animator.move().then(function () {
            return resolve();
          });
        });
      });
    }
  }]);

  return HeroAnimation;
}();

export { Animator, HERO_SELECTOR, HeroAnimation, css, ensureFunction };
