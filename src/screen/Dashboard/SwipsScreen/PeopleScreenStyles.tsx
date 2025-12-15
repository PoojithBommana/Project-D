import { StyleSheet, Dimensions } from 'react-native';
import { hp, wp, screenWidth, screenHeight } from '../../../utils/responsive';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

const CARD_WIDTH = WINDOW_WIDTH * 0.88; // Reduced width
const CARD_HEIGHT = WINDOW_HEIGHT * 0.65; // Reduced height
const CARD_BORDER_RADIUS = 20;
const STACK_OFFSET = 35; // Vertical offset between stacked cards (increased for very pronounced top stack effect)
const STACK_SCALE_1 = 0.91; // Scale for first card behind
const STACK_SCALE_2 = 0.82; // Scale for second card behind
const STACK_SCALE_3 = 0.74; // Scale for third card behind
const STACK_SCALE_4 = 0.66; // Scale for fourth card behind

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    opacity: 0.3,
    backgroundColor: '#000000',
  },
  homescreenBackgroundContainer: {
    position: 'absolute',
    top: -hp(70),
    left: 0,
    right: 0,
    bottom: -hp(100),
    width: '100%',
    height: '120%',
    zIndex: 0,
    backgroundColor: 'transparent',
  },
  homescreenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  snixxHomeText: {
    position: 'absolute',
    top: hp(70),
    left: wp(0),
    right: 0,
    width: '100%',
    height: wp(300),
    alignSelf: 'center',
    zIndex: 1,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 2,
  },
  cardStackContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
    overflow: 'visible',
    zIndex: 1,
    marginBottom: hp(63),
    backgroundColor: 'transparent',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  cardImageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
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
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp(24),
    zIndex: 10,
  },
  badgesContainer: {
    position: 'absolute',
    top: wp(16),
    left: wp(16),
    flexDirection: 'column',
    gap: wp(8),
    zIndex: 10,
  },
  badge: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(12),
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: wp(12),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  badgeDuration: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
  },
  badgeGenre: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  badgeGenreText: {
    color: '#000000',
  },
  title: {
    fontSize: wp(32),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: hp(8),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: wp(16),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: hp(4),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dateText: {
    fontSize: wp(14),
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(32),
  },
  emptyStateText: {
    fontSize: wp(18),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: hp(16),
  },
  overlayLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'none',
  },
  overlayLabel: {
    paddingHorizontal: wp(32),
    paddingVertical: hp(16),
    borderRadius: wp(12),
    borderWidth: 4,
  },
  overlayLabelText: {
    fontSize: wp(24),
    fontWeight: '800',
    letterSpacing: 2,
  },
  likeLabel: {
    borderColor: '#4ADE80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  likeLabelText: {
    color: '#4ADE80',
  },
  passLabel: {
    borderColor: '#F87171',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
  },
  passLabelText: {
    color: '#F87171',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: hp(50),
    paddingBottom: hp(20),
    paddingHorizontal: wp(20),
    alignItems: 'center',
    zIndex: 1000,
  },
  segmentedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(20),
  },
  segmentButton: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    marginHorizontal: wp(8),
  },
  segmentButtonActive: {
    // Active button styling handled by text
  },
  segmentText: {
    fontSize: wp(14),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  segmentTextActive: {
    fontSize: wp(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
   
});

export default styles;
export { CARD_WIDTH, CARD_HEIGHT, CARD_BORDER_RADIUS, STACK_OFFSET, STACK_SCALE_1, STACK_SCALE_2, STACK_SCALE_3, STACK_SCALE_4 };
