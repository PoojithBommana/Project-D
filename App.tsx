import { View } from 'react-native'
import React, { Component } from 'react'
import LaunchScreen from './src/screen/LaunchScreen'

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <LaunchScreen />
      </View>
    )
  }
}