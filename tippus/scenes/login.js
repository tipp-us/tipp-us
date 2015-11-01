'use strict';

var React = require('react-native');
var MK = require('react-native-material-kit');
var appStyles = require('../styles');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} = React;

const {
  MKTextField,
  MKColor,
  MKButton,
  mdl,
} = MK;

// TODO: investigate themes... would make coloring easier
// customize the material design theme
// MK.setTheme({
//   primaryColor: MKColor.Teal,
//   accentColor: MKColor.Purple,
// });

const styles = Object.assign({}, appStyles, StyleSheet.create({
  col: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center', // this will prevent TFs from stretching horizontal
    marginLeft: 7, marginRight: 7,
    // backgroundColor: MKColor.Lime,
  },
  emailWithFloatingLabel: {
    height: 38,  // have to do it on iOS
    marginTop: 30,
    // alignSelf: 'center',
  },
  passwordWithFloatingLabel: {
    height: 38,  // have to do it on iOS
    marginTop: 20,
    marginBottom: 30,
    // alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}));

const LoginButton = MKButton.coloredButton()
  .withText('Log in')
  .withStyle({
    marginBottom: 10,
  })
  // Shadows not supported yet on Android...
  // https://facebook.github.io/react-native/docs/known-issues.html#no-support-for-shadows-on-android
  // .withShadowRadius(2)
  // .withShadowOffset({width:0, height:2})
  // .withShadowOpacity(.7)
  // .withShadowColor('black')
  .build();

const FacebookLoginButton = MKButton.coloredButton()
  .withText('Log in with Facebook')
  // .withStyle(
  //   {backgroundColor: '#3B5998'}
  // )
  // .withOnPress(() => {
  //   console.log('Facebook Login button pressed!');
  //   // for local dev, you will want to replace this with your IP and port +/rn/auth/facebook
  //   fetch("http://tipp-us-staging.herokuapp.com/rn/auth/facebook", {
  //     method: 'get',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     credentials: 'same-origin',
  //   }).then(function(response) {
  //     //Response from logging in
  //     console.log('we got a reponse:', response);
  //     return response.json();      
  //   }, function(err) {console.log(err)})
  //   .then(function(jsonRes) {
  //     GLOBAL.user = jsonRes;
  //     console.log(GLOBAL.user);
  //   });
  // })
  .build();

const EmailInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Email')
  .withStyle(styles.emailWithFloatingLabel)
  .withHighlightColor(MKColor.Purple)
  .build();

const PasswordInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPassword(true)
  .withPlaceholder('Password')
  // this doesn't seem to work, investigate
  // .withTintColor(MKColor.Lime)
  .withHighlightColor(MKColor.Purple)
  .withStyle(styles.passwordWithFloatingLabel)
  .build();

var Login = React.createClass({
  getInitialState: function() {
    return {
      email: '',
      pass: '',
    }
  },
  onEmailChange: function(text) {
    this.setState({email: text});
  },
  onPasswordChange: function(text) {
    this.setState({password: text});
  },
  componentDidMount: function() {
    this.refs.defaultInput.focus();
  },
  loginSubmit: function() {
    // for local dev, you will want to replace this with your IP and port +/rn/login/artist
    fetch("http://"+GLOBAL.url+"/rn/login/artist", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      })
    })
    .then(function(response) {
      return response.json(); // returns a promise      
    }, function(err) {console.log(err)})
    .then(function(jsonRes) {
      GLOBAL.user = jsonRes; // GLOBAL can be accessed from other views  
      console.log(GLOBAL.user);
    })
    .done();
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <EmailInput
              ref="defaultInput"
              onTextChange={this.onEmailChange} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <PasswordInput 
              onTextChange={this.onPasswordChange} />
          </View>
        </View>
        <LoginButton 
          onPress={this.loginSubmit} />
        <FacebookLoginButton />
      </View>
    );
  },

});

module.exports = Login;
