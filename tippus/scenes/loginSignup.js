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
  textfield: {
    height: 28,  // have to do it on iOS
    marginTop: 22,
  },
  textfieldWithFloatingLabel: {
    height: 38,  // have to do it on iOS
    marginTop: 10,
  },
}));

const Textfield = MKTextField.textfield()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .build();

const ColoredRaisedButton = MKButton.coloredButton()
  .withText('BUTTON')
  .withOnPress(() => {
    console.log("Hi, it's a colored button!");
  })
  .build();

const TextfieldWithFloatingLabel = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Number...')
  .withStyle(styles.textfieldWithFloatingLabel)
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '200',
  })
  .withKeyboardType('numeric')
  .build();

const ColoredTextfield = mdl.Textfield.textfield()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .withTintColor(MKColor.Lime)
  .withTextInputStyle({color: MKColor.Orange})
  .build();

const PasswordInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPassword(true)
  .withPlaceholder('Password')
  .withDefaultValue('!123')
  .withHighlightColor(MKColor.Lime)
  .withStyle(styles.textfieldWithFloatingLabel)
  .withOnFocus(() => console.log('Focus'))
  .withOnBlur(() => console.log('Blur'))
  .withOnEndEditing((e) => console.log('EndEditing', e.nativeEvent.text))
  .withOnSubmitEditing((e) => console.log('SubmitEditing', e.nativeEvent.text))
  .withOnTextChange((e) => console.log('TextChange', e))
  .withOnChangeText((e) => console.log('ChangeText', e))
  .build();

var LoginSignup = React.createClass({
  componentDidMount: function() {
    this.refs.defaultInput.focus();
  },
  render: function() {
    return (
      <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Textfield/>
            <Text style={styles.legendLabel}>Textfield</Text>
          </View>
          <View style={styles.col}>
            <TextfieldWithFloatingLabel ref="defaultInput"/>
            <Text style={styles.legendLabel}>With floating label</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <ColoredTextfield/>
            <Text style={styles.legendLabel}>Textfield</Text>
          </View>
          <View style={styles.col}>
            <PasswordInput/>
            <Text style={styles.legendLabel}>With floating label</Text>
          </View>
        </View>
        <ColoredRaisedButton />
      </ScrollView>
    );
  },

});




module.exports = LoginSignup;
