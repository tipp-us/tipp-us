'use strict';

var React = require('react-native');
var MK = require('react-native-material-kit');
var appStyles = require('../styles');
var {FBLoginManager, FBLogin} = require('react-native-facebook-login/android');

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
    // alignSelf: 'center',
  },
  confirmWithFloatingLabel: {
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

const SignupButton = MKButton.coloredButton()
  .withText('Sign up')
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

const FacebookSignupButton = MKButton.coloredButton()
  .withText('Sign up with Facebook')
  // .withStyle(
  //   {backgroundColor: '#3B5998'}
  // )
  // .withOnPress(() => {
  //   console.log('Facebook Signup button pressed!');
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

const PasswordConfirm = mdl.Textfield.textfieldWithFloatingLabel()
  .withPassword(true)
  .withPlaceholder('Confirm Password')
  // this doesn't seem to work, investigate
  // .withTintColor(MKColor.Lime)
  .withHighlightColor(MKColor.Purple)
  .withStyle(styles.confirmWithFloatingLabel)
  .build();

var Signup = React.createClass({
  getInitialState: function() {
    return {
      email: '',
      pass: '',
      confirmPass: '',
      isMatched: false,
    }
  },
  componentDidMount: function() {
    this.refs.defaultInput.focus();
  },
  onEmailChange: function(text) {
    this.setState({email: text});
  },
  onPasswordChange: function(text) {
    this.setState({pass: text});
  },
  onConfirmChange: function(text) {
    this.setState({confirmPass: text});
    if (this.state.pass === this.state.confirmPass) {
      this.setState({isMatched: true});
    } else {
      this.setState({isMatched: false});
    }
    console.log(this.state.isMatched);
  },
  signupSubmit: function() {
    if (this.state.isMatched && this.state.email && this.state.pass && this.state.confirmPass) {
      // for local dev, you will want to replace this with your IP and port +/rn/create/artist
      fetch("http://"+GLOBAL.url+"/rn/create/artist", {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.pass,
        })
      }).then(function(response) {
        return response.json(); // returns a promise
      }, function(err) {console.log(err)})
      .then(function(jsonRes) {
        GLOBAL.user = jsonRes; // GLOBAL can be accessed from other views
        console.log(GLOBAL.user);
      })
      .done();
    }
  },
  onFacebookSignup: function(fbObj) {
    // console.log(fbObj);
    // for local dev, you will want to replace this with your IP and port +/rn/login/artist
    fetch('http://' + GLOBAL.url + '/rn/auth/facebook', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        facebookId: fbObj.profile.id,
      }),
    }).then(function(response) {
      return response.json();      
    }, function(err) {console.log(err);})
    .then(function(jsonRes) {
      GLOBAL.user = jsonRes;
      console.log(GLOBAL.user);
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Signup</Text>
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
        <View style={styles.row}>
          <View style={styles.col}>
            <PasswordConfirm
            onTextChange={this.onConfirmChange} />
          </View>
        </View>
        <SignupButton 
          onPress={this.signupSubmit} />
        <FBLogin
          onLogin={this.onFacebookSignup}
          onLogout={function(e){console.log(e)}}
          onCancel={function(e){console.log(e)}}
          onPermissionsMissing={function(e){console.log(e)}} />
      </View>
    );
  },

});

module.exports = Signup;
