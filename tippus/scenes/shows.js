'use strict';

var React = require('react-native');
var MK = require('react-native-material-kit');
const appStyles = require('./styles');

var {
  StyleSheet,
  Text,
  View,
  TextInput,
} = React;

const {
  MKButton,
  MKColor,
} = MK;

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

const VenueField = MK.MKTextField.textfield()
  .withPlaceholder('Venue')
  .withStyle(styles.textfield)
  .build();
const LatField = MK.MKTextField.textfield()
  .withPlaceholder('Lat')
  .withStyle(styles.textfield)
  .build();
const LongField = MK.MKTextField.textfield()
  .withPlaceholder('Long')
  .withStyle(styles.textfield)
  .build();
const StartTimeField = MK.MKTextField.textfield()
  .withPlaceholder('Start Time')
  .withStyle(styles.textfield)
  .build();

const EndTimeField = MK.MKTextField.textfield()
  .withPlaceholder('End Time')
  .withStyle(styles.textfield)
  .build();

const ColoredRaisedButton = MK.MKButton.coloredButton()
  .withText('ADD SHOW')
  .build();

var Shows = React.createClass({
  getInitialState: function() {
    return {
      venue: '',
      lat: '',
      long: '',
      startTime: '',
      endTime: '',
    };
  },
  onVenueChange: function(text) {
    this.setState({venue: text});
  },
  onLatChange: function(text) {
    this.setState({lat: text});
  },
  onLongChange: function(text) {
    this.setState({long: text});
  },
  onStartTimeChange: function(text) {
    this.setState({startTime: text});
  },
  onEndTimeChange: function(text) {
    this.setState({endTime: text});
  },
  editSubmit: function() {
    fetch("http://"+GLOBAL.url+"/rn/shows/add", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        user: GLOBAL.user,
        venue: this.state.venue,
        lat: this.state.lat,
        long: this.state.long,
        start: this.state.startTime,
        end: this.state.endTime,
      })
    })
    .then(function(responce) {
      console.log(responce);
    }, function(err) {
      console.log(err)
    })
    
  },
  render: function() {
    return (
      <View style={styles.container}>
        <VenueField     value={this.state.value}onTextChange={this.onVenueChange}/>
        <LatField       value={this.state.lat}onTextChange={this.onLatChange}/>
        <LongField      value={this.state.long}onTextChange={this.onLongChange}/>
        <StartTimeField value={this.state.startTime}onTextChange={this.onStartTimeChange}/>
        <EndTimeField   value={this.state.endTime}onTextChange={this.onEndTimeChange}/>
        <ColoredRaisedButton onPress={this.editSubmit}/>
      </View>
    );
  }
});


var pageStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5C6BC0',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

module.exports = Shows;

