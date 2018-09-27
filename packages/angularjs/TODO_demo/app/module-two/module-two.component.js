const template = `
<div class="view" style="background: cadetblue">
    <h1 class="title--two" hero-id="title">{{$ctrl.title}}</h1>
    <div class="polymer--two" hero-id="polymer"></div>
</div>
`;

class Controller {
  $onInit() {
    this.title = 'Two!';
  }
}

export default {
  template,
  controller: Controller,
}
