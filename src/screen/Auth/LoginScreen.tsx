import { Text, View, SafeAreaView, Animated, Alert } from 'react-native';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import Video from 'react-native-video';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigation';
// Facebook login is now handled by AuthService
import styles from '../../styles/LaunchScreenStyles';
import CustomButton from '../../components/CustomButton';
import { Facebookicon , Googleicon } from '../../assets/index';
import { t } from '../../config/i18n';
import { authService } from '../../services/AuthService';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation?: NativeStackNavigationProp<AuthStackParamList, 'LoginScreen'>;
}

interface State {
  dropdownVisible: boolean;
  dropdownAnimation: Animated.Value;
}

export default class LoginScreen extends Component<Props, State> {
  private videoRef: any = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      dropdownVisible: false,
      dropdownAnimation: new Animated.Value(0),
    };
    this.videoRef = React.createRef()
  }

  componentDidMount(): void {
    GoogleSignin.configure({
      webClientId: '168980396946-p9ad718oc5bjl5ino2u07b2bh4spgfb1.apps.googleusercontent.com',
      scopes:[
        'https://www.googleapis.com/auth/calendar'
      ]
    });
  }

  toggleDropdown = () => {
    const { dropdownVisible, dropdownAnimation } = this.state;

    if (!dropdownVisible) {
      // Open dropdown with smooth animation
      Animated.spring(dropdownAnimation, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
      this.setState({ dropdownVisible: true });
    } else {
      // Close dropdown
      Animated.spring(dropdownAnimation, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start(() => {
        this.setState({ dropdownVisible: false });
      });
    }
  };


  handleContinueWithMobile = () => {
    this.props.navigation?.navigate('RegisterScreen');
  };

  handleGoogleSignIn = async () => {
    try {
      const result:any = await authService.signInWithGoogle();
      
      if (result.success && result.user) {
        // if (result.backendResponse && 'token' in result.backendResponse && result.backendResponse.token) {
        //   await AsyncStorage.setItem("authToken", `${result.backendResponse.token}`);
        // }
        await AsyncStorage.setItem("authToken", `${result.backendResponse?.token}`);
        this.props.navigation?.navigate("TabNavigation");
        Alert.alert('Success', 'Signed in with Google successfully!');
      } else {
        // Only show error if it wasn't a cancellation
        if (result.error && result.error !== 'Sign in was cancelled') {
          Alert.alert('Error', result.error || 'Failed to sign in with Google');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to sign in with Google');
    }
  };

  handleFacebookSignIn = async () => {
    try {
      const result = await authService.signInWithFacebook();
      
      if (result.success && result.user) {
        await AsyncStorage.setItem("authToken", `Token`);
        this.props.navigation?.navigate("TabNavigation");
        Alert.alert('Success', 'Signed in with Facebook successfully!');
      } else {
        // Only show error if it wasn't a cancellation
        if (result.error && result.error !== 'Sign in was cancelled') {
          Alert.alert('Error', result.error || 'Failed to sign in with Facebook');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to sign in with Facebook');
    }
  };


  render() {
    
    const dropdownTranslateY = this.state.dropdownAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 0], 
    });

    const dropdownOpacity = this.state.dropdownAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const dropdownScale = this.state.dropdownAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.95, 1],
    });

    return (
      <View style={styles.container}>
        <Video
          ref={(ref) => {
            this.videoRef = ref;
          }}
          source={require('./../../assets/videos/backgroundvideo.mp4')}
          style={styles.backgroundVideo}
          resizeMode="cover"
          repeat={false}
          muted={true}
          paused={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          onEnd={() => {
           
            this.videoRef?.seek(0);
          }}
        />
        <SafeAreaView style={styles.overlayContainer}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        
          <View style={styles.contentContainer}>
            
            <View style={styles.topSection}>
              <Text style={styles.logo}>{t("DilMil")}</Text>
            </View>

          
            <View style={styles.bottomContainer}>
              <Text style={styles.mainMessage}>{t('IndianHeartsMeet')}</Text>
              
              <View style={styles.buttonWrapper}>
                <CustomButton
                  title={t("QuickSignIn")}
                  variant="primary"
                  onPress={() => {
                 
                  }}
                />
              </View>

              <View style={styles.buttonWrapper}>
                <CustomButton
                  title={t("ContinueWithOtherMethods")}
                  variant="borderless"
                  onPress={this.toggleDropdown}
                />
              </View>

              <Animated.View 
                style={[
                  styles.dropdownContainer,
                  {
                    opacity: dropdownOpacity,
                    transform: [
                      { translateY: dropdownTranslateY },
                      { scale: dropdownScale }
                    ],
                    pointerEvents: this.state.dropdownVisible ? 'auto' : 'none',
                  }
                ]}
              >
                <CustomButton
                  title={t("ContinueWithGoogle")}
                  variant="social"
                  imageUrl={Googleicon}
                  onPress={this.handleGoogleSignIn}
                  customStyle={{backgroundColor: 'white'}}
                  textStyle={{color: '#000000'}}
                />
                <CustomButton
                  title={t("ContinueWithFacebook")}
                  variant="social"
                  imageUrl={Facebookicon}
                  onPress={this.handleFacebookSignIn}
                  customStyle={{backgroundColor: 'white'}}
                  textStyle={{color: '#000000'}}
                />
                <CustomButton
                  title={t("ContinueWithMobileNumber")}
                  variant="social"
                  iconName="phone"
                  iconColor="#000000"
                  onPress={this.handleContinueWithMobile}
                  customStyle={{backgroundColor: 'white'}}
                  textStyle={{color: '#000000'}}
                />
              </Animated.View>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  {t("TermsAndPrivacy")}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}