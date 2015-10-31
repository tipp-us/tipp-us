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

const styles = Object.assign({}, appStyles, StyleSheet.create({
  col: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 7, marginRight: 7,
  },
  allInputs: {
    height: 38,  
    marginTop: 30,
  },
  lastInput: {
    height: 38, 
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}));

const SubmitBankingButton = MKButton.accentColoredButton()
  .withText('Submit')
  .withOnPress(() => {
    console.log("Submitted!");
  })
  .build();

const NameInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Full Name')
  .withStyle(styles.allInputs)
  .withHighlightColor(MKColor.Purple)
  .build();

const PhoneInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Phone Number')
  .withStyle(styles.allInputs)
  .withHighlightColor(MKColor.Purple)
  .build();

const DOBInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('DOB (YYYY-MM-DD)')
  .withStyle(styles.allInputs)
  .withHighlightColor(MKColor.Purple)
  .build();

const AddressInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Address')
  .withStyle(styles.allInputs)
  .withHighlightColor(MKColor.Purple)
  .build();

const RegionInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('City/State/ZIP')
  .withStyle(styles.lastInput)
  .withHighlightColor(MKColor.Purple)
  .build();

const AccountInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Account Number')
  .withStyle(styles.allInputs)
  .withHighlightColor(MKColor.Purple)
  .build();

const RoutingInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Routing Number')
  .withStyle(styles.lastInput)
  .withHighlightColor(MKColor.Purple)
  .build();

var Submerchant = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Personal Information</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <NameInput/>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <PhoneInput/>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <DOBInput/>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <AddressInput/>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <RegionInput/>
          </View>
        </View>
        <Text style={styles.title}>Banking Information</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <AccountInput/>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <RoutingInput/>
          </View>
        </View>
        <SubmitBankingButton />
      </View>
    );
  }
});

module.exports = Submerchant;
