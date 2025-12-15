import { StyleSheet } from 'react-native';
import { hp, rf, rs, wp } from '../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
    paddingHorizontal: wp(20),
  },
  progressBarContainer: {
    width: '90%',
    height: hp(9),
    borderRadius: rs(30),
    backgroundColor: '#E8E8E8',
    marginTop: hp(32),
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
    marginTop: hp(32),
  },
  heading: {
    fontSize: rf(22),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    lineHeight: rf(28),
    marginBottom: hp(12),
  },
  subheading: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(20),
    marginBottom: hp(28),
  },
  labelRow: {
    marginBottom: hp(12),
  },
  label: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#1C1C1C',
  },
  selectorContainer: {
    width: '100%',
    borderRadius: rs(14),
    backgroundColor: '#FFFFFF',
    borderWidth: rs(1),
    borderColor: '#FEFFAF',
    overflow: 'hidden',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruRegular',
    color: '#999999',
  },
  itemTextSelected: {
    fontSize: rf(20),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  selectionOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: -rs(24),
    borderWidth: rs(1.5),
    borderColor: 'grey',
    borderRadius: rs(12),
    backgroundColor: 'rgba(253, 255, 141, 0.25)',
    pointerEvents: 'none',
  },
  footer: {
    paddingVertical: hp(24),
    width: '100%',
  },
  nextButton: {
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
  nextButtonText: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
});

export default styles;


