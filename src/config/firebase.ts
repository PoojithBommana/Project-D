import auth from '@react-native-firebase/auth';

/**
 * Central Firebase Auth export.
 * Use this instead of importing directly from '@react-native-firebase/auth'
 * so we have a single place to adjust configuration if needed.
 */
export const firebaseAuth = auth;

export default auth;


