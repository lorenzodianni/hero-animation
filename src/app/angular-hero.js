import {HeroAnimation} from '../hero-animation/hero-animation';

export default angular
  .module('ngHeroAnimation', ['ngAnimate'])
  .animation('.hero-animation', ['$animateCss', HeroAnimation])
  .name;