import React, { useEffect } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { splashScreenController } from '../../controllers/SplashScreenController';

// Define navigation param list for MainNavigation
type MainNavigationParamList = {
  SplashScreen: undefined;
  AuthNavigation: undefined;
  Home: undefined;
};

interface SplashScreenProps {
  navigation: NativeStackNavigationProp<MainNavigationParamList, 'SplashScreen'>;
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    // Start the 3-second timer and check authentication
    const initializeApp = async () => {
      try {
        // Wait 3 seconds and check authentication
        const result = await splashScreenController.waitAndCheckAuth();

        // Navigate based on authentication status
        if (result.shouldNavigateToHome) {
          // User is authenticated, navigate to Home
          console.log('✅ User authenticated, navigating to Home');
          navigation.replace('Home');
        } else if (result.shouldNavigateToLogin) {
          // User is not authenticated, navigate to Login
          console.log('❌ User not authenticated, navigating to Login');
          navigation.replace('AuthNavigation');
        }
      } catch (error) {
        console.error('Error during splash screen initialization:', error);
        // On error, navigate to login screen
        navigation.replace('AuthNavigation');
      }
    };

    initializeApp();
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <LottieView
        source={require('../../assets/lottileJson/DillMill.json')}
        autoPlay
        loop
        style={{ flex: 1 }}
      />
    </View>
  );
}
