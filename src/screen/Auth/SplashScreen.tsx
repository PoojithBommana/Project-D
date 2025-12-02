import React from 'react';
import LottieView from 'lottie-react-native';
import SplashScreenController from '../../controllers/SplashScreenController';
import { View } from 'react-native';

export default function SplashScreen() {
  SplashScreenController();
  
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
