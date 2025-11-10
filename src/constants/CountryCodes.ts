/**
 * Country Codes Constants
 * 
 * Centralized list of supported country codes.
 * Easy to maintain and extend.
 */

export interface CountryCode {
  code: string;
  country: string;
  abbreviation: string;
  flag: string;
}

/**
 * List of supported country codes
 */
export const COUNTRY_CODES: CountryCode[] = [
  { code: '+91', country: 'India', abbreviation: 'IN', flag: '🇮🇳' },
  { code: '+1', country: 'USA', abbreviation: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', abbreviation: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', abbreviation: 'AE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', abbreviation: 'SG', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', abbreviation: 'AU', flag: '🇦🇺' },
  { code: '+86', country: 'China', abbreviation: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', abbreviation: 'JP', flag: '🇯🇵' },
];

/**
 * Default country code
 */
export const DEFAULT_COUNTRY_CODE = '+91';

