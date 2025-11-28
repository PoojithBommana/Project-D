import React from 'react';
import LottieView from 'lottie-react-native';
import SplashScreenController from '../../controllers/SplashScreenController';

export default function SplashScreen() {
  const {} = SplashScreenController()
  return (
    <LottieView
      source={require('../../assets/lottileJson/DillMill.json')}
      autoPlay
      loop
      style={{ flex: 1, backgroundColor: '#000' }}
    />
  );
}
