import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  progressBarContainer: {
    width: '90%',
    height: hp(8),
    borderRadius: rs(30),
    backgroundColor: '#E8E8E8',
    marginTop: hp(60),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FDFF8D',
    borderTopLeftRadius: rs(30),
    borderBottomLeftRadius: rs(30),
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(20),
    paddingBottom: hp(20),
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginBottom: hp(24),
  },
  heading: {
    fontSize: rf(24),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(8),
    lineHeight: rf(32),
  },
  subheading: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(20),
  },
  goalsContainer: {
    flex: 1,
    gap: hp(12),
    justifyContent: 'center',
    marginBottom: hp(20),
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    padding: wp(16),
    borderWidth: 2,
    borderColor: '#FDFF8D',
   
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalCardSelected: {
    borderColor: '#FDFF8D',
    backgroundColor: '#FDFF8D',
  },
  goalEmoji: {
    fontSize: rf(28),
    marginRight: wp(16),
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(4),
  },
  goalDescription: {
    fontSize: rf(12),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(16),
  },
  buttonContainer: {
    marginTop: hp(20),
  },
  continueButton: {
    width: '100%',
    height: hp(56),
    borderRadius: rs(28),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#FDFF8D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonActive: {
    backgroundColor: '#FDFF8D',
  },
  continueButtonDisabled: {
    backgroundColor: '#E8E8E8',
  },
  continueButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    letterSpacing: rs(0.5),
  },
  continueButtonTextActive: {
    color: '#000000',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
});

export default styles;
