import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LiquidButton = ({ title = "Button" }) => {
  return (
    <TouchableOpacity  activeOpacity={0.8} style={styles.container}>
      {/* 1. The Outer Metallic Ring (Border) */}
      <View style={styles.borderWrapper}>
        
        {/* 2. The Main Dark Body Gradient */}
        <LinearGradient
          colors={['#5e5e5e', '#2a2a2a', '#1a1a1a']} 
          locations={[0, 0.45, 1]}
          style={styles.innerButton}
        >
          
          {/* 3. The "Liquid Glass" Gloss Effect (Top Half Only) */}
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.02)']}
            style={styles.glossOverlay}
          />
          
          {/* 4. Top Edge Specular Highlight (The distinct white rim inside) */}
          <View style={styles.topInnerHighlight} />

          {/* 5. Text with Drop Shadow */}
          <Text style={styles.text}>{title}</Text>
          
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    margin: 20,
  },
  borderWrapper: {
    padding: 2, // Acts as the border thickness
    borderRadius: 50,
    backgroundColor: '#b0b0b0', // Silver/Metallic border color
    
    // Outer Shadow for 3D "pop"
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8, // Android shadow
  },
  innerButton: {
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 48, 
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Clips the glass overlay inside the border
    borderWidth: 1.5,
    borderColor: '#000', // The dark stroke between the silver rim and the button body
  },
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '52%', // slightly more than half to match the "bulge" look
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    borderBottomLeftRadius: 10, // Slight curve at the bottom of the gloss
    borderBottomRightRadius: 10,
  },
  topInnerHighlight: {
    position: 'absolute',
    top: 2,
    left: 15,
    right: 15,
    height: 1, 
    backgroundColor: 'rgba(255,255,255,0.5)', // Strong specular highlight
    borderRadius: 2,
  },
  text: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    // System font usually works best for the "Button" look, 
    // but on iOS specific fonts like Helvetica Neue Bold fit the era perfectly.
    fontFamily: 'sans-serif', // Using a cross-platform default font-family to avoid Platform reference error
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: -1 }, // Negative Y pushes shadow up (embossed)
    textShadowRadius: 1,
    zIndex: 10,
  },
});

export default LiquidButton;