import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

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
    height: hp(9),
    borderRadius: 30,
    backgroundColor: '#E8E8E8',
    marginTop: hp(70),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FDFF8D',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(20),
    justifyContent: 'flex-start',
  },
  headingContainer: {
    marginBottom: hp(25)
  },
  heading: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    lineHeight: rf(28),
    marginBottom: hp(12),
    textAlign: 'left',
  },
  subheading: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(20),
    textAlign: 'left',
  },
  iconContainer: {
    alignItems: 'center',
  },
  cakeIcon: {
    width: 200,
    height: hp(100),
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
  pickerColumnMonth: {
    minWidth: wp(100),
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
  pickerItemTextMonth: {
    textAlign: 'center',
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
  buttonContainer: {
    marginTop: hp(24),
    marginBottom: hp(32),
    width: '100%',
  },
  nextButton: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FDFF8D',
    borderRadius: rs(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  nextButtonTextDisabled: {
    color: '#999999',
  },
  smallText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
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
  modalIcon: {
    width: wp(100),
    height: hp(100),
  },
  modalTitle: {
    fontSize: rf(24),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: hp(16),
  },
  modalAgeText: {
    fontSize: rf(24),
    fontFamily: 'GTMaruBold',
    color: '#FDFF8D',
  },
  modalWarning: {
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
  modalButtonNo: {
    flex: 1,
    height: hp(48),
    borderRadius: rs(12),
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonNoText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#666666',
  },
  modalButtonYes: {
    flex: 1,
    height: hp(48),
    borderRadius: rs(12),
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonYesText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#666666',
  },
  modalButtonSelected: {
    backgroundColor: '#FDFF8D',
    borderColor: '#FDFF8D',
  },
  modalButtonSelectedText: {
    color: '#000000',
  },

});

export default styles;

