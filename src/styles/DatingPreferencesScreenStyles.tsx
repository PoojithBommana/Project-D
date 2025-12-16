import { StyleSheet, Dimensions } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

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
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(40),
    paddingBottom: hp(100),
  },
  headerContainer: {
    marginBottom: hp(32),
    marginTop: hp(20),
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(12),
  },
  heartIcon: {
    marginRight: wp(8),
  },
  heading: {
    fontSize: rf(24),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    lineHeight: rf(32),
  },
  subheading: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(20),
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(40),
    gap: wp(12),
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: rs(12),
    paddingVertical: hp(20),
    paddingHorizontal: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: rs(2),
    borderColor: 'transparent',
  },
  genderButtonSelected: {
    backgroundColor: '#FDFF8D',
    borderColor: '#FDFF8D',
  },
  genderIcon: {
    width: wp(40),
    height: wp(40),
    marginBottom: hp(8),
  },
  nonBinaryIconContainer: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(8),
  },
  genderButtonText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#666666',
    textAlign: 'center',
  },
  genderButtonTextSelected: {
    color: '#000000',
  },
  ageRangeSection: {
    marginBottom: hp(24),
  },
  ageRangeTitle: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(12),
  },
  ageRangeText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#4A90E2',
    marginBottom: hp(24),
  },
  pickerWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    marginBottom: hp(32),
    position: 'relative',
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: '#F5F5F5',
    borderRadius: rs(8),
    zIndex: 0,
  },
  pickerContainer: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  pickerColumn: {
    height: '100%',
    position: 'relative',
    marginHorizontal: wp(8),
    alignItems: 'center',
    minWidth: wp(60),
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemSelected: {
    // Background is handled by selectionIndicator
  },
  pickerItemText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruRegular',
    color: '#999999',
    textAlign: 'center',
  },
  pickerItemTextSelected: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'center',
  },
  pickerSeparator: {
    fontSize: rf(18),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginHorizontal: wp(8),
  },
  pickerOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 0,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
    pointerEvents: 'none',
  },
  pickerOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 0,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
    pointerEvents: 'none',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(24),
    paddingTop: hp(12),
    paddingBottom: hp(32),
    backgroundColor: '#FFFCF1',
  },
  continueButton: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#E0E0E0',
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
    backgroundColor: '#FDFF8D',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(24),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(20),
    paddingHorizontal: wp(32),
    paddingVertical: hp(32),
    width: '100%',
    maxWidth: wp(320),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  modalIconContainer: {
    marginBottom: hp(20),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: hp(12),
    lineHeight: rf(30),
  },
  modalGenderText: {
    color: '#4A90E2',
  },
  modalSubtext: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: rf(20),
    marginBottom: hp(32),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: wp(12),
  },
  modalButton: {
    flex: 1,
    height: hp(48),
    borderRadius: rs(12),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonNo: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  modalButtonYes: {
    borderColor: '#FDFF8D',
    backgroundColor: '#FDFF8D',
  },
  modalButtonText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#666666',
  },
  modalButtonTextYes: {
    color: '#000000',
  },
});

export default styles;

