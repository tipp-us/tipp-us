'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var Home = React.createClass({
  render: function() {
    return (
      <View style={style.container}>
        <Text style={style.welcome}>
          tippus
        </Text>
        <Text style={style.instructions}>
          Tipp your hat to local artists and musicians
        </Text>
      </View>
    );
  }
});

var style = StyleSheet.create({
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = Home;
