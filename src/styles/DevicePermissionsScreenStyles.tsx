import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(60),
    backgroundColor: 'FFFCF1',
    justifyContent: 'space-between',
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: hp(32),
  },
  heading: {
    fontSize: rf(28),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    lineHeight: rf(36),
    marginBottom: hp(12),
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
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(16),
    paddingVertical: hp(8),
    marginBottom: hp(32),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(16),
    paddingHorizontal: wp(16),
  },
  permissionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: wp(16),
  },
  permissionIconContainer: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(12),
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: hp(4),
  },
  permissionDescription: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(20),
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: wp(68), // Align with content (icon width + margin)
  },
  switch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
  buttonContainer: {
    width: '100%',
    marginBottom: hp(40),
  },
  getStartedButton: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FDFF8D',
    borderRadius: rs(12),
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  getStartedButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: 'black',
  },
});

export default styles;

