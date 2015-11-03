'use strict';

var React = require('react-native');
var MK = require('react-native-material-kit');
const appStyles = require('./styles');
var {
  StyleSheet,
  Text,
  View,
  TextInput,
  MKButton,
} = React;

const styles = Object.assign({}, appStyles, StyleSheet.create({
  col: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center', // this will prevent TFs from stretching horizontal
    marginLeft: 7, marginRight: 7,
    // backgroundColor: MKColor.Lime,
  },
  textfield: {
    height: 28,  // have to do it on iOS
    marginTop: 22,
  },
  textfieldWithFloatingLabel: {
    height: 38,  // have to do it on iOS
    marginTop: 10,
  },
}));
// console.log(pageStyle.textfield)
const NameField = MK.MKTextField.textfield()
  .withPlaceholder('Name')
  .withStyle(styles.textfield)
  .build();
const DescField = MK.MKTextField.textfield()
  .withPlaceholder('Description')
  .withStyle(styles.textfield)
  .build();
const EmailField = MK.MKTextField.textfield()
  .withPlaceholder('Email')
  .withStyle(styles.textfield)
  .build();
const WebField = MK.MKTextField.textfield()
  .withPlaceholder('Website')
  .withStyle(styles.textfield)
  .build();

const ColoredRaisedButton = MK.MKButton.coloredButton()
  .withText('BUTTON')
  .withOnPress(() => {
    console.log("Hi, it's a colored button!");
    console.log(this)
  })
  .build();


var Edit = React.createClass({
  getInitialState: function() {
    return {
      name: '',
      description: '',
      email: '',
      url: '',
    };
  },
  onNameChange: function(text) {
    this.setState({name: text});
  },
  onDescriptionChange: function(text) {
    this.setState({description: text});
  },
  onEmailChange: function(text) {
    this.setState({email: text});
  },
  onWebsiteChange: function(text) {
    this.setState({url: text});
  },
  
  editSubmit: function() {
    fetch("http://"+GLOBAL.url+"/rn/edit/artist", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        user: GLOBAL.user,
        name: this.state.name,
        description: this.state.description,
        email: this.state.email,
        url: this.state.url,
      })
    })
    .then(function(responce) {
      console.log(responce);
    }, function(err) {
      console.log(err)
    })
    
  },


  componentDidMount: function() {
    var self = this;
    fetch("http://"+GLOBAL.url+"/rn/edit/artist/id/" + GLOBAL.user.id, {
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'same-origin',
    }).then(function(responce) {
      return responce.json();
    }).then(function(json) {
      self.setState({
        name: json.name,
        description: json.description,
        email: json.email,
        url: json.url,
      })
    })
  },
  render: function() {
    return (
      <View style={styles.container}>
        <NameField value={this.state.name} onTextChange={this.onNameChange}/>
        <DescField value={this.state.description} onTextChange={this.onDescriptionChange}/>
        <EmailField value={this.state.email} onTextChange={this.onEmailChange}/>
        <WebField value={this.state.url} onTextChange={this.onWebsiteChange}/>
        
        <ColoredRaisedButton
        onPress={this.editSubmit}/>
      </View>
      // <ColoredRaisedButton/>
    );
  }
});




module.exports = Edit;

