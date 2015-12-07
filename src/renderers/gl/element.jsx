var React = require('react');
var ReactMount = require('react/lib/ReactMount');
var ReactLiberty = require('./core.js');
var ReactElement = require('react/lib/ReactElement');
var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');

const { assign } = Object;

class ReactLibertyElement extends React.Component {
  construct(element) {
    this.props = null;
    this._currentElement = element;
    this._context = null;
    this._rootNodeID = null;
    this._instance = null;
    this._renderedComponent = null;

    //Liberty specific
    this._style = {};
    this.layout = null;
    this.parent = null;
    this.children = [];
    this.DOMParent = null;
    this._displayObject = null;
    this._isRootLibertyNode = false;

    //DOM attached specific
    this.parentX = 0;
    this.parentY = 0;
    this.isRootLibertyNode = true;

    this._mountOrder = 0;
    this._topLevelWrapper = null;

    this._renderedChildren = null;
    this.timesLayouted = 0;
  }

  getDisplayObject() {
    return new PIXI.Container();
  }

  createDisplayObject() {
    this._displayObject = this._displayObject || this.getDisplayObject();
  }

  unmountComponent() {
    alert('unmountComponent');
  }

  receiveComponent(nextElement, transaction, context) {
    var newProps = nextElement.props;
    var oldProps = this._currentElement.props;

    this.props = newProps;

    //TODO reuse DisplayObject ?

    this.updateDisplayObject();
    return this;
  }

  mountComponent(rootID, transaction, context) {
    this.props = this._currentElement.props;
    this.createDisplayObject();

    this._context = context;
    //this._mountOrder = nextMountID++;
    this._rootNodeID = rootID;
    this._instance = this;

    this.parent = this._context && this._context.parent;
    var parentPixiContainer = null;

    if (!this.parent) {
      ReactLiberty.document.addChild(this._displayObject);
      this._isRootLibertyNode = true;
    }

    if (this.componentDidMount) {
      transaction.getReactMountReady().enqueue(this.componentDidMount, this);
    }

    return this;
  }

  mountComponentToDOM() {
    try {
      //If is being added to ReactDOM node then consider X,Y of it`s bounding rect as a location
      //var DOMOwnerProperty = Object.keys(this._context)[0];
      //var DOMOwner = this._context[DOMOwnerProperty].parentTag.instance;

      this.DOMParent = ReactMount.findReactNodeByID(this._instance._rootNodeID.substr(0, this._instance._rootNodeID.lastIndexOf('.')));
      var boundingRect = this.DOMParent.getBoundingClientRect();

      var styles = window.getComputedStyle(this.DOMParent);
      var paddingLeft = parseInt(styles.paddingLeft);
      var paddingTop = parseInt(styles.paddingTop);

      this.parentX = boundingRect.left + paddingLeft;
      this.parentY = boundingRect.top + paddingTop;

      this.updateDisplayObject();
    } catch (e) {
      console.log(e);
    }
  }

  updateDisplayObject(updateChildren) {
    //console.log('Updating : ' + this.constructor.name + ', ' + JSON.stringify(this.layout));

    var halfWidth = 0;
    var halfHeight = 0;

    /*var halfWidth = (((this.layout && this.layout.width) || this.style.width) / 2) || 0;
     var halfHeight = (((this.layout && this.layout.height) || this.style.height) / 2) || 0;
     this._displayObject.pivot.x = halfWidth;
     this._displayObject.pivot.y = halfHeight;*/

    this._displayObject.scale.x = this.style.scale || 1;
    this._displayObject.scale.y = this.style.scale || 1;

    this._displayObject.x = this.style.translateX || 0 + (this.layout && this.layout.left || (this.props && this.props.x) || 0) + halfWidth;
    this._displayObject.y = this.style.translateY || 0 + (this.layout && this.layout.top || (this.props && this.props.y) || 0) + halfHeight;

    this._displayObject.alpha = this.style.opacity || 1;

    if (this.DOMParent) {
      this._displayObject.x += this.parentX;
      this._displayObject.y += this.parentY;
    }

    this._displayObject.rotation = this.props && parseInt(this.props.rotation, 10) || 0;
  }

  get style() {
    var style = (this.props && this.props.style) || this._style;
    return style;
  }

  componentDidMount() {
    if (this._isRootLibertyNode) {
      this.mountComponentToDOM();
    }
    this.updateDisplayObject();
  }

  componentWillUpdate(nextProps, prevProps) {
    this.updateDisplayObject();
  }

  componentWillUnmount() {
    if (this._displayObject) {
      this._displayObject.destroy(true);
    }
  }

  render() {
    return this;
  }
}

module.exports = ReactLibertyElement;