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
    // var obj = {email:"j@j.j", password:"asdf"};
    // var string = JSON.stringify(obj);
    // var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    // xmlhttp.onreadystatechange = function(e) {
    //   if (xmlhttp.readyState !== 4) {
    //     return;
    //   }
    //   console.log(e)
    //   if (xmlhttp.status === 200) {
    //     console.log('success 1 ', xmlhttp);
    //   } else {
    //     console.warn('error');
    //   }
    //   var newXml = new XMLHttpRequest();
    //   newXml.onreadystatechange = function(e) {
    //     if (newXml.readyState !== 4) {
    //       return;
    //     }
    //     console.log(newXml)
    //     if (newXml.status === 200) {
    //       console.log('success 2', newXml);
    //     } else {
    //       console.warn('error');
    //     }
    //   };
    //   newXml.open("GET", "http://192.168.1.215:3000/edit/artist", true);
    //   //newXml.setRequestHeader("Content-Type", "application/json");
    //   newXml.send();
    // };
    // xmlhttp.open("POST", "http://192.168.1.215:3000/login/artist");
    // xmlhttp.setRequestHeader("Content-Type", "application/json");
    // xmlhttp.send(string);
    //xmlhttp.send(JSON.stringify({});


    //Temp login to server
    // fetch("http://192.168.1.215:3000/login/artist", {
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   credentials: 'same-origin',
    //   body: JSON.stringify({
    //     email: 'j@j.j',
    //     password: 'asdf',
    //   })
    // }).then(function(response) {
    //   console.log(response)
    //   //try to fetch from server now
    //   fetch("http://192.168.1.215:3000/edit/artist", {
    //     credentials: 'same-origin',
    //   }).then(function(response) {
    //     console.log(response)
    //   })
    // })
  },
  render: function() {
    return (
      <View style={styles.container}>
        <NameField onTextChange={this.onNameChange}/>
        <DescField onTextChange={this.onDescriptionChange}/>
        <EmailField onTextChange={this.onEmailChange}/>
        <WebField onTextChange={this.onWebsiteChange}/>
        
        <ColoredRaisedButton
        onPress={this.editSubmit}/>
      </View>
      // <ColoredRaisedButton/>
    );
  }
});




module.exports = Edit;

