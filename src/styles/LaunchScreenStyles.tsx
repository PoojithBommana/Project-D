import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logo: {
    color: '#f0f351',
    fontSize: 48,
    fontFamily: 'OpenSans-Bold',
    letterSpacing: 2,
  },
  tagline: {
    color: '#f8f99a', // Lighter shade of the logo color (#f0f351)
    fontSize: 32,
    fontFamily: 'OpenSans-SemiBoldItalic',
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  bottomContainer: {
    marginTop: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 16,
    width: '100%',
    marginBottom: 15,
  },
  signInText: {
    color: '#9C27B0',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
  otherMethodsButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 16,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  otherMethodsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
  },
  termsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  termsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  dropdownContainer: {
    marginBottom: 15,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#9C27B0',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
    marginLeft: 12,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});

export default styles;