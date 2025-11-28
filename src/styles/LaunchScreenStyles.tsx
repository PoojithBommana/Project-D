import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/Responsive';

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
    paddingHorizontal: wp(20),
  },
  topSection: {
    alignItems: 'center',
    paddingTop: hp(40),
    marginTop: hp(50),
    width: '100%',
  },
  logo: {
    color: '#f0f351',
    fontSize: rf(48),
    fontFamily: 'OpenSans-Bold',
    letterSpacing: rs(2),
    textAlign: 'center',
    marginBottom: rs(8),
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: rf(18),
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
  },
  mainMessage: {
    color: '#f0f351',
    fontSize: rf(43),
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    marginHorizontal: wp(20),
    marginTop: hp(50),
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: hp(40),
    alignItems: 'center',
    marginTop: hp(50),
  },
  buttonWrapper: {
    width: '100%',
    marginTop: hp(30),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  signInButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(30),
    paddingVertical: hp(16),
    width: '100%',
    marginBottom: hp(15),
  },
  signInText: {
    color: '#9C27B0',
    fontSize: rf(16),
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
  otherMethodsButton: {
    backgroundColor: 'transparent',
    borderRadius: rs(30),
    paddingVertical: hp(16),
    width: '100%',
    borderWidth: rs(2),
    borderColor: '#FFFFFF',
  },
  otherMethodsText: {
    color: '#FFFFFF',
    fontSize: rf(16),
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
  },
  termsContainer: {
    marginTop: hp(20),
    alignItems: 'center',
  },
  termsText: {
    color: '#FFFFFF',
    fontSize: rf(12),
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    opacity: 0.8,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  dropdownContainer: {
    marginBottom: hp(15),
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: rs(15),
    padding: wp(10),
    marginTop: hp(5),
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: rs(25),
    paddingVertical: hp(14),
    paddingHorizontal: wp(20),
    marginVertical: hp(5),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#9C27B0',
    fontSize: rf(16),
    fontFamily: 'OpenSans-SemiBold',
    textAlign: 'center',
    marginLeft: wp(12),
  },
  socialIcon: {
    width: rs(20),
    height: rs(20),
    marginRight: wp(8),
  },
});

export default styles;