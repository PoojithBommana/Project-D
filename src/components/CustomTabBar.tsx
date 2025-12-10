import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const tabBarContent = (
    <View style={styles.tabBarContainer}>
      {/* Glass background layer */}
      <View style={styles.glassBackground} />
      
      {/* Tab buttons */}
      <View style={styles.tabButtonsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
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
          const iconMap: { [key: string]: string } = {
            People: 'account-group',
            Likes: 'heart',
            AI: 'hanger',
            Chat: 'message-text',
            Profile: 'account-circle',
          };

          const iconName = iconMap[route.name] || 'circle';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.6}
            >
              <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                <Icon
                  name={iconName}
                  size={26}
                  color={isFocused ? '#000000' : 'rgba(102, 102, 102, 0.8)'}
                  style={styles.icon}
                />
              </View>
              {typeof label === 'string' && (
                <View style={styles.labelContainer}>
                  <Text style={[styles.labelText, isFocused && styles.labelTextActive]}>
                    {label}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Top border with glass effect */}
      <View style={styles.topBorderGlass} />
    </View>
  );

  if (isLiquidGlassSupported) {
    return (
      <View style={styles.outerContainer}>
        <LiquidGlassView
          style={styles.liquidGlassContainer}
          effect="regular"
          tintColor="rgba(255, 255, 255, 0.35)"
          colorScheme="light"
          interactive={true}
        >
          {/* Multiple sheen overlays for enhanced glass effect */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.sheenOverlay}
          />
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.sheenOverlay2}
          />
          
          {/* Glass border */}
          <View style={styles.glassBorder} />
          
          {tabBarContent}
        </LiquidGlassView>
      </View>
    );
  }

  // Enhanced fallback for devices that don't support liquid glass
  return (
    <View style={styles.outerContainer}>
      <View style={[styles.liquidGlassContainer, styles.fallbackContainer]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.glassBorder} />
        {tabBarContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  liquidGlassContainer: {
    flex: 1,
    borderRadius: 0,
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  fallbackContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
  },
  tabBarContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sheenOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    zIndex: 1,
  },
  sheenOverlay2: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    zIndex: 2,
  },
  glassBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 3,
  },
  topBorderGlass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingVertical: 8,
    zIndex: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 50,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    textAlign: 'center',
  },
  labelContainer: {
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 10,
    fontFamily: 'GTMaruMedium',
    color: 'rgba(102, 102, 102, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 2,
  },
  labelTextActive: {
    color: '#000000',
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 2,
  },
});

export default CustomTabBar;
