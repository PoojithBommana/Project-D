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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingTop: hp(24),
    paddingBottom: hp(16),
  },
  backButton: {
    width: wp(40),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'left',
    marginLeft: wp(12),
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: hp(24),
    paddingBottom: hp(40),
    paddingHorizontal: wp(20),
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(16),
    paddingVertical: hp(20),
    paddingHorizontal: wp(20),
    marginBottom: hp(32),
  },
  section: {
    marginBottom: hp(8),
  },
  sectionHeader: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(12),
  },
  emailText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    marginBottom: hp(12),
  },
  optionItem: {
    paddingVertical: hp(12),
  },
  optionText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
  },
  deleteAccountText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#FF3B30',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: hp(16),
  },
  appInfoContainer: {
    alignItems: 'center',
    marginTop: hp(24),
    marginBottom: hp(40),
  },
  appIcon: {
    width: wp(80),
    height: hp(80),
    marginBottom: hp(12),
  },
  versionText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    marginBottom: hp(4),
  },
  taglineText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#999999',
  },
  // Profile Details Section
  profileFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(12),
  },
  profileFieldContent: {
    flex: 1,
  },
  profileFieldLabel: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#666666',
    marginBottom: hp(4),
  },
  profileFieldValue: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  profileFieldInput: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#FDDA0D',
    paddingVertical: hp(4),
    minWidth: wp(200),
  },
  editIconButton: {
    padding: wp(8),
  },
  saveCancelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: hp(8),
    gap: wp(16),
  },
  saveButton: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
  },
  saveButtonText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#FDDA0D',
  },
  cancelButtonText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#666666',
  },
  // Password Section
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(12),
  },
  passwordInfo: {
    flex: 1,
  },
  passwordLabel: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  passwordSubtext: {
    fontSize: rf(12),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginTop: hp(4),
  },
});

export default styles;

