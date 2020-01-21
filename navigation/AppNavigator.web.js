import { createBrowserApp } from '@react-navigation/web';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {LandingScreen} from '../src/screens/LandingScreen'
import {SignupScreen} from '../src/screens/SignupScreen'
import {SignInScreen} from '../src/screens/SignInScreen'
import MainTabNavigator from './MainTabNavigator';

const AuthStack = createStackNavigator({ Landing:LandingScreen,Signup:SignupScreen,SignIn: SignInScreen });


const switchNavigator = createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStack,
  // Main: MainTabNavigator,
},
{
  initialRouteName: 'AuthLoading',
});
switchNavigator.path = '';

export default createBrowserApp(switchNavigator, { history: 'hash' });
