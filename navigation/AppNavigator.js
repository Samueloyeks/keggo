import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LandingScreen  from '../src/screens/LandingScreen'
import  SignupScreen  from '../src/screens/SignupScreen'
import  SignInScreen  from '../src/screens/SignInScreen'
import AuthLoadingScreen from '../src/screens/AuthLoadingScreen';



import MainTabNavigator from './MainTabNavigator';
import StackNav from './StackNavigator'
import DrawerNav from './DrawerNavigator'
import HomeScreen from '../src/screens/HomeScreen';
import ProfileScreen from '../src/screens/ProfileScreen'
import HistoryScreen from '../src/screens/HistoryScreen'
import PaymentsScreen from '../src/screens/PaymentsScreen'



const AuthStack = createStackNavigator({ Landing: LandingScreen, Signup: SignupScreen, SignIn: SignInScreen });
// const MainStack = createStackNavigator({ Home: HomeScreen, Profile: ProfileScreen, History: HistoryScreen, Payments: PaymentsScreen ,initialRouteName:'Home'});


export default createAppContainer( 
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Main: DrawerNav,
  },
    {
      initialRouteName: 'AuthLoading',
    }),
);
