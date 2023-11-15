// widget lifecycle

// construct
/* 
  - a widget can have default values for its attributes when it is constrcuted. (Consider how Niagara Components can have default values for their frozen Slots.)
  - you can set actual values for the Widget's attributes by passing them to the constructor function.
*/
class MyWidget extends Widget {
  constrcutor(params) {
    super({ params, defaults: { properties: { foo: 'bar' } } });
  }
}
  const myWidget = new MyWidget({ properties: { baz: 'buzz' } });

// Initialize
/* 
  - Eash widget instance is bound to a single DOM element and remains bound to that DOM element for its entire lifecycle.
  - The moment at which a Widget is bound to a DOM element is called initiailization.
*/