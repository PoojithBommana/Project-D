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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(40),
    paddingBottom: hp(120), // Extra padding for sticky button
  },
  headerContainer: {
    marginBottom: hp(24),
  },
  heading: {
    fontSize: rf(28),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(8),
    lineHeight: rf(36),
  },
  subheading: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(24),
  },
  selectedCountContainer: {
    marginBottom: hp(24),
    paddingVertical: hp(12),
    paddingHorizontal: wp(16),
    backgroundColor: '#FDFF8D',
    borderRadius: rs(12),
    alignSelf: 'flex-start',
  },
  selectedCountText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  categorySection: {
    marginBottom: hp(32),
  },
  categoryTitle: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(16),
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(12),
  },
  interestChip: {
    paddingVertical: hp(12),
    paddingHorizontal: wp(20),
    borderRadius: rs(20),
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(8),
  },
  interestChipSelected: {
    backgroundColor: '#FDFF8D',
    borderColor: '#FDFF8D',
  },
  interestText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
  },
  interestTextSelected: {
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(24),
    paddingTop: hp(16),
    paddingBottom: hp(32),
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  stickyButtonContainerFallback: {
    backgroundColor: '#FFFCF1',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  stickyButtonInner: {
    width: '100%',
  },
  continueButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: rs(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    height: hp(56),
    borderRadius: rs(28),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  continueButtonActive: {
    backgroundColor: '#FDFF8D',
    shadowColor: '#FDFF8D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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

