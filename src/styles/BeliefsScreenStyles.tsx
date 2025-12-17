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
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(32),
  },
  heading: {
    fontSize: rf(24),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    lineHeight: rf(32),
    marginBottom: hp(8),
  },
  subheading: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    lineHeight: rf(20),
    marginBottom: hp(8),
  },
  linkText: {
    fontSize: rf(13),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textDecorationLine: 'underline',
    marginBottom: hp(24),
  },
  sectionTitle: {
    fontSize: rf(16),
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginTop: hp(16),
    marginBottom: hp(10),
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(12),
  },
  pill: {
    paddingVertical: hp(10),
    paddingHorizontal: wp(18),
    borderRadius: rs(24),
    backgroundColor: '#F5F5F5',
  },
  pillSelected: {
    backgroundColor: '#FDFF8D',
  },
  pillText: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
  },
  pillTextSelected: {
    fontFamily: 'GTMaruBold',
  },
  footer: {
    paddingHorizontal: wp(24),
    paddingBottom: hp(24),
    paddingTop: hp(12),
    width: '100%',
  },
  nextButton: {
    width: '100%',
    height: hp(56),
    borderRadius: rs(12),
    backgroundColor: '#FDFF8E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextIcon: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
});

export default styles;


