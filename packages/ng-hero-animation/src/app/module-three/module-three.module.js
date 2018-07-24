import * as angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngAnimate from 'angular-animate';

import moduleThree from './module-three.component';

export default angular
  .module('ModuleThree', [
    uiRouter,
    ngAnimate,
  ])
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state({name: 'moduleThree', url: '/module-three', component: 'moduleThree'})
  }])
  .component('moduleThree', moduleThree)
  .name;