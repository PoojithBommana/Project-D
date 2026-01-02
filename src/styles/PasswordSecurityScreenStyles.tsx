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
    paddingTop: hp(36),
    paddingBottom: hp(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: wp(40),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: rf(26),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'left',
    marginLeft: wp(12),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: hp(24),
    paddingBottom: hp(40),
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(16),
    paddingVertical: hp(20),
    paddingHorizontal: wp(20),
    marginHorizontal: wp(20),
    marginBottom: hp(32),
  },
  section: {
    marginBottom: hp(32),
  },
  sectionHeader: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(12),
  },
  sectionDescription: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginBottom: hp(16),
    lineHeight: rf(20),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    paddingVertical: hp(16),
    paddingHorizontal: wp(16),
    marginBottom: hp(8),
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  listItemIcon: {
    width: wp(24),
    height: hp(24),
    marginRight: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(4),
  },
  listItemSubtitle: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
  },
  listItemArrow: {
    marginLeft: wp(8),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: hp(16),
  },
  linkText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#FDDA0D',
    marginTop: hp(8),
  },
});

export default styles;

