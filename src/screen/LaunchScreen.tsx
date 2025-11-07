import { Text, View, SafeAreaView, Animated } from 'react-native';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import Video from 'react-native-video';
import styles from '../styles/LaunchScreenStyles';
import CustomButton from '../components/CustomButton';

interface State {
  dropdownVisible: boolean;
  dropdownAnimation: Animated.Value;
  buttonAnimation: Animated.Value;
}

export default class LaunchScreen extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      dropdownVisible: false,
      dropdownAnimation: new Animated.Value(0),
      buttonAnimation: new Animated.Value(1)
    };
  }

  toggleDropdown = () => {
    const { dropdownAnimation, buttonAnimation } = this.state;

    Animated.parallel([
      // Fade out the "Continue with other methods" button
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Slide down and fade in the dropdown
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();

    this.setState({ dropdownVisible: true });
  };

  render() {
    const dropdownTranslateY = this.state.dropdownAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 0],
    });

    const dropdownOpacity = this.state.dropdownAnimation;
    const buttonOpacity = this.state.buttonAnimation;

    return (
      <View style={styles.container}>
        <Video
          source={require('../assets/backgroundvideo.mp4')}
          style={styles.backgroundVideo}
          resizeMode="cover"
          repeat={true}
          muted={true}
          paused={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
        />
        <SafeAreaView style={styles.overlayContainer}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        
        {/* Logo Section - Top */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>DilMil</Text>
        </View>

        <View style={styles.contentContainer}>
          {/* Bottom Section */}
          <View style={styles.bottomContainer}>
            <Text style={styles.tagline}>Where Indian hearts meet</Text>
            <View style={styles.buttonWrapper}>
              <CustomButton
                title="Quick Sign In"
                variant="primary"
                onPress={() => {
                  // Handle sign in
                }}
              />
            </View>

            <Animated.View style={[styles.buttonWrapper, { opacity: buttonOpacity }]}>
              <CustomButton
                title="Continue with other methods"
                variant="outlined"
                onPress={this.toggleDropdown}
                disabled={this.state.dropdownVisible}
              />
            </Animated.View>

            <Animated.View 
              style={[
                styles.dropdownContainer,
                {
                  opacity: dropdownOpacity,
                  transform: [{ translateY: dropdownTranslateY }],
                  display: this.state.dropdownVisible ? 'flex' : 'none'
                }
              ]}
            >
              <CustomButton
                title="Continue with Google"
                variant="social"
                iconName="google"
                iconColor="#DB4437"
                onPress={() => {
                  // Handle Google sign in
                }}
              />
              <CustomButton
                title="Continue with Facebook"
                variant="social"
                iconName="facebook"
                iconColor="#4267B2"
                onPress={() => {
                  // Handle Facebook sign in
                }}
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