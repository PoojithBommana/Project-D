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
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(40),
    justifyContent: 'flex-start',
  },
  headerContainer: {
    marginBottom: hp(32),
  },
  headerIconContainer: {
    marginBottom: hp(12),
  },
  heading: {
    fontSize: rf(24),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    lineHeight: rf(32),
    marginBottom: hp(8),
  },
  subheading: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(20),
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(40),
    gap: wp(12),
  },
  cardWrapper: {
    flex: 1,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(16),
    padding: wp(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: rs(2),
    borderColor: 'transparent',
  },
  activityCardSelected: {
    borderColor: '#FDFF8D',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardImageContainer: {
    width: '100%',
    height: hp(150),
    marginBottom: hp(12),
    borderRadius: rs(12),
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: hp(24),
    marginBottom: hp(32),
    width: '100%',
  },
  continueButton: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#E0E0E0',
    borderRadius: rs(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#FDFF8D',
  },
  continueButtonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#999999',
  },
  continueButtonTextActive: {
    color: '#000000',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
});

export default styles;

