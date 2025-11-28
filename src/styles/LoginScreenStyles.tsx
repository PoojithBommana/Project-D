import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/Responsive';

/**
 * LoginScreen Styles
 * 
 * Organized styling for the Phone Number Login screen.
 * Uses the same theme as AccountNotFoundScreen (white background, clean design).
 */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    paddingTop: hp(10),
    height: hp(60),
  },
  backButton: {
    padding: rs(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(20),
    paddingTop: hp(40),
  },
  title: {
    fontSize: rf(24),
    fontFamily: 'OpenSans-Bold',
    color: '#000000',
    marginBottom: hp(11),
  },
  description: {
    fontSize: rf(15),
    fontFamily: 'OpenSans-Regular',
    color: '#000000',
    lineHeight: rf(24),
    marginBottom: hp(40),
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp(20),
    gap: wp(10),
    marginLeft: wp(6),
  },
  inputFieldContainer: {
    alignItems: 'flex-start',
  },
  inputLabel: {
    fontSize: rf(13),
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',
    marginBottom: hp(8),
    marginLeft: wp(5),
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: rs(12),
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    borderWidth: rs(1),
    borderColor: 'black',
    minWidth: wp(100),
  },
  countryAbbreviation: {
    fontSize: rf(16),
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',
    marginRight: wp(6),
  },
  countryCodeDisplay: {
    fontSize: rf(16),
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',
    marginRight: wp(8),
  },
  dropdownIcon: {
    marginLeft: wp(4),
  },
  phoneInputWrapper: {
    width: wp(220),
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    borderWidth: rs(1),
    borderBottomWidth: rs(3),
    borderColor: '#000000',
  },
  phoneInput: {
    fontSize: rf(15),
    fontFamily: 'OpenSans-Regular',
    color: '#000000',
    paddingHorizontal: wp(16),
    paddingVertical: hp(16),
    height: hp(52),
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    paddingHorizontal: wp(20),
    paddingBottom: hp(40),
    alignItems: 'center',
    width: '100%',
  },
  continueButton: {
    width: '100%',
    backgroundColor: 'black',
    borderRadius: rs(30),
    paddingVertical: hp(15),
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: rf(18),
    fontFamily: 'OpenSans-Bold',
  },
  privacyText: {
    fontSize: rf(12),
    fontFamily: 'OpenSans-Regular',
    color: '#000000',
    marginTop: hp(20),
    paddingHorizontal: wp(20),
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: rs(20),
    borderTopRightRadius: rs(20),
    maxHeight: hp(596), // 70% of typical screen height
    paddingBottom: hp(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: hp(16),
    borderBottomWidth: rs(1),
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: rf(20),
    fontFamily: 'OpenSans-Bold',
    color: '#000000',
  },
  modalCloseButton: {
    padding: rs(4),
  },
  countryCodeList: {
    paddingHorizontal: wp(20),
  },
  countryCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(16),
    borderBottomWidth: rs(1),
    borderBottomColor: '#F0F0F0',
  },
  countryCodeText: {
    fontSize: rf(16),
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',
    marginLeft: wp(12),
    width: wp(60),
  },
  countryName: {
    fontSize: rf(16),
    fontFamily: 'OpenSans-Regular',
    color: '#666666',
    marginLeft: wp(12),
    flex: 1,
  },
  errorText: {
    fontSize: rf(12),
    fontFamily: 'OpenSans-Regular',
    color: '#FF0000',
    marginTop: hp(4),
    marginLeft: wp(5),
  },
});

export default styles;

