'use strict';

var React = require('react-native');
var MK = require('react-native-material-kit');
var appStyles = require('../styles');

var {
  StyleSheet,
  Text,
  Image,
  View,
} = React;

const {
  MKColor,
  MKButton,
  mdl,
} = MK;

const styles = Object.assign({}, appStyles, StyleSheet.create({
  col: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center', // this will prevent TFs from stretching horizontal
    marginLeft: 7, marginRight: 7,
    // backgroundColor: MKColor.Lime,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5C6BC0',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    marginBottom: 30,
    color: 'white',
  },
  instructions: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
  },
}));

const LButton = MKButton.coloredButton()
  .withText('Log in')
  .withTextStyle({
    color: 'white',
    fontWeight: 'bold',
  })
  .withStyle({
    marginBottom: 10,
    width: 300,
  })
  .withBackgroundColor('#EC407A')
  // Shadows not supported yet on Android...
  // https://facebook.github.io/react-native/docs/known-issues.html#no-support-for-shadows-on-android
  // .withShadowRadius(2)
  // .withShadowOffset({width:0, height:2})
  // .withShadowOpacity(.7)
  // .withShadowColor('black')
  .build();

var LoginButton = React.createClass({
  onPress: function() {
    this.props.routeFrontView('login');
  },
  render: function() {
    return (
      <LButton onPress = {this.onPress} />
    );
  }
});

const SButton = MKButton.coloredButton()
  .withText('Sign up')
  .withTextStyle({
    color: 'white',
    fontWeight: 'bold',
  })
  .withStyle({
    marginBottom: 10,
    width: 300,
  })
  .withBackgroundColor(MKColor.Indigo)
  // Shadows not supported yet on Android...
  // https://facebook.github.io/react-native/docs/known-issues.html#no-support-for-shadows-on-android
  // .withShadowRadius(2)
  // .withShadowOffset({width:0, height:2})
  // .withShadowOpacity(.7)
  // .withShadowColor('black')
  .build();

var SignupButton = React.createClass({
  onPress: function() {
    this.props.routeFrontView('signup');
  },
  render: function() {
    return (
      <SButton onPress = {this.onPress} />
    );
  }
});

var Home = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/c_scale,w_175/v1446590490/wehearttips04_zjv3ca.png'}}
          style={{width: 175, height: 247}} />
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.welcome}>tipp.us</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.instructions}>
              Tipp your hat to local artists and musicians
            </Text>
          </View>
        </View>
        <LoginButton
          routeFrontView={this.props.routeFrontView} />
        <SignupButton
          routeFrontView={this.props.routeFrontView} />
      </View>

    );
  }
});

module.exports = Home;
