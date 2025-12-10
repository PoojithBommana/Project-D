import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    height: hp(60),
  },
  backButton: {
    padding: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: wp(20),
    paddingTop: hp(40),
  },
  title: {
    fontSize: rf(24),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(11),
  },
  description: {
    fontSize: rf(15),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(24),
    marginBottom: hp(40),
  },
  phoneInputContainer: {
    marginTop: hp(20),
  },
  inputFieldContainer: {
    marginBottom: hp(20),
  },
  inputLabel: {
    fontSize: rf(14),
    fontFamily: 'GTMaruMedium',
    color: '#000000',
    marginBottom: hp(8),
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: rs(12),
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    backgroundColor: '#FFFFFF',
  },
  countryAbbreviation: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginRight: wp(12),
  },
  countryCodeDisplay: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    marginRight: wp(8),
  },
  dropdownIcon: {
    marginLeft: 'auto',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: rs(12),
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: rf(12),
    fontFamily: 'GTMaruRegular',
    color: '#FF0000',
    marginTop: hp(8),
  },
  bottomContainer: {
    paddingHorizontal: wp(20),
    paddingBottom: hp(30),
  },
  continueButton: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FDFF8D',
    borderRadius: rs(19),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(16),
  },
  continueButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  privacyText: {
    fontSize: rf(12),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: rf(18),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: rs(20),
    borderTopRightRadius: rs(20),
    maxHeight: hp(600),
    paddingBottom: hp(30),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: hp(20),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: rf(20),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  modalCloseButton: {
    padding: wp(8),
  },
  countryCodeList: {
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
  },
  countryCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  countryCodeText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruMedium',
    color: '#000000',
    width: wp(80),
  },
  countryName: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    flex: 1,
  },
});

export default styles;

