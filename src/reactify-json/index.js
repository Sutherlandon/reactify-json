import React from 'react';

// base class that builds the js object
class ReactJsonBuilder {
  constructor(mapping) {
    this.mapping = mapping;
    this.document = {};
  }

  createDocument(obj = {}) {
    this.document = obj;
  }

  element = (type, props = {}, children = '') => {
    return { type, props, children };
  }

  reactify = (json = this.document) => {
    // on initial call, json will be string
    // in recursive calls, json will be an object
    let el = json;
    if (typeof json === 'string') {
      el = JSON.parse(json);
    }

    // If the type exists in the mapping use that component
    // instead of a creating a generic tag
    let { type } = el;
    if (type in this.mapping) {
      type = this.mapping[type];
    }

    // recursively create elements out of the children
    let composedChildren;
    if (el.children) {
      if (typeof el.children === 'string') {
        composedChildren = el.children;
      } else if (Array.isArray(el.children)) {
        composedChildren = el.children.map((child, i) => {
          child.props.key = i;
          return this.reactify(child);
        });
      } else if (typeof el.children === 'object') {
        composedChildren = this.reactify(el.children);
      } else {
        // Children must be string, array, or object
        throw Error('React children must be of type string, object, or array');
      }
    }

    // return the react element
    return React.createElement(type, el.props, composedChildren);
  }

  toJSON = (obj) => {
    return JSON.stringify(obj);
  }
}

const builder = (mapping = {}) => new Proxy(
  new ReactJsonBuilder(mapping),
  {
    get: (obj, prop) => {
      return prop in obj 
        ? obj[prop] 
        : (props, children) => obj.element(prop, props, children);
  }
});

export default builder;