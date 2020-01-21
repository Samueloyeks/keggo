import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View, TouchableOpacity,Image
} from 'react-native';

import { StackNavigator } from  'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import IOSIcon from "react-native-vector-icons/Ionicons";
import HomeScreen from '../src/screens/HomeScreen';
import ProfileScreen from '../src/screens/ProfileScreen'
import HistoryScreen from '../src/screens/HistoryScreen'
import PaymentsScreen from '../src/screens/PaymentsScreen'
import menuIcon from '../assets/images/menu.png'

const stackNav = createStackNavigator({
  Home : {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      title: "Home",
      headerLeft:()=><TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                            <View style={styles.menu}><Image source={menuIcon} /></View>
                      </TouchableOpacity>,
    })
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({navigation}) => ({
      title: "Profile",
    })     
  },
  initialRouteName:'Home'
});

const styles={
  menu:{
    padding:10,
    float:'right'
  }
}

export default stackNav;