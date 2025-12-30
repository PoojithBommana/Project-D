import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Path, Rect } from 'react-native-svg';

// Custom hexagonal icon for People tab (active state) - solid black hexagon with white lines
const HexagonalIcon = ({ size = 24 }) => (
  <View style={[styles.hexagonContainer, { width: size, height: size }]}>
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Hexagon shape */}
      <Path
        d="M12 2 L20 6 L20 18 L12 22 L4 18 L4 6 Z"
        fill="#000000"
        stroke="#000000"
        strokeWidth="0.5"
      />
      {/* Two horizontal white lines */}
      <Rect x="7" y="10" width="10" height="1.5" fill="#FFFFFF" rx="0.75" />
      <Rect x="7" y="13.5" width="10" height="1.5" fill="#FFFFFF" rx="0.75" />
    </Svg>
  </View>
);

const CustomBottomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name === 'Likes'
            ? 'Liked You'
            : route.name === 'Chat'
            ? 'Chats'
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Icon mapping
        let iconComponent = null;
        const iconSize = 24;
        const iconColor = '#000000';

        if (route.name === 'Profile') {
          iconComponent = (
            <View style={styles.iconWrapper}>
              <Icon name="person-outline" size={iconSize} color={iconColor} />
              {/* Red notification dot */}
              <View style={styles.notificationDot} />
            </View>
          );
        } else if (route.name === 'Discover') {
          iconComponent = (
            <View style={styles.iconWrapper}>
              <Icon name="compass-outline" size={iconSize} color={iconColor} />
              {/* Red notification dot */}
              <View style={styles.notificationDot} />
            </View>
          );
        } else if (route.name === 'People') {
          if (isFocused) {
            iconComponent = <HexagonalIcon size={iconSize} />;
          } else {
            iconComponent = (
              <Icon name="people-outline" size={iconSize} color={iconColor} />
            );
          }
        } else if (route.name === 'Likes') {
          iconComponent = (
            <Icon name="heart-outline" size={iconSize} color={iconColor} />
          );
        } else if (route.name === 'Chat') {
          iconComponent = (
            <Icon name="chatbubble-outline" size={iconSize} color={iconColor} />
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {iconComponent}
            <Text style={styles.tabLabel}>{typeof label === 'string' ? label : route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: Platform.OS === 'ios' ? 8 : 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    height: Platform.OS === 'ios' ? 88 : 70,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 10,
    color: '#999999',
    marginTop: 4,
    fontWeight: '500',
  },
  hexagonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomBottomTabBar;
