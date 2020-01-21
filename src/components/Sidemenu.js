import PropTypes from 'prop-types';
import React, {Component} from 'react';
// import styles from './SideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View} from 'react-native';
import { StackNavigator } from 'react-navigation';

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeadingStyle}>
              Section 1
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
              Home Page
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.sectionHeadingStyle}>
              Section 3
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Profile')}>
              Profile Page
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>This is my fixed footer</Text>
        </View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

const styles = {
        container: {
          paddingTop: 70,
          flex: 1
        },
        navItemStyle: {
          padding: 10
        },
        navSectionStyle: {
          backgroundColor: 'lightgrey'
        },
        sectionHeadingStyle: {
          paddingVertical: 10,
          paddingHorizontal: 5
        },
        footerContainer: {
          padding: 20,
          backgroundColor: 'lightgrey'
        }
}

export default SideMenu;