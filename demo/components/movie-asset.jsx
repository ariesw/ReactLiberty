var React = require('react');
var ReactLiberty = require('../../src/index');
var Motion = require('react-motion').Motion;
var spring = require('react-motion').spring;

var PLACEHOLDER = require('../assets/images/placeholder.png');
var HIGHLIGHT = require('../assets/images/app-highlight.png');

var FocusManager = require('improved-navigation-concept').FocusManager;

class MovieAsset extends React.Component {
    static styles = {
        width: 164,
        marginRight: 24,
        image: {
            width: 164,
            height: 164,
            marginRight: 24
        },
        title: {
            fontFamily: 'InterstatePro',
            fontSize: 20,
            width: 129,
            marginTop: 0,
            marginLeft: 10,
            worldWarp: true,
            height: 30,
            color: '#ffffff'
        },
        focus: {
            position: 'absolute',
            width: 164,
            height: 222,
            opacity: 0.001
        }
    }

    constructor(props) {
        super(props);
        this.id = String(Date.now());
    }

    shouldComponentUpdate(a, b) {
      if (a.selected !== this.props.selected) {
        return true;
      } else {
        return false;
      }
    }

    render() {
        var opacitySpring = null;
        var styles = MovieAsset.styles;
        var self = this;

        if (this.props.selected) {
            opacitySpring = spring(0.99, [120, 17]);
        } else {
            opacitySpring = spring(0.001, [120, 17])
        }

        return <Div>
            <Motion key="focus-motion" defaultStyle={styles.focus} style={{opacity: opacitySpring}}>
                {function(interpolatedStyle) {
                    return <Img style={interpolatedStyle} src={HIGHLIGHT} key="focus"/>
                }}
            </Motion>;
            <Img style={styles.image} src={self.props.data.images.icon['192x192'] || PLACEHOLDER} key="3"/>
            <P style={styles.title} key="1">{self.props.data.name}</P>
        </Div>;
    }

    componentWillMount() {
        this.parentId = this.context.navigationContainerId;
        FocusManager.registerFocusableComponent(this);
    }
}

MovieAsset.defaultProps = {
    onBlur: function() {},
    onFocus: function() {},
    onSelect: function() {}
};

MovieAsset.contextTypes = {
    navigationContainerId: React.PropTypes.string
};

module.exports = MovieAsset;