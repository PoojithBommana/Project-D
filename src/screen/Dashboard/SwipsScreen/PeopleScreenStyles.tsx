import { StyleSheet, Dimensions, Platform } from 'react-native';
import { hp, wp, rf, rs } from '../../../utils/responsive';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

const CARD_WIDTH = WINDOW_WIDTH - wp(16);
const CARD_HEIGHT = WINDOW_HEIGHT - hp(180);
const CARD_BORDER_RADIUS = 20;
const IMAGE_HEIGHT = CARD_HEIGHT; // Full card height for image - fills entire visible card area

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingTop: Platform.OS === 'ios' ? hp(50) : hp(20),
    paddingBottom: hp(10),
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  logoText: {
    fontSize: wp(41),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginTop: hp(10),
  },
  headerIcon: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
    gap: 4,
  },
  menuIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuIconCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  menuIconDash: {
    width: 8,
    height: 2,
    backgroundColor: '#000000',
  },

  // Card Stack
  cardStackContainer: {
    flex: 1,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
    marginTop: hp(5),
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  // Scrollable Container Inside Card
  cardScrollContainer: {
    flex: 1,
  },

  // Image Section
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    position: 'relative',
    backgroundColor: '#000000',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  profileInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp(20),
    paddingBottom: wp(24),
    zIndex: 5,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(0),
    marginBottom: hp(8),
    gap: wp(12),
  },
  thumbnailContainer: {
    position: 'relative',
    width: wp(64),
    height: wp(64),
  },
  thumbnailPicture: {
    width: '100%',
    height: '100%',
    borderRadius: wp(32),
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: -wp(2),
    right: -wp(2),
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  plusIcon: {
    width: wp(14),
    height: wp(14),
    tintColor: '#000000',
  },
  nameVerifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  profileName: {
    fontSize: rf(26),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  verifiedIcon: {
    marginTop: hp(2),
  },
  usernameFollowersContainer: {
    paddingHorizontal: wp(0),
    marginBottom: hp(8),
  },
  usernameFollowersText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  profileLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(0),
    marginBottom: hp(8),
    gap: wp(6),
  },
  profileLocationIcon: {
    marginRight: wp(2),
  },
  profileLocationText: {
    fontSize: rf(13),
    fontFamily: 'GTMaruRegular',
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.85,
  },
  accountButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(0),
    gap: wp(12),
    marginTop: hp(8),
  },
  accountButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(12),
    borderRadius: wp(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  accountButtonText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruMedium',
    fontWeight: '500',
    color: '#FFFFFF',
  },

  // Connect Button
  connectButton: {
    position: 'absolute',
    top: wp(16),
    right: wp(16),
    paddingHorizontal: wp(20),
    paddingVertical: hp(10),
    borderRadius: wp(20),
    overflow: 'hidden',
    minWidth: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 15,
  },
  connectButtonText: {
    fontSize: wp(14),
    fontWeight: '700',
    color: '#000000',
    zIndex: 2,
  },
  connectButtonGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: wp(20),
  },
  androidGlassButton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: wp(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },

  // Share Button
  shareButton: {
    position: 'absolute',
    top: wp(16),
    right: wp(16),
    zIndex: 10,
  },
  shareButtonCircle: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: 'rgba(100, 100, 100, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: wp(20),
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Details Container (Below Image)
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(16),
    paddingTop: hp(20),
  },

  // Card Sections (Bio, About, Looking For, etc.)
  bioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(12),
    padding: wp(16),
    marginBottom: hp(12),
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(12),
    padding: wp(16),
    marginBottom: hp(12),
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lookingForCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(12),
    padding: wp(16),
    marginBottom: hp(12),
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: wp(12),
    padding: wp(16),
    marginBottom: hp(12),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  interestsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(12),
    padding: wp(16),
    marginBottom: hp(12),
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  photosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(12),
    padding: wp(16),
    paddingBottom: wp(16),
    marginBottom: hp(12),
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Section Titles
  sectionTitle: {
    fontSize: wp(18),
    fontWeight: '700',
    color: '#000000',
    marginBottom: hp(12),
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },

  // Bio Section
  bioText: {
    fontSize: wp(15),
    fontFamily: 'GTMaruRegular',
    fontWeight: '400',
    color: '#000000',
    lineHeight: wp(22),
    marginBottom: hp(12),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: hp(12),
  },
  complimentButton: {
    position: 'absolute',
    bottom: hp(60),
    left: wp(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: hp(10),
    paddingHorizontal: wp(16),
    borderRadius: wp(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  complimentButtonContainer: {
    marginTop: hp(16),
  },
  complimentDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 0,
  },
  complimentButtonBelow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: hp(16),
    paddingHorizontal: wp(20),
    borderRadius: 0,
    borderBottomLeftRadius: wp(12),
    borderBottomRightRadius: wp(12),
    gap: wp(12),
  },
  complimentIconContainer: {
    position: 'relative',
    width: wp(26),
    height: wp(26),
    justifyContent: 'center',
    alignItems: 'center',
  },
  complimentHeartIcon: {
    position: 'absolute',
    top: hp(6),
    left: wp(6),
  },
  complimentText: {
    fontSize: wp(15),
    fontWeight: '500',
    color: '#333333',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },

  // Tags Container
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(16),
    marginBottom: hp(4),
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  tagIcon: {
    marginRight: wp(6),
  },
  tagText: {
    fontSize: wp(14),
    color: '#000000',
    fontWeight: '500',
  },
  pillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: hp(10),
    paddingHorizontal: wp(14),
    borderRadius: rs(20),
    borderWidth: 0.5,
    borderColor: '#E8E8E8',
    marginBottom: hp(6),
  },
  pillTagText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruMedium',
    fontWeight: '500',
    color: '#000000',
  },

  // Star Highlight
  starHighlight: {
    position: 'absolute',
    top: hp(12),
    right: wp(16),
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: wp(22),
  },

  // Location Section
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(12),
  },
  locationIcon: {
    fontSize: wp(18),
    marginRight: wp(10),
    marginTop: hp(2),
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: wp(16),
    fontWeight: '600',
    color: '#000000',
    marginBottom: hp(4),
  },
  distanceText: {
    fontSize: wp(14),
    color: '#666666',
  },
  locationButtons: {
    flexDirection: 'row',
    gap: wp(8),
  },
  locationButton: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: wp(12),
    paddingVertical: hp(8),
    borderRadius: wp(16),
  },
  locationButtonText: {
    fontSize: wp(13),
    color: '#000000',
    fontWeight: '500',
  },

  // Interests Section
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
  },
  interestTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: wp(20),
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  interestText: {
    fontSize: wp(14),
    color: '#333333',
    fontWeight: '500',
  },

  // Photos Grid
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(8),
  },
  gridPhoto: {
    width: (CARD_WIDTH - wp(48)) / 2,
    height: wp(200),
    borderRadius: wp(12),
    backgroundColor: '#F5F5F5',
  },
  // Photos List - One photo per row
  photosList: {
    flexDirection: 'column',
    gap: hp(12),
  },
  photoItem: {
    width: '100%',
    marginBottom: hp(8),
  },
  fullWidthPhoto: {
    width: '100%',
    height: hp(450),
    borderRadius: wp(20),
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: hp(8),
    paddingBottom: Platform.OS === 'ios' ? hp(20) : hp(8),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(4),
  },
  navItemActive: {
    // Active state handled by label color
  },
  navIcon: {
    fontSize: wp(24),
    marginBottom: hp(2),
  },
  navLabel: {
    fontSize: wp(10),
    color: '#999999',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#000000',
    fontWeight: '700',
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(32),
  },
  emptyStateText: {
    fontSize: wp(16),
    fontWeight: '600',
    color: '#999999',
    textAlign: 'center',
    marginTop: hp(16),
  },

  // Inline Action Buttons (in scrollable content)
