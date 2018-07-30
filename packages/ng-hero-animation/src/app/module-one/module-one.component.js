const template = `
<div class="view" style="background: palevioletred">
    <h1 class="title--one" hero-id="title">{{$ctrl.title}}</h1>
    <div class="polymer--one" hero-id="polymer"></div>
    <div class="polymer--modal__view" hero-id="modal"></div>
</div>
`;

class Controller {
  $onInit() {
    this.title = 'One!';
  }
}

export default {
  template,
  controller: Controller,
}
