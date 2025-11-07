import { Text, View, TouchableOpacity, SafeAreaView, ImageBackground, Animated } from 'react-native';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import styles from '../styles/LaunchScreenStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

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
      <ImageBackground 
        source={require('../assets/heart-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <StatusBar translucent backgroundColor="rgba(156, 39, 176, 0.75)" barStyle="light-content" />
        
        <View style={styles.contentContainer}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>DilMil</Text>
            <Text style={styles.tagline}>Where Indian hearts meet</Text>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.signInButton}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>

            <Animated.View style={{ opacity: buttonOpacity }}>
              <TouchableOpacity 
                style={styles.otherMethodsButton} 
                onPress={this.toggleDropdown}
                disabled={this.state.dropdownVisible}
              >
                <Text style={styles.otherMethodsText}>Continue with other methods</Text>
              </TouchableOpacity>
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
              <TouchableOpacity style={styles.socialButton}>
                <Icon name="google" size={20} color="#DB4437" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Icon name="facebook" size={20} color="#4267B2" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </TouchableOpacity>
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
      </ImageBackground>
    );
  }
}