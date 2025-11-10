import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator , Image, ImageSourcePropType} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outlined' | 'social' | 'borderless';
  disabled?: boolean;
  loading?: boolean;
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  customStyle?: ViewStyle;
  textStyle?: TextStyle;
  imageUrl?: ImageSourcePropType;
  iconStyle?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  iconName,
  iconColor,
  iconSize = 20,
  customStyle,
  textStyle,
  iconStyle,
  imageUrl,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: variant === 'social' ? 25 : 30,
      paddingVertical: variant === 'social' ? 14 : 16,
      paddingHorizontal: variant === 'social' ? 20 : 0,
      width: variant === 'social' ? '100%' : '100%',
      flexDirection: variant === 'social' ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled || loading ? 0.6 : 1,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#f8f99a', // Tagline color
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#FFFFFF',
        };
      case 'borderless':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'social':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          marginVertical: 5,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: variant === 'primary' ? 'OpenSans-Bold' : 'OpenSans-SemiBold',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: '#000000', // Dark text for readability on light yellow background
        };
      case 'outlined':
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
      case 'borderless':
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
      case 'social':
        return {
          ...baseStyle,
          color: '#FFFFFF',
          marginLeft: (iconName || imageUrl) ? 12 : 0,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), customStyle]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#000000' : variant === 'social' ? '#9C27B0' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {imageUrl && (
            <Image source={imageUrl} style={styles.icon} />
          )}
          {iconName && !imageUrl && (
            <Icon
              name={iconName}
              size={iconSize}
              color={iconColor || '#FFFFFF'}
              style={[styles.icon, iconStyle]}
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});

export default CustomButton;

