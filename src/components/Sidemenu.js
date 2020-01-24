import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import styles from './SideMenu.style';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import Loader from 'react-native-overlay-loader';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';



const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [
  'Cancel',
  {
    component: <Text style={{ fontSize: 24 }}>Yes</Text>,
    height: 50,
  },
]
const title = <Text style={{ color: 'crimson', fontSize: 18 }}>Log Out?</Text>

class SideMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selected: 0
    }
  }

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  showActionSheet = () => this.actionSheet.show()

  getActionSheetRef = ref => (this.actionSheet = ref)

  handlePress = async (index) => {
    const navigation = this.props.navigation;

    this.setState({ selected: index });
    if (index === 1) {
      this.logOut()
    }
  }

  async logOut() {
    const navigation = this.props.navigation;
    await AsyncStorage.removeItem('userData').then(() => {
      firebase.auth().signOut()
      navigation.navigate("Auth")
    })
  }


  showLoader = (ref) => {
    (ref) ? ref.show() : null
  };

  render() {
    return (
      <View style={styles.container}>
        {(this.state.selected == 1) ?
          <Loader
            ref={(ref) => this.showLoader(ref)}
          />
          : null}
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
              Section 2
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Profile')}>
                Profile Page
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.sectionHeadingStyle}>
              Section 3
            </Text>
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.showActionSheet}>
                Log Out
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>This is my fixed footer</Text>
        </View>

        <ActionSheet
          ref={this.getActionSheetRef}
          title={title}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />
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