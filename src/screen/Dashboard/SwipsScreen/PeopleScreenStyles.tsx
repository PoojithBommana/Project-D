import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFCF1',
    
  },
  appTitle: {
    fontSize: 33,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    letterSpacing: -0.5,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC629',
    letterSpacing: -0.5,
  },

  // Cards Container
  cardsContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 10,
    marginTop: 1,
    marginBottom: 80,
  },
  // Background Image
  backgroundImageContainer: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.95,
    borderRadius: 24,
    overflow: 'hidden',
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.85,
    borderRadius: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
     
    }),
  },
  scrollView: {
    flex: 1,
  },

  // Photo Section
  photoContainer: {
    width: '100%',
    height: height * 0.85,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  shareButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Swipe Labels (Like/Nope Stamps)
  likeLabel: {
    position: 'absolute',
    top: 40,
    left: 32,
    zIndex: 50,
  },
  likeLabelContainer: {
    borderWidth: 4,
    borderColor: '#22C55E',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '-12deg' }],
  },
  likeLabelText: {
    color: '#22C55E',
    fontWeight: 'bold',
    fontSize: 36,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  nopeLabel: {
    position: 'absolute',
    top: 40,
    right: 32,
    zIndex: 50,
  },
  nopeLabelContainer: {
    borderWidth: 4,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '12deg' }],
  },
  nopeLabelText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 36,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Photo Overlay
  photoOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  age: {
    fontSize: 24,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    opacity: 0.9,
  },

  // Details Section
  detailsSection: {
    backgroundColor: '#FDFF8D',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 96,
  },
  
  // Bio Section
  bioSection: {
    marginBottom: 24,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bioHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bioText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#374151',
    fontWeight: '500',
  },

  // Basics Chips
  basicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  basicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  basicChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  // Section (generic)
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '400',
  },

  // Interests Section
  interestsSection: {
    marginBottom: 24,
  },
  interestsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#FFC629',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  interestText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  // More Photos
  morePhotosSection: {
    gap: 16,
    marginBottom: 24,
  },
  morePhoto: {
    width: '100%',
    height: 384,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },

  // End of Profile
  endOfProfile: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  endOfProfileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D1D5DB',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Action Buttons
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 50,
  },
  passButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  superLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  likeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFC629',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#E5E7EB',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  startOverButton: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFC629',
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  startOverButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 8,
    height: 64,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  navButtonActive: {
    // Active state styling
  },
  navButtonActiveIndicator: {
    position: 'absolute',
    top: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#000',
  },
  navButtonActiveIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  navButtonActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  navText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
});