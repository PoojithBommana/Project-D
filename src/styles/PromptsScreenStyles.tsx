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
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentKeyboardOpen: {
    paddingBottom: hp(300),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(40),
    paddingBottom: hp(100),
  },
  headerContainer: {
    marginBottom: hp(32),
  },
  heading: {
    fontSize: rf(24),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    lineHeight: rf(32),
    marginBottom: hp(12),
  },
  subheading: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(20),
  },
  usernameSection: {
    marginBottom: hp(32),
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  usernameInput: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    borderWidth: rs(2),
    borderColor: '#FEFFAF',
    paddingHorizontal: wp(16),
    paddingRight: wp(50),
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  usernameInputError: {
    borderColor: '#FF0000',
  },
  checkmarkContainer: {
    position: 'absolute',
    right: wp(16),
    top: '50%',
    transform: [{ translateY: -rf(12) }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    width: rf(24),
    height: rf(24),
  },
  errorText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#FF0000',
    marginTop: hp(8),
    marginLeft: wp(4),
  },
  photoSection: {
    marginBottom: hp(32),
  },
  sectionLabel: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#666666',
    marginBottom: hp(12),
  },
  photoContainer: {
    width: wp(150),
    height: wp(150),
    borderRadius: rs(16),
    borderWidth: rs(2),
    borderStyle: 'dashed',
    borderColor: '#FDDA0D',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: rs(40),
    height: rs(40),
    marginBottom: hp(8),
  },
  photoPlaceholderText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#FDDA0D',
  },
  bioSection: {
    marginBottom: hp(24),
  },
  bioInput: {
    width: '100%',
    minHeight: hp(120),
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    borderWidth: rs(1),
    borderColor: '#E0E0E0',
    paddingHorizontal: wp(16),
    paddingVertical: hp(12),
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    textAlignVertical: 'top',
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
    backgroundColor: '#FDFF8D',
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
  continueButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  continueButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
});

export default styles;

