import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * AccountNotFoundScreen Styles
 * 
 * Organized styling for the Account Not Found screen.
 * Uses responsive dimensions and consistent spacing.
 */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    height: 60,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'OpenSans-Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  createAccountButton: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#000000',
    borderRadius: 30,
    paddingVertical: 15,
  },
  createAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
  },
  tryDifferentMethodButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  tryDifferentMethodButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
  },
});

export default styles;

