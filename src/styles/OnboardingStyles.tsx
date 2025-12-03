import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  progressBarContainer: {
    width: '90%',
    height: hp(9),
    borderRadius: 30,
    backgroundColor: '#D0E8F0',
    marginTop: hp(70),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
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
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#000000',
    lineHeight: rf(40),
  },
  inputContainer: {
    marginBottom: hp(24),
  },
  inputField: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    borderWidth: rs(1.5),
    borderColor: '#4A90E2',
    paddingHorizontal: wp(16),
    fontSize: rf(16),
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#000000',
  },
  buttonContainer: {
    marginTop: hp(24),
    marginBottom: hp(32),
    width: '100%',
  },
  continueButton: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#B8D4E3',
    borderRadius: rs(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#4A90E2',
  },
  continueButtonDisabled: {
    backgroundColor: '#B8D4E3',
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: rf(18),
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#4A90E2',
  },
  continueButtonTextActive: {
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
});

export default styles;

