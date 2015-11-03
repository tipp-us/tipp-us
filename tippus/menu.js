'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Text,
  View,
  Image,
} = React;

var uri = 'http://www.cineversity.tv/artist/DJ%20Kat/bio/DJ%20Kat.jpg';

var Menu = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollView}>
          <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri, }}/>
          <Text style={styles.name}>DJ Kat</Text>
        </View>


          <Section
            id='home'
            name='Home'
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
      <TouchableHighlight onPress={this.onPress} style={styles.button}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>{this.props.name.toUpperCase()}</Text>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAF6',
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  buttonView: {
    justifyContent: 'center',
    padding: 4,
    width: 180,
    height: 50,
    backgroundColor: '#EC407A',
    borderRadius: 4
  },

  button: {
    marginBottom: 20,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  name: {
    top: 10,
    bottom: 20
  },
});

module.exports = Menu;