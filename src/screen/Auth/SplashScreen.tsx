import React from 'react';
// import Video from 'react-native-video';
import SplashScreenController from '../../controllers/Auth/SplashScreenController';
import { View, StyleSheet, StatusBar, Image } from 'react-native';
import { Splashlogo } from '../../assets';
// import { hp, rf } from '../../utils/responsive';

export default function SplashScreen() {
  SplashScreenController();
  
  return (
    <View style={styles.container}>
      <StatusBar hidden animated />
      <Image source={Splashlogo}  style={styles.spashlogo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  spashlogo: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '90%',
  },
});
