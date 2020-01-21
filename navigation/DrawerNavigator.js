import React, { Component } from 'react';
import { AppRegistry, Dimensions } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';


import SideMenu from '../src/components/Sidemenu'
import stackNav from './StackNavigator';

const drawernav = createDrawerNavigator({
  Item1: {
      screen: stackNav,
    }
  }, {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get('window').width - 120,  
});

export default drawernav

