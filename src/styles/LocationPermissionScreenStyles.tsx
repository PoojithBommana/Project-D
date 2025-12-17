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
  progressBarContainer: {
    width: '90%',
    height: hp(8),
    borderRadius: rs(30),
    backgroundColor: '#E8E8E8',
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
  content: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    width: '100%',
    height: hp(350),
    marginBottom: hp(0),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: hp(100),
    paddingHorizontal: wp(20),
  },
  heading: {
    fontSize: rf(24),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: hp(16),
    lineHeight: rf(32),
  },
  subheading: {
    fontSize: rf(16),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: rf(24),
  },
  buttonContainer: {
    width: '100%',
    marginTop: hp(20),
  },
  allowButton: {
    width: '100%',
    height: hp(56),
    backgroundColor: '#FDFF8E',
    borderRadius: rs(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  allowButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    letterSpacing: rs(0.5),
  },
});

export default styles;

