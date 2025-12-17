import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  progressBarContainer: {
    width: '90%',
    height: hp(9),
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    marginTop: hp(70),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FDFF8E',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(40),
    justifyContent: 'flex-start',
  },
  headingContainer: {
    marginBottom: hp(32),
  },
  heading: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    lineHeight: rf(31),
  },
  inputContainer: {
    marginBottom: hp(24),
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  inputField: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    borderWidth: 2,
    borderColor: '#FEFFAF',
    paddingHorizontal: wp(16),
    paddingRight: wp(50),
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  checkmarkContainer: {
    position: 'absolute',
    right: wp(16),
    top: '50%',
    transform: [{ translateY: -rf(12) }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    width: rf(24),
    height: rf(24),
  },
  errorText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#FF0000',
    marginTop: hp(8),
    marginLeft: wp(4),
  },
  buttonContainer: {
    marginTop: hp(24),
    marginBottom: hp(32),
    width: '100%',
  },
  continueButton: {
    width: '100%',
    height: hp(50),
    fontWeight: 'bold',
    backgroundColor: '#FDFF8E',
    borderRadius: rs(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: 'black',
  },
});

export default styles;

