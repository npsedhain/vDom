import { Reconciler } from "./vDom.js";

export default class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this._domElement = null;
    this._container = null;
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps() {}

  shouldComponentUpdate() {
    return true;
  }

  componentWillUpdate() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  setState(newState) {
    const prevState = this.state;
    const nextState = Object.assign({}, prevState || {}, newState);
    Reconciler.handleComponentStateChange(this, nextState, this._container);
  }

  setChild(component) {
    this._child = component;
    component._parentComponent = this;
  }

  getDomElement() {
    return this._domElement;
  }

  setDomElement(domElement) {
    this._domElement = domElement;
  }

  setContainer(container) {
    this._container = container;
  }

  getChild() {
    return this._child;
  }

  getRoot() {
    let component = this;
    let res;
    while (component) {
      res = component;
      component = component._parentComponent;
    }
    return res;
  }

  updateProps(newProps) {
    this.props = newProps;
  }

  updateState(newState) {
    this.state = newState;
  }

  render() {}
}
