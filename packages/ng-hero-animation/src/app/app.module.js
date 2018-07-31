import * as angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngAnimate from 'angular-animate';
import ngHeroAnimation from './../ng-hero-animation';

import ModuleOne from './module-one/module-one.module';
import ModuleTwo from './module-two/module-two.module';
import ModuleThree from './module-three/module-three.module';

import appComponent from './app.component';

export default angular
  .module('AppModule', [
    uiRouter,
    ngAnimate,
    ngHeroAnimation,
    ModuleOne,
    ModuleTwo,
    ModuleThree,
  ])
  .config(['$urlRouterProvider', '$compileProvider', ($urlRouterProvider, $compileProvider) => {
    $urlRouterProvider.otherwise('/module-one');
    $compileProvider.debugInfoEnabled(false);
  }])
  .component('appRoot', appComponent)
  .name;