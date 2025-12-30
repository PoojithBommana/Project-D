import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import AIScreen from './AIScreen';
import ClosetScreen from './ClosetScreen';
import StudioScreen from './StudioScreen';
import CameraScreen from './CameraScreen';

export interface CollectionItem {
  id: string;
  name: string;
  image: string;
}

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  items: CollectionItem[];
}

export type WardrobeStackParamList = {
  Dashboard: undefined;
  Closet: { newItemImage?: string; newItemName?: string; categoryData?: CategoryData } | undefined;
  Studio: undefined;
  Camera: undefined;
};

const Stack = createNativeStackNavigator<WardrobeStackParamList>();

/**
 * WardrobeFeature
 * 
 * This is the entry point for the Wardrobe module.
 * Import and use this component in your main App's navigation structure.
 * 
 * Example usage in main app:
 * <Drawer.Screen name="Wardrobe" component={WardrobeFeature} />
 */
const WardrobeFeature = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: true,
        headerTintColor: '#000000',
        headerTitleStyle: { fontFamily: 'GTMaruBold', fontWeight: 'bold' },
        headerStyle: { backgroundColor: '#FFFCF1' }
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={AIScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="Closet" component={ClosetScreen} />
      <Stack.Screen name="Studio" component={StudioScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default WardrobeFeature;