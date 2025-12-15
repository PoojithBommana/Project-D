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
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(40),
    justifyContent: 'flex-start',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: hp(24),
    marginTop: hp(10),
  },
  bellCircle: {
    width: wp(120),
    height: wp(120),
    borderRadius: wp(60),
    backgroundColor: '#FDFF8D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    width: wp(100),
    height: wp(90),
  },
  headingContainer: {
    marginBottom: hp(24),
    alignItems: 'center',
  },
  heading: {
    fontSize: rf(28),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    lineHeight: rf(36),
    marginBottom: hp(8),
    textAlign: 'center',
  },
  subheading: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(24),
    textAlign: 'center',
    paddingHorizontal: wp(20),
  },
  notificationListContainer: {
    width: '100%',
    marginBottom: hp(24),
    marginTop: hp(16),
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    padding: wp(12),
    marginBottom: hp(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: wp(12),
  },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: rs(16),
    height: rs(16),
    borderRadius: rs(8),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerSmall: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(12),
  },
  notificationContent: {
    flex: 1,
  },
  notificationName: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(2),
  },
  notificationText: {
    fontSize: rf(12),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
  },
  notificationTime: {
    fontSize: rf(12),
    fontFamily: 'GTMaruRegular',
    color: '#999999',
    marginLeft: wp(8),
  },
  buttonContainer: {
    marginTop: hp(16),
    marginBottom: hp(32),
    width: '100%',
    alignItems: 'center',
  },
  turnOnButton: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FDFF8E',
    padding: wp(13),
    borderRadius: rs(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  turnOnButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  notRightNowButton: {
    paddingVertical: hp(8),
    paddingHorizontal: wp(16),
  },
  notRightNowText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    textAlign: 'center',
  },
});

export default styles;

