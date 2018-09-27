import * as angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngAnimate from 'angular-animate';

import moduleTwo from './module-two.component';

export default angular
  .module('ModuleTwo', [
    uiRouter,
    ngAnimate,
  ])
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state({name: 'moduleTwo', url: '/module-two', component: 'moduleTwo'})
  }])
  .component('moduleTwo', moduleTwo)
  .name;