// Inline Action Buttons (in scrollable content)
inlineActionsContainer: {
  backgroundColor: '#FFFFFF',
  paddingTop: hp(32),
  paddingBottom: hp(32),
  paddingHorizontal: wp(0),
  marginTop: hp(0),
  alignItems: 'center',
},
actionButtonsRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: wp(32),
  marginBottom: hp(24),
  paddingHorizontal: wp(0),
},
actionButton: {
  justifyContent: 'center',
  alignItems: 'center',
},
actionButtonCenter: {
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: hp(-4),
},
passButton: {
  width: wp(60),
  height: wp(60),
  borderRadius: wp(30),
  backgroundColor: '#000000',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,
},
superlikeButton: {
  width: wp(70),
  height: wp(70),
  borderRadius: wp(35),
  backgroundColor: '#F4C945',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#F4C945',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.35,
  shadowRadius: 8,
  elevation: 8,
},
likeButton: {
  width: wp(60),
  height: wp(60),
  borderRadius: wp(30),
  backgroundColor: '#000000',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,
},
blockReportRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: wp(0),
  paddingTop: hp(8),
},
textButton: {
  paddingVertical: hp(12),
  paddingHorizontal: wp(24),
},
blockText: {
  fontSize: wp(15),
  color: '#000000',
  fontWeight: '600',
  fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  letterSpacing: 0.2,
},
reportText: {
  fontSize: wp(15),
  color: '#FF3B30',
  fontWeight: '600',
  fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  letterSpacing: 0.2,
},
});

export default styles;
export { CARD_WIDTH, CARD_HEIGHT, CARD_BORDER_RADIUS, IMAGE_HEIGHT };