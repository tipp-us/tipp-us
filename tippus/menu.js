'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Text,
  View,
} = React;

var Menu = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollView}>

          <Section
            id='home'
            name='Home'
            toggleSlideMenu={this.props.toggleSlideMenu}
            routeFrontView={this.props.routeFrontView}/>

          <Section
            id='banking'
            name='Banking'
            toggleSlideMenu={this.props.toggleSlideMenu}
            routeFrontView={this.props.routeFrontView}/>
          
          <Section
            id='login'
            name='Login'
            toggleSlideMenu={this.props.toggleSlideMenu}
            routeFrontView={this.props.routeFrontView}/>

          <Section
            id='signup'
            name='Signup'
            toggleSlideMenu={this.props.toggleSlideMenu}
            routeFrontView={this.props.routeFrontView}/>

          <Section
            id='shows'
            name='Shows'
            toggleSlideMenu={this.props.toggleSlideMenu}
            routeFrontView={this.props.routeFrontView}/>

          <Section
            id='edit'
            name='Edit'
            toggleSlideMenu={this.props.toggleSlideMenu}
            routeFrontView={this.props.routeFrontView}/>

          {/*put more sections here*/}

        </ScrollView>
      </View>
    );
  }
});

var Section = React.createClass({
  onPress() {
    if (this.props.toggleSlideMenu)
      this.props.toggleSlideMenu();
    if (this.props.routeFrontView)
      this.props.routeFrontView(this.props.id);
  },
  render() {
    return (
      <TouchableHighlight underlayColor='#DFDFDF' onPress={this.onPress}>
        <View style={styles.section}>
          <Text style={styles.sectionName}>{this.props.name.toUpperCase()}</Text>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flex: 1,
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 50,
  },
  section: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionName: {
    fontSize: 15,
    marginLeft: 10,
    color: '#E8EAF6',
  },
});

module.exports = Menu;