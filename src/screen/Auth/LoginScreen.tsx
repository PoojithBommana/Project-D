import { Text, View, SafeAreaView, Animated } from 'react-native';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import Video from 'react-native-video';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import styles from '../../styles/LaunchScreenStyles';
import CustomButton from '../../components/CustomButton';
import { Facebookicon , Googleicon } from '../../assets/index';
import { t } from '../../config/i18n';

interface Props {
  navigation?: NativeStackNavigationProp<RootStackParamList, 'Launch'>;
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

  /**
   * Handles continue with mobile number action
   */
  handleContinueWithMobile = () => {
    this.props.navigation?.navigate('PhoneNumberLogin');
  };

  render() {
    // Dropdown appears below the "Continue with other methods" button
    const dropdownTranslateY = this.state.dropdownAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 0], // Starts slightly below, moves to position
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
          source={require('./../../assets/backgroundvideo.mp4')}
          style={styles.backgroundVideo}
          resizeMode="cover"
          repeat={false}
          muted={true}
          paused={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          onEnd={() => {
            // Ensure video restarts when it ends
            this.videoRef?.seek(0);
          }}
        />
        <SafeAreaView style={styles.overlayContainer}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        
          <View style={styles.contentContainer}>
            {/* Top Section: Logo and Tagline */}
            <View style={styles.topSection}>
              <Text style={styles.logo}>{t("DilMil")}</Text>
            </View>

            {/* Bottom Section: Main Message, Buttons and Legal Text */}
            <View style={styles.bottomContainer}>
              <Text style={styles.mainMessage}>{t('IndianHeartsMeet')}</Text>
              
              <View style={styles.buttonWrapper}>
                <CustomButton
                  title="Quick sign in"
                  variant="primary"
                  onPress={() => {
                    // Handle sign in
                  }}
                />
              </View>

              <View style={styles.buttonWrapper}>
                <CustomButton
                  title="Continue with other methods"
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
                  title="Continue with Google"
                  variant="social"
                  imageUrl={Googleicon}
                  onPress={() => {
                    // Handle Google sign in
                  }}
                  customStyle={{backgroundColor: 'white'}}
                  textStyle={{color: '#000000'}}
                />
                <CustomButton
                  title="Continue with Facebook"
                  variant="social"
                  imageUrl={Facebookicon}
                  onPress={() => {
                    // Handle Facebook sign in
                  }}
                  customStyle={{backgroundColor: 'white'}}
                  textStyle={{color: '#000000'}}
                />
                <CustomButton
                  title="Continue with mobile number"
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
                  By signing up, you agree to our{' '}
                  <Text style={styles.linkText}>Terms</Text>. See how we use{'\n'}
                  your data in our <Text style={styles.linkText}>Privacy Policy</Text>.
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}