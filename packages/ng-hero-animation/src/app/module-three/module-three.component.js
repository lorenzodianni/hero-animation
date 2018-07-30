const template = `
<div class="view" style="background: lightblue">
    <h1 class="title--three" hero-id="title">{{$ctrl.title}}</h1>
    <div class="polymer--three" hero-id="polymer"></div>
    <div class="polymer--modal__view" hero-id="modal"></div>
</div>
`;

class Controller {
  $onInit() {
    this.title = 'Three!';
  }
}

export default {
  template,
  controller: Controller,
}
