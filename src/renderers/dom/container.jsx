var ReactLibertyElement = require('./element.jsx');
var computeLayout = require('css-layout');
var ReactMultiChild = require('react/lib/ReactMultiChild');

const { assign } = Object;

class ReactLibertyContainer extends ReactLibertyElement {
  getDisplayObject() {
    return document.createElement('div');
  }

  mountComponent(rootID, transaction, context) {
    super.mountComponent(rootID, transaction, context);

    this._context.oldParent = this._context.parent;
    this._context.parent = this;
    this.mountChildren(this.props.children, transaction, this._context).map(this.mountChild.bind(this));
    this._context.parent = this._context.oldParent;

    transaction.getReactMountReady().enqueue(this.updateDisplayObject, this, true);

    if (this._isRootLibertyNode) {
      return '';
    } else {
      return this;
    }
  }

  mountChild(child) {
    if (typeof child !== 'string') {
      child.parent = this;
      this.children.push(child);
      this._displayObject.appendChild(child._displayObject);
    }
  }

  unmountComponent() {
    this.unmountChildren();
    super.unmountComponent();
  }

  receiveComponent(nextElement, transaction, context) {
    super.receiveComponent(nextElement, transaction, context);
    this.updateDisplayObject(false);
    //this.updateChildren(this.props.children, transaction, context);
  }

  updateDisplayObject(updateChildren) {
    super.updateDisplayObject();

    if (updateChildren) {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].updateDisplayObject(updateChildren);
      }
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this._isRootLibertyNode) {
      this.doLayout();
    }
  }

  doLayout() {
    this.timesLayouted = this.timesLayouted + 1 || 1;
    console.log('Layouted, ' + this.constructor.name + ', ' + this.timesLayouted);
    computeLayout(this);
    this.updateDisplayObject(true);
  }

  render() {
    return super.render();
  }
}

assign(
  ReactLibertyContainer.prototype,
  ReactMultiChild.Mixin
);

window['DOMdiv'] = module.exports = ReactLibertyContainer;