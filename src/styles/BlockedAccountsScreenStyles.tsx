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
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingTop: hp(24),
    paddingBottom: hp(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  },
  headerRight: {
    width: wp(40),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  plusButton: {
    width: wp(40),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'center',
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
  blockedUsersSection: {
    marginBottom: hp(24),
  },
  blockedUsersList: {
    // Container for the list of blocked users
  },
  blockedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    paddingVertical: hp(16),
    paddingHorizontal: wp(16),
    marginBottom: hp(8),
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  blockedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: wp(12),
  },
  blockedUserAvatar: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(28),
    marginRight: wp(12),
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },
  blockedUserDetails: {
    flex: 1,
  },
  blockedUserName: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(4),
  },
  blockedUserSubtext: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
  },
  unblockButton: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: rs(8),
    backgroundColor: '#FDDA0D',
  },
  unblockButtonText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#FFFFFF',
  },
  emptyState: {
    paddingVertical: hp(40),
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
  },
});

export default styles;

