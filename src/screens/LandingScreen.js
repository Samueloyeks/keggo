import React from 'react';
import { StyleSheet,View,Text,Image, TouchableOpacity} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
// import {  } from 'react-native-gesture-handler';


 
 
const slides = [
    {
      key: 'first',
      title: 'TITLE 1',
      text: 'Unable to go to the gas station?',
      image: require('../../assets/images/intro-image1.png'),
      backgroundColor: 'red',
    },
    {
      key: 'second',
      title: 'Title 2',
      text: 'Have your fuel and petroleum products delivered to your doorstep', 
      image: require('../../assets/images/intro-image2.png'),
      backgroundColor: '#febe29',
    }
  ];
 
  export default class LandingScreen extends React.Component {


    state = {
      showRealApp: false,
    }

    _renderItem = (item) => { 
      return (
        <View style={styles.slide}>
          <Image source={item['item'].image}  style={styles.image}/>
          <Text style={styles.text}>{item['item'].text}</Text>
          <TouchableOpacity onPress={() =>this.props.navigation.navigate('SignIn')} style={styles.button} ><Text style={styles.buttonText}>Sign In</Text></TouchableOpacity>

          <TouchableOpacity onPress={() =>this.props.navigation.navigate('Signup')} style={styles.transparentButton}><Text style={styles.transparentButtonText}>Create an Account</Text></TouchableOpacity>
        </View>
      );
    }

    _onDone = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        this.setState({ showRealApp: true });
      }


    render() {
        return <AppIntroSlider style={styles.slider} renderItem={this._renderItem} slides={slides} onDone={this._onDone} />;
    }
  }

   
const styles = StyleSheet.create({
    mainContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    image: {
      // width: '30%',
      // height: '40%',
    },
    text: {
      color: 'black',
      backgroundColor: 'transparent',
      textAlign: 'center',
      paddingHorizontal: 16,
      fontSize:24,
      margin:30,
    },
    title: {
      fontSize: 22,
      color: 'black',
      backgroundColor: 'transparent',
      textAlign: 'center',
      marginBottom: 16,
    },
    slide:{
      width:'100%',
      height:'100%',
      flex:1,
      alignItems:'center',
      justifyContent:'center',
    },
    slider:{
       flex:1,
       height:'50%'
    },
    button:{
      backgroundColor: '#4A087D',
      borderRadius: 35,
      width: 300,
      height: 57,
      textAlign:'center',
      alignItems:'center',
      justifyContent:'center', 
      marginTop:10,
    },
    buttonText:{
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 21,
      color: '#FFF'
    },    
    transparentButton:{
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor:'#4A087D',
      borderRadius: 35,
      width: 300,
      height: 57,
      textAlign:'center',
      alignItems:'center',
      justifyContent:'center', 
      marginTop:10,
    },
    transparentButtonText:{
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 21,
      color: '#4A087D'
    }

  });