import React from 'react';
import reactifyJson from './reactify-json';

const TextInput = (props) => (
  <div className='yolo'>
    <label htmlFor={props.id}>{props.label}</label>
    <input id={props.id} type='text' />
  </div>
)

class TextInput2 extends React.Component {
  render(props) {
    return (
      <div className='yolo'>
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input id={this.props.id} type='text' />
      </div>
    )
  }
}

const mapping = {
  TextInput,
  TextInput2,
}

const builder = reactifyJson(mapping);

builder.createDocument(builder.div({
    className: 'hello'
  }, [
    builder.label({
      htmlFor: 'input1',
    }, 'Input One'),
    builder.input({
      id: 'input1',
      name: 'inputOne',
      type: 'text',
    }),
    builder.TextInput({ 
      id: 'yolo',
      label: 'Input Two',
    }),
    builder.TextInput2({ 
      id: 'yolo2',
      label: 'Input Three',
    }),
  ])
);

const reactForm = builder.reactify();

function App() {
  return (
    <div className="App">
      {reactForm}
    </div>
  );
}

export default App;
