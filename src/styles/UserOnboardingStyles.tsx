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
    width: '15%',
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
  inputField: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    borderWidth: 2,
    borderColor: 'grey',
    paddingHorizontal: wp(16),
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  inputPlaceholder: {
    color: '#999999',
  },
  privacyContainer: {
    marginTop: hp(16),
    marginBottom: hp(32),
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: rs(20),
    height: rs(20),
    borderRadius: rs(4),
    borderWidth: rs(2),
    borderColor: 'black',
    marginRight: wp(12),
    marginTop: rs(2),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  checkboxChecked: {
    backgroundColor: '#FEFFAF',
  },
  checkboxUnchecked: {
    backgroundColor: 'transparent',
  },
  checkboxIcon: {
    width: rf(37),
    height: rf(30),
    marginLeft: wp(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  privacyTextContainer: {
    flex: 1,
    paddingRight: wp(8),
  },
  privacyText: {
    fontSize: rf(15),
    fontFamily: 'GTMaruBold',
    color: '#999999',
    lineHeight: rf(22),
  },
  privacyExample: {
    fontSize: rf(15),
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#666666',
    marginTop: hp(4),
    lineHeight: rf(22),
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
  continueButtonActive: {
    backgroundColor: '#FDFF8E',
  },

  continueButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: 'black',
  },
  continueButtonTextActive: {
    color: 'black',
  },

  errorText: {
    marginTop: hp(6),
    fontSize: rf(12),
    fontFamily: 'GTMaruBold',
    color: '#FF3B30',
  },

});

export default styles;
