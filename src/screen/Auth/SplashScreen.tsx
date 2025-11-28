import { View, Text } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

export default function SplashScreen() {
  return (
    <LottieView
      source={require('../../assets/lottileJson/DillMill.json')}
      autoPlay
      loop
      style={{ flex: 1, backgroundColor: '#000' }}
    />
  );
}
