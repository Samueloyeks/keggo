import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image, ScrollView ,
  Alert,
  SafeAreaView
} from 'react-native';
import facebookImg from '../../assets/images/facebook.png'
import googleImg from '../../assets/images/google.png'
import twitterImg from '../../assets/images/twitter.png'
import FBSDK, { LoginManager, AccessToken, LoginButton } from 'react-native-fbsdk';
import * as firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import { NativeModules } from 'react-native';
import Loader from 'react-native-overlay-loader';



const { RNTwitterSignIn } = NativeModules;
const { TwitterAuthProvider } = firebase.auth;
import keys from '../models/Keys'
import user from '../models/UserModel'





export default class SignInScreen extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        phone:'',
        loading:false,
      }
    }


    facebookLogin() {
      return new Promise((resolve,reject)=>{
          try {
              let result =  LoginManager.logInWithPermissions(['public_profile','email']);
              if (result.isCancelled) {
                  alert('Login was cancelled')
              } else {
                  AccessToken.getCurrentAccessToken()
                  .then((data) => {
                    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                    firebase.auth().signInWithCredential(credential)
                      .then((data)=>{
                          var userData = {
                              name: data.additionalUserInfo.profile.name,
                              email: data.additionalUserInfo.profile.email
                          }
                          // alert(JSON.stringify(data))
                          // AsyncStorage.setItem('userData',JSON.stringify(userData))
                          resolve(true)
                      })
                  })
              } 
          } catch (err) { 
              alert(err)
          }
      })
  }

  async googleLogin() {
    try {
      // await GoogleSignin.configure();
      await GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: keys.GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: '', // specifies a hosted domain restriction
        loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
        accountName: '', // [Android] specifies an account name on the device that should be used
        iosClientId: keys.IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });
  
      const data = await GoogleSignin.signIn();
  
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential).then((data)=>{
        var userData = {
            name: data.additionalUserInfo.profile.name,
            email: data.additionalUserInfo.profile.email
        }
        alert(JSON.stringify(data))
        // AsyncStorage.setItem('userData',JSON.stringify(userData))
    })
  
      // console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (e) {
      alert(e)
      console.error(e);
    }
  }

  async twitterLogin(){
    try {
      RNTwitterSignIn.init(keys.TWITTER_CONSUMER_KEY, keys.TWITTER_CONSUMER_SECRET).then((data)=>{
        alert(data)
      },err=>{alert(err)})
      const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn()
      alert('token',authToken)
  
      const credential = TwitterAuthProvider.credential(authToken, authTokenSecret);
      alert('credential',credential)
  
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential).then((data)=>{
        alert('DATA')
        alert(JSON.stringify(data))
      },error=>{
        alert(error)
      })

      console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (e) {
      alert(e);
    }
  }

  emailSignup(userData, password){
    return firebase
      .auth()
      .createUserWithEmailAndPassword(userData["email"], password)
      .then(newUserCredentials => {
        firebase
          .database()
          .ref(`/userProfile/` + newUserCredentials.user.uid)
          .set(userData)
          .then(() => {
            firebase.auth().currentUser.sendEmailVerification();
            //Email sent
          });
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  _handleFacebookSubmit = () => {
    const navigation = this.props.navigation;
    // setStorage(true)
    this.facebookLogin()
      .then(() => navigation.navigate("Main"));
  }

  _handleGoogleSubmit = () => {
    const navigation = this.props.navigation;
    // setStorage(true)
    this.googleLogin()
      .then(() => navigation.navigate("Main"));
  }

  _handleTwitterSubmit = () => {
    const navigation = this.props.navigation;
    // setStorage(true)
    this.twitterLogin()
      .then(() => navigation.navigate("Main"));
  }

  showLoader = (ref) => {
    (ref)?ref.show():null
    // setTimeout(() => {
    //     ref.hide();
    // }, 1000);
  };

    signup(){
      this.setState({loading:true})
      const navigation = this.props.navigation;
      const { firstName,lastName,email, password,phone } = this.state;
      user.firstName=firstName;
      user.lastName=lastName;
      user.email = email;
      user.phone = phone;
      this.emailSignup(user,password).then(()=>{
      // this.setState({loading:false})
      AsyncStorage.setItem('userData',JSON.stringify(user))
      }).then(() => navigation.navigate("Main"));
    }



      render() {
          return <View style={{flex:1}}>
                        {this.state.loading?
                          <Loader
                          ref={(ref) => this.showLoader(ref)}
                          />
            :null}
           <View style={styles.topView}>
            <Text style={{color:'#FFF',fontSize:24,fontWeight:'bold'}}>Sign up</Text>
           </View>
           <View style={{backgroundColor:'#4A087D',height:'100%',flex:1}}>
            <View style={{backgroundColor:'#FFF',borderTopRightRadius: 35,height:'100%',alignItems:'center',flex:1,}}>
            <SafeAreaView style={{flex: 1}}>
              
            <ScrollView  style={{width:'80%',marginHorizontal: 20,flex:1}} showsVerticalScrollIndicator={false}>
              <View style={{flex:1,flexDirection: 'column',marginBottom:20}}>
                {/* input */}
                <TextInput style={styles.input}  placeholder='First Name' value={this.state.firstName} onChangeText={(firstName)=>this.setState({firstName})}/>
                <TextInput style={styles.input}  placeholder='Last Name' value={this.state.lastName} onChangeText={(lastName)=>this.setState({lastName})}/>
              <TextInput style={styles.input} keyboardType = 'email-address'  placeholder='Email' value={this.state.email} onChangeText={(email)=>this.setState({email})}/>
              <TextInput secureTextEntry={true}   style={styles.input}  placeholder='Password' value={this.state.password} onChangeText={(password)=>this.setState({password})}/>
              <TextInput  style={styles.input} keyboardType='phone-pad'  placeholder='Phone Number' value={this.state.phone} onChangeText={(phone)=>this.setState({phone})}/>

              <TouchableOpacity onPress={this.signup.bind(this)} style={styles.button} ><Text style={styles.buttonText}>Sign Up</Text></TouchableOpacity>

                {/* line */}
              <View style={{flexWrap:'wrap',alignItems:'center',flexDirection:'row',justifyContent:'center',marginTop:30}}>
              <View style={{borderBottomColor: '#000000',borderBottomWidth: 0.4,width:'20%',alignSelf:'flex-start',display:'flex',margin:20}}/>
              <Text style={{flexDirection:'column',textAlignVertical:'center'}}>or connect with</Text>
              <View style={{borderBottomColor: '#000000',borderBottomWidth: 0.4,width:'20%',alignSelf:'flex-end',display:'flex',margin:20,}}/>
              </View>

              {/* social login */}
              <View style={{flexWrap:'wrap',alignItems:'center',flexDirection:'row',justifyContent:'space-evenly',marginTop:30}}>
              <Text style={{flexDirection:'column',textAlignVertical:'center'}}>Sign up with:</Text>
              <TouchableOpacity onPress={this._handleFacebookSubmit.bind(this)}>
                <View style={{width:40,height:40}}>
                  <Image source={facebookImg}></Image>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._handleGoogleSubmit.bind(this)}>
                <View style={{width:40,height:40}}>
                  <Image source={googleImg}></Image>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this._handleTwitterSubmit.bind(this)}>
                <View style={{width:40,height:40}}>
                  <Image source={twitterImg}></Image>
                </View>
              </TouchableOpacity>
              </View>
              </View>
            </ScrollView>
            </SafeAreaView>
            </View>
           </View>
          </View>;
      }
}

const styles={
  topView:{
    height:200,
    backgroundColor:'#4A087D',
    alignItems:'center',
    justifyContent:'center',
    borderBottomLeftRadius: 35,
  },
  button:{
    backgroundColor: '#4A087D',
    borderRadius: 35,
    // width: '100%',
    height: 57,
    textAlign:'center',
    alignItems:'center',
    justifyContent:'center', 
    marginTop:20,
  },
  buttonText:{
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 21,
    color: '#FFF'
  }, 
  input:{
    width:300,
    margin:30,
    borderBottomColor:'#000000',
    borderBottomWidth:0.4,
  }
}


