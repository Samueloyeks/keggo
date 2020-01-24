import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ScrollView
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
import Toast from 'react-native-root-toast';



const { RNTwitterSignIn } = NativeModules;
const { TwitterAuthProvider } = firebase.auth;
import keys from '../models/Keys'










export default class SignInScreen extends React.Component {
  customLoader;
  defaultLoader;
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false
    }
  }


  changeEmail() {
    this.setState({})
  }



  login() {
    const navigation = this.props.navigation;
    const { email, password } = this.state;
    this.setState({ loading: true })
    try{
      this.emailLogin(email,password).then((authData)=>{
        firebase.database().ref(`/userProfile/${firebase.auth().currentUser.uid}`).once('value', async userProfileSnapshot => {
          var user = userProfileSnapshot.val();
          if(authData.user.emailVerified){
            await AsyncStorage.removeItem('userData').then(()=>{
              AsyncStorage.setItem('userData', JSON.stringify(user))
              .then(()=>{ navigation.navigate("Main")})
            })
          }else{
            this.setState({loading:false})
            this.showToast('Please verify email')
          }
        })
      })
    }catch(ex){
      this.setState({loading:false})
      this.showToast(ex) 
    }
    // Alert.alert('Credentials', `email: ${email} + password: ${password}`);
    // this.props.navigation.navigate('Main')
  }

  emailLogin(email, password){
    return firebase.auth().signInWithEmailAndPassword(email, password).catch(err=>{
      this.setState({loading:false})
      this.showToast(err)
    })
  }

  facebookLogin() {
    return new Promise((resolve, reject) => {
      try {
        let result = LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
          alert('Login was cancelled')
        } else {
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
              firebase.auth().signInWithCredential(credential)
                .then((data) => {
                  user.firstName = data.additionalUserInfo.profile.first_name;
                  user.lastName = data.additionalUserInfo.profile.last_name;
                  user.email = data.additionalUserInfo.profile.email;
                  user.phone = data.user.phoneNumber;
                  user.profilePicture = data.additionalUserInfo.profile.picture.data.url
                  user.id = data.user.uid
                  firebase
                  .database()
                  .ref(`/userProfile/${data.user.uid}`)
                  .set(user)
                  .then(() => {
                    firebase.auth().currentUser.sendEmailVerification()
                      resolve(user)
                    //Email sent
                  });
                })
            })
        }
      } catch (err) {
        alert(err)
      }
    })
  }

  async googleLogin() {
    return new Promise(async (resolve,reject)=>{
      try {
        // await GoogleSignin.configure();
        await GoogleSignin.configure({
          scopes: ['https://www.googleapis.com/auth/drive.readonly'],
          offlineAccess: true,
          hostedDomain: '',
          loginHint: '',
          forceConsentPrompt: true,
          accountName: '',
          iosClientId: keys.IOS_CLIENT_ID,
          webClientId: keys.GOOGLE_WEB_CLIENT_ID
        });
  
        const data = await GoogleSignin.signIn();
        const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
        firebase.auth().signInWithCredential(credential).then((data) => {
          user.firstName = data.additionalUserInfo.profile['given_name']
          user.lastName = data.additionalUserInfo.profile['family_name']
          user.email = data.additionalUserInfo.profile['email']
          user.profilePicture = data.additionalUserInfo.profile['picture']
          user.id = data.user.uid
  
          firebase
            .database()
            .ref(`/userProfile/${data.user.uid}`)
            .set(user)
            .then(() => {
              firebase.auth().currentUser.sendEmailVerification()
                resolve(user)
              //Email sent
            });
        })
  
        // console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
      } catch (e) {
        this.showToast(e)
      }
    })
  }

  async twitterLogin() {
    return new Promise(async (resolve,reject)=>{
      try {
          RNTwitterSignIn.init(keys.TWITTER_CONSUMER_KEY, keys.TWITTER_CONSUMER_SECRET)

        const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn()
  
        const credential = TwitterAuthProvider.credential(authToken, authTokenSecret);
  
        firebase.auth().signInWithCredential(credential).then((data)=>{
          user.firstName = data.user.displayName;
          user.email = data.user.email;
          user.phone = data.user.phoneNumber;
          user.profilePicture = data.user.photoURL
          user.id = data.user.uid

          firebase
          .database()
          .ref(`/userProfile/${data.user.uid}`)
          .set(user)
          .then(() => {
            // firebase.auth().currentUser.sendEmailVerification()
              resolve(user)
          });
        })  
      } catch (e) {
        alert(e);
      }
    },err=>alert(err))
  }

  _handleFacebookSubmit = () => {
    this.setState({loading:true})
    const navigation = this.props.navigation;
    this.facebookLogin()
    .then((user) => {
      AsyncStorage.setItem('userData', JSON.stringify(user))
      .then(() => navigation.navigate("Main"))
    });
  }

  _handleGoogleSubmit = () => {
    this.setState({loading:true})
    const navigation = this.props.navigation;
    this.googleLogin()
      .then((user) => {
        AsyncStorage.setItem('userData', JSON.stringify(user))
        .then(() => navigation.navigate("Main"))
      });
  }

  _handleTwitterSubmit = () => {
    this.setState({loading:true})
    const navigation = this.props.navigation;
    // setStorage(true)
    this.twitterLogin()
    // .then((user) => {
    //   AsyncStorage.setItem('userData', JSON.stringify(user))
    //   .then(() => navigation.navigate("Main"))
    // });
  }

  showLoader = (ref) => {
    if(ref){
      ref.show();
    }
    // setTimeout(() => {
    //     ref.hide();
    // }, 30000);
  };


  showToast(message) {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        // calls on toast\`s appear animation start
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      }
    });
  }




  render() {
    return <View style={{ flex: 1 }}>
      {this.state.loading ?
        <Loader
          ref={(ref) => this.showLoader(ref)}
        />
        : null}

      <View style={styles.topView}>
        <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>Sign In</Text>
      </View>
      <View style={{ backgroundColor: '#4A087D', height: '100%', flex: 1 }}>
        <View style={{ backgroundColor: '#FFF', borderTopRightRadius: 35, height: '100%', alignItems: 'center', }}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <View style={{ marginTop: 80, marginBottom: 20 }}>
                {/* input */}
                <TextInput style={styles.input} keyboardType='email-address' placeholder='Email' value={this.state.email} onChangeText={(email) => this.setState({ email })} />
                <TextInput secureTextEntry={true} style={styles.input} placeholder='Password' value={this.state.password} onChangeText={(password) => this.setState({ password })} />
                <TouchableOpacity style={{ alignSelf: 'flex-end' }}><Text style={{ color: 'red' }}>Forgot code?</Text></TouchableOpacity>
                <TouchableOpacity onPress={this.login.bind(this)} style={styles.button} ><Text style={styles.buttonText}>Sign In</Text></TouchableOpacity>


                {/* line */}
                <View style={{ flexWrap: 'wrap', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                  <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.4, width: '20%', alignSelf: 'flex-start', display: 'flex', margin: 20 }} />
                  <Text style={{ flexDirection: 'column', textAlignVertical: 'center' }}>or connect with</Text>
                  <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.4, width: '20%', alignSelf: 'flex-end', display: 'flex', margin: 20, }} />
                </View>

                {/* social login */}
                <View style={{ flexWrap: 'wrap', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30 }}>
                  <TouchableOpacity onPress={this._handleFacebookSubmit.bind(this)}>
                    <View style={{ width: 40, height: 40 }}>
                      <Image source={facebookImg}></Image>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._handleGoogleSubmit.bind(this)}>
                    <View style={{ width: 40, height: 40 }}>
                      <Image source={googleImg}></Image>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._handleTwitterSubmit.bind(this)}>
                    <View style={{ width: 40, height: 40 }}>
                      <Image source={twitterImg}></Image>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* signup page */}
                <View style={{ flexWrap: 'wrap', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                  <Text style={{ flexDirection: 'column', textAlignVertical: 'center' }}>Don't have an account?</Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')} style={{ display: 'flex' }}><Text style={{ color: 'red' }}>Sign up</Text></TouchableOpacity>
                </View>


              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </View>;
  }
}

const styles = {
  topView: {
    height: 200,
    backgroundColor: '#4A087D',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 35,
  },
  button: {
    backgroundColor: '#4A087D',
    borderRadius: 35,
    // width: '100%',
    height: 57,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  buttonText: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 21,
    color: '#FFF'
  },
  input: {
    width: 300,
    margin: 30,
    borderBottomColor: '#000000',
    borderBottomWidth: 0.4,
  }
}


