/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var SlideMenu = require('react-native-navigation-drawer');
var Menu = require('./menu.js');
var SideMenu = require('react-native-side-menu');
GLOBAL.url = "tipp-us-staging.herokuapp.com";
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var Home = require('./scenes/home.js');
var Submerchant = require('./scenes/submerchant.js');
var Shows = require('./scenes/shows.js');
var Login = require('./scenes/login.js');
var Signup = require('./scenes/signup.js');
var Edit = require('./scenes/edit.js');


// Sidebar without Navigation. Commented out until navigation is implemented

// var SideMenu = require('react-native-side-menu');

// var {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Component
// } = React;

// class Button extends Component {
//   handlePress(event) {
//     this.context.menuActions.toggle();
//     if (this.props.onPress) {
//       this.props.onPress(event);
//     }
//   }

//   render() {
//     return (
//       <TouchableOpacity
//         onPress={this.handlePress.bind(this)}
//         style={this.props.style}>
//         <Text>{this.props.children}</Text>
//       </TouchableOpacity>
//     );
//   }
// }

// Button.contextTypes = {
//   menuActions: React.PropTypes.object.isRequired
// };

// class tippus extends Component {
//   constructor(props, ctx) {
//     super(props, ctx);

//     this.state = {
//       touchToClose: false,
//     };
//   }

//   handleChange(isOpen) {
//     if (!isOpen) {
//       this.setState({
//         touchToClose: false,
//       });
//     }
//   }

//   render() {
//     return (
//       <SideMenu
//         menu={<Menu />}
//         touchToClose={this.state.touchToClose}
//         onChange={this.handleChange.bind(this)}>
//         <View style={style.container}>
//           <Text style={style.welcome}>
//             tippus
//           </Text>
//           <Text style={style.instructions}>
//             Tipp your hat to local artists and musicians
//           </Text>
//         </View>
//         <Button style={style.button}>
//           Hamburger
//         </Button>
//       </SideMenu>
//     );
//   }
// };

// var style = StyleSheet.create({
//   button: {
//     position: 'absolute',
//     top: 20,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#5C6BC0',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });


var tippus = React.createClass({
  getInitialState: function(fragmentId) {
    return ({ route: 'home' });
  },

  updateFrontView: function() {
    switch (this.state.route) {
      case 'home':
        return <Home />;
      case 'shows':
        return <Shows />;
      case 'banking':
        return <Submerchant />;
      case 'login':
        return <Login />
      case 'signup':
        return <Signup />
      case 'edit':
        return <Edit />;
    }
  },

  routeFrontView: function(fragmentId) {
    this.refs.slideMenu.blockSlideMenu(false);
    this.setState({ route: fragmentId });
  },

  render: function() {
    var fragment = this.updateFrontView();
    return (
      <View style={styles.container}>
        <SlideMenu ref="slideMenu" frontView={fragment}
          routeFrontView={this.routeFrontView} menu={<Menu />}
          slideWay='left' moveFrontView={false} width={200}/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('tippus', () => tippus);
