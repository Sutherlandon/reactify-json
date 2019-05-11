import React from 'react';

const TextInput = (props) => (
  <div className='yolo'>
    <label for={props.id}>{props.label}</label>
    <input id={props.id} type='text' />
  </div>
)

class TextInput2 extends React.Component {
  render(props) {
    return (
      <div className='yolo'>
        <label for={this.props.id}>{this.props.label}</label>
        <input id={this.props.id} type='text' />
      </div>
    )
  }
}

const reactify = (json, mapping = {}) => {
  // on initial call, json will be string
  // in recursive calls, json will be an object
  let el = json;
  if (typeof json === 'string') {
    el = JSON.parse(json);
  }

  // If the type exists in the mapping use that component
  // instead of a creating a generic tag
  let { type } = el;
  if (type in mapping) {
    type = mapping[type];
  }

  // recursively create elements out of the children
  let composedChildren;
  if (el.children) {
    if (typeof el.children === 'string') {
      composedChildren = el.children;
    } else if (Array.isArray(el.children)) {
      composedChildren = el.children.map((child, i) => {
        child.key = i;
        return reactify(child, mapping);
      });
    } else if (typeof el.children === 'object') {
      composedChildren = reactify(el.children, mapping);
    } else {
      // Children must be string, array, or object
      throw Error('React children must be of type string, object, or array');
    }
  }

  // return the react element
  return React.createElement(type, el.props, composedChildren);
}

class ReactJsonBuilder {
  element(type, props = {}, children = '') {
    return { type, props, children };
  }
}

const rjb = new Proxy(new ReactJsonBuilder(), {
  get: (obj, prop) => {
    if (prop === 'element') {
      return obj.elemnent;
    }

    return prop in obj 
      ? obj[prop] 
      : (props, children) => obj.element(prop, props, children);
  }
});

const form = rjb.div({
  className: 'hello'
  }, [
    rjb.label({
      htmlFor: 'input1',
    }, 'Input One'),
    rjb.input({
      id: 'input1',
      name: 'inputOne',
      type: 'text',
    }),
    rjb.TextInput({ 
      id: 'yolo',
      label: 'Input Two',
    }),
    rjb.TextInput2({ 
      id: 'yolo2',
      label: 'Input Three',
    }),
  ]);

const mapping = {
  TextInput,
  TextInput2,
}

const reactForm = reactify(form, mapping);

function App() {
  return (
    <div className="App">
      {reactForm}
    </div>
  );
}

export default App;
