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

var email = '';
var pass = '';

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
  .withOnPress(() => {
    console.log("Login button pressed!");
    // for local dev, you will want to replace this with your IP and port +/rn/login/artist
    fetch("http://tipp-us-staging.herokuapp.com/rn/login/artist", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        email: 'h@h.h',
        password: 'hhh',
      })
    }).then(function(response) {
      //Response from logging in
      return response.json();      
    }, function(err) {console.log(err)})
    .then(function(jsonRes) {
      GLOBAL.user = jsonRes;
      console.log(GLOBAL.user);
    });
  })
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

const TextfieldWithFloatingLabel = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Email')
  .withStyle(styles.emailWithFloatingLabel)
  .withHighlightColor(MKColor.Purple)
  // .withFloatingLabelFont({
  //   fontSize: 10,
  //   fontStyle: 'italic',
  //   fontWeight: '200',
  // })
  // .withKeyboardType('numeric')
  .build();

const PasswordInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPassword(true)
  .withPlaceholder('Password')
  // .withDefaultValue('!123')
  // .withTintColor(MKColor.Lime)
  .withHighlightColor(MKColor.Purple)
  .withStyle(styles.passwordWithFloatingLabel)
  .withOnFocus(() => console.log('Focus'))
  .withOnBlur(() => console.log('Blur'))
  .withOnEndEditing((e) => console.log('EndEditing', e.nativeEvent.text))
  .withOnSubmitEditing((e) => console.log('SubmitEditing', e.nativeEvent.text))
  .withOnTextChange((e) => console.log('TextChange', e))
  .withOnChangeText((e) => console.log('ChangeText', e))
  .build();

var Login = React.createClass({
  getInitialState: function() {
    return {
      email: '',
      pass: '',
    }
  },
  componentDidMount: function() {
    this.refs.defaultInput.focus();
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <TextfieldWithFloatingLabel
              ref="defaultInput" />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <PasswordInput />
          </View>
        </View>
        <LoginButton />
        <FacebookLoginButton />
      </View>
    );
  },

});

module.exports = Login;
