import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  progressBarContainer: {
    width: '90%',
    height: hp(8),
    borderRadius: rs(30),
    backgroundColor: '#D0E8F0',
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(20),
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(8),
  },
  cameraIcon: {
    marginRight: wp(8),
  },
  headerText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    flex: 1,
    lineHeight: rf(24),
  },
  subtitleText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginBottom: hp(24),
  // Align with header text (icon width + margin)
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: hp(24),
  },
  photoSlot: {
    width: wp(160),
    height: wp(160),
    backgroundColor: '#FFFFFF',
    borderRadius: rs(12),
    marginBottom: hp(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: rs(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: '#FDFF8D',
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addButton: {
    width: wp(64),
    height: wp(64),
    borderRadius: wp(32),
  
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: wp(32),
    height: wp(32),
    resizeMode: 'contain',
  },
  removeButton: {
    position: 'absolute',
    top: wp(8),
    right: wp(8),
    width: wp(32),
    height: wp(32),
    borderRadius: wp(3),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp(20),
  },
  removeIcon: {
    width: wp(27),
    height: wp(30),
    resizeMode: 'contain',
    marginBottom: wp(7),
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: rs(12),
    padding: wp(16),
    marginBottom: hp(16),
  },
  lightbulbIcon: {
    width: wp(50),
    height: wp(50),
    resizeMode: 'contain',
  },
  tipsText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    marginLeft: wp(12),
    flex: 1,
    lineHeight: rf(20),
  },
  tipsLink: {
    color: 'black',
    fontFamily: 'GTMaruBold',
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: hp(32),
    width: '100%',
  },
  continueButton: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FDFF8D',
    borderRadius: rs(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  dragIndicator: {
    position: 'absolute',
    bottom: wp(8),
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: wp(4),
  },
});

export default styles;

