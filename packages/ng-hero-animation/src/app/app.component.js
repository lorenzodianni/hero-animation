const template = `
<style>

.hero-animation {
    position: absolute;
    transform-style: preserve-3d;
    transition: opacity ease-in-out 500ms;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
.hero-animation.ng-enter, .hero-animation.ng-leave.ng-leave-active {
    opacity: 0;
}
.hero-animation.ng-enter.ng-enter-active {
    opacity: 1;
}
.hero-animation__animator {
    transform-style: preserve-3d;
    transition: all ease-in-out 500ms;
    position: absolute;
    z-index: 10000;
}
.modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 50%;
    background-color: green;
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal.ng-enter {
  transition: opacity 500ms ease-out;
  opacity: 0;
}
.modal.ng-enter.ng-enter-active {
  opacity: 1;
}
.modal.ng-leave {
  transition: opacity 500ms ease-out;
  opacity: 1;
}
.modal.ng-leave.ng-leave-active {
  opacity: 0;
}
</style>
<main>
  <header>
    <nav>
      <a ng-repeat="link in $ctrl.links" ui-sref="{{link.state}}">{{link.label}}</a>
    </nav>
  </header>
  <div ui-view class="hero-animation"></div>
</main>
`;

class Controller {
  $onInit() {
    this.links = [
      {state: 'moduleOne', label: 'One'},
      {state: 'moduleTwo', label: 'Two'},
      {state: 'moduleThree', label: 'Three'},
    ];
  }
}

export default {
  template,
  controller: Controller,
}
