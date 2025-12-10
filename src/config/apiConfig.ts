// API Configuration
// TODO: After rebuilding the app, uncomment the react-native-config import below
// and use: const GEMINI_API_KEY = Config.GEMINI_API_KEY || FALLBACK_API_KEY;
// import Config from 'react-native-config';

// API key - currently using direct value for immediate functionality
// After rebuilding with react-native-config, this will read from .env file
const FALLBACK_API_KEY = 'AIzaSyAcshrReT2l1oYE3JdiT-GhwtmNEGX5UDQ';

// Get API key (will use .env after rebuild, fallback for now)
export const GEMINI_API_KEY = FALLBACK_API_KEY;
// After rebuild: export const GEMINI_API_KEY = Config.GEMINI_API_KEY || FALLBACK_API_KEY;

// API URLs - Using gemini-2.5-flash (supports both text and images)
// Available models for this API key: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash
export const GEMINI_API_URL_TEXT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
export const GEMINI_API_URL_VISION = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

