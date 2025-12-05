import { StyleSheet } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(60),
    paddingBottom: hp(40),
    justifyContent: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: wp(16),
  },
  swatchContainer: {
    width: '47%',
    aspectRatio: 1.1,
    marginBottom: hp(20),
  },
  colorSwatch: {
    flex: 1,
    borderRadius: rs(16),
    padding: wp(16),
    justifyContent: 'flex-end',
    minHeight: hp(160),
  },
  colorInfoContainer: {
    width: '100%',
  },
  colorName: {
    fontSize: rf(18),
    fontFamily: 'GTMaruBold',
    marginBottom: hp(6),
    textAlign: 'left',
  },
  colorHex: {
    fontSize: rf(14),
    fontFamily: 'GTMaruRegular',
    marginBottom: hp(4),
    textAlign: 'left',
  },
  colorRgb: {
    fontSize: rf(12),
    fontFamily: 'GTMaruRegular',
    textAlign: 'left',
  },
});

export default styles;

