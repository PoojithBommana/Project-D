import { StyleSheet } from 'react-native';
import { wp, hp, rf } from '../utils/responsive';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  header: {
    paddingHorizontal: wp(20),
    paddingTop: hp(12),
    paddingBottom: hp(8),
    backgroundColor: '#FFFCF1',
  },
  headerTitle: {
    fontSize: rf(32),
    fontFamily: 'GTMaruBold',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  searchContainer: {
    backgroundColor: '#FFFCF1',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  scrollContent: {
    paddingBottom: hp(100),
    backgroundColor: '#FFFCF1',
  },
});

export default styles;

