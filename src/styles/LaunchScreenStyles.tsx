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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 40,
    marginTop: 50,
    width: '100%',
  },
  logo: {
    color: '#f0f351',
    fontSize: 48,
    fontFamily: 'OpenSans-Bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
  },
  mainMessage: {
    color: '#f0f351',
    fontSize: 43,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    marginHorizontal: 20,
  
    marginTop: 50,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: 40,
    alignItems: 'center',
    marginTop: 50,
  },
  buttonWrapper: {
    width: '100%',
   
    marginTop: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
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
    backgroundColor: 'transparent',
    borderRadius: 15,
    padding: 10,
    marginTop: 5,
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