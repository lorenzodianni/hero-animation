import * as angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngAnimate from 'angular-animate';

import moduleOne from './module-one.component';

export default angular
  .module('ModuleOne', [
    uiRouter,
    ngAnimate,
  ])
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state({name: 'moduleOne', url: '/module-one', component: 'moduleOne'})
  }])
  .component('moduleOne', moduleOne)
  .name;