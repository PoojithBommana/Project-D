import { StyleSheet, Dimensions } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    paddingBottom: hp(12),
    backgroundColor: '#FFFCF1',
    marginTop: hp(35),
  },
  headerTitle: {
    fontSize: rf(28),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    letterSpacing: rs(0.5),
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(16),
  },
  iconButton: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
  },
  swiperWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(10),
    paddingBottom: hp(10),
    marginTop: hp(50),
    backgroundColor: '#FFFCF1',
    overflow: 'visible',
  },
  cardStackContainer: {
    width: width - wp(40),
    height: hp(600),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackCard: {
    position: 'absolute',
    alignSelf: 'center',
  },
  swiperStyle: {
    backgroundColor: 'transparent',
  },
  profileCard: {
    borderRadius: rs(24),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    alignSelf: 'center',
    borderWidth: 0,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(20),
    paddingBottom: hp(24),
    paddingTop: hp(16),
  },
  likesYouBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: rs(20),
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    marginBottom: hp(12),
  },
  likesYouText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginLeft: wp(6),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(8),
  },
  locationText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#FFFFFF',
    marginLeft: wp(4),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: hp(8),
  },
  nameText: {
    fontSize: rf(36),
    fontFamily: 'GTMaruBold',
    color: '#FFFFFF',
    marginRight: wp(8),
  },
  ageText: {
    fontSize: rf(24),
    fontFamily: 'GTMaruRegular',
    color: '#FFFFFF',
  },
  bioText: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#FFFFFF',
    lineHeight: rf(24),
    marginBottom: hp(16),
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: rs(16),
    paddingVertical: hp(6),
    paddingHorizontal: wp(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  interestText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#FFFFFF',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingBottom: hp(30),
    paddingTop: hp(10),
    gap: wp(20),
  },
  actionButton: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#FF6B6B',
  },
  superlikeButton: {
    backgroundColor: '#FDDA0D',
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
});

export default styles;

