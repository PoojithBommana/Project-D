import { StyleSheet } from 'react-native';

/**
 * VerifyPhoneNumberScreen Styles
 * 
 * Organized styling for the OTP Verification screen.
 * Uses the same theme as PhoneNumberLoginPage (white background, clean design).
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
    justifyContent: 'flex-start',
   
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
    fontWeight: '200',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',

    marginBottom: 30,
    marginTop: 10,
    gap: 10,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#000000',
    textAlign: 'center',
    paddingVertical: 0,
  },
  resendContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#000000',
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#FF0000',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default styles;

