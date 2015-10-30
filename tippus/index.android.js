/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var SlideMenu = require('react-native-navigation-drawer');
var Menu = require('./menu.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var Submerchant = require('./scenes/submerchant.js');
var Home = require('./scenes/home.js');

var tippus = React.createClass({
  getInitialState: function(fragmentId) {
    return ({ route: 'home' });
  },

  updateFrontView: function() {
    switch (this.state.route) {
      case 'home':
        return <Home />;
      case 'banking':
        return <Submerchant />;
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
