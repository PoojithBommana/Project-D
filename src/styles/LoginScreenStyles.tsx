import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
    paddingHorizontal: 16,
    paddingTop: 10,
    height: 60,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    fontFamily: 'OpenSans-Bold',
    color: '#000000',
    marginBottom: 11,
  
  },
  description: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    color: '#000000',
    lineHeight: 24,
    fontWeight:"200",
    marginBottom: 40,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    gap: 10,
    marginLeft: 6,
  },
  inputFieldContainer: {
    alignItems: 'flex-start',
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',
    marginBottom: 8,
    marginLeft: 5,
    fontWeight:"100",
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'black',
    minWidth: 100,
  },
  countryAbbreviation: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',
    marginRight: 6,
  },
  countryCodeDisplay: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',
    marginRight: 8,
  },
  dropdownIcon: {
    marginLeft: 4,
  },
  phoneInputWrapper: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: '#000000',
  },
  phoneInput: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    color: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 52,
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  continueButton: {
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 30,
    paddingVertical: 15,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold',
  },
  privacyText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#000000',
    fontWeight:"500",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold',
    color: '#000000',
  },
  modalCloseButton: {
    padding: 4,
  },
  countryCodeList: {
    paddingHorizontal: 20,
  },
  countryCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',
    marginLeft: 12,
    width: 60,
  },
  countryName: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#666666',
    marginLeft: 12,
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#FF0000',
    marginTop: 4,
    marginLeft: 5,
  },
});

export default styles;

