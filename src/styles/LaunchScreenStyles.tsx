import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(156, 39, 176, 0.75)', // Lighter semi-transparent purple overlay
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 48,
    fontFamily: 'OpenSans-ExtraBold',
    marginBottom: 10,
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  bottomContainer: {
    marginTop: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
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