/**
 * AuthService
 * 
 * Service layer for authentication-related API calls.
 * Provides a clean interface for authentication operations.
 * 
 * Features:
 * - Phone number OTP sending
 * - OTP verification
 * - OTP resend
 * - Error handling
 * - Type safety
 */

export interface SendOTPRequest {
  countryCode: string;
  phoneNumber: string;
}

export interface SendOTPResponse {
  success: boolean;
  message?: string;
  sessionId?: string;
  error?: string;
}

export interface VerifyOTPRequest {
  otp: string;
  countryCode: string;
  phoneNumber: string;
  sessionId?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    phoneNumber: string;
  };
  error?: string;
}

/**
 * AuthService Class
 * 
 * Handles all authentication-related API operations.
 * Future-ready for backend integration.
 */
class AuthService {
  private baseURL: string;

  constructor() {
    // TODO: Replace with actual API base URL from environment config
    this.baseURL = 'https://api.dilmil.com'; // Placeholder
  }

  /**
   * Sends OTP to the provided phone number
   */
  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/send-otp`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request),
      // });
      // return await response.json();

      // Mock implementation for development
      console.log('Sending OTP to:', request.countryCode + request.phoneNumber);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'OTP sent successfully',
        sessionId: `session_${Date.now()}`,
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  }

  /**
   * Verifies the OTP code
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/auth/verify-otp`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request),
      // });
      // return await response.json();

      // Mock implementation for development
      console.log('Verifying OTP:', request.otp);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - accept any 6-digit code for development
      if (request.otp.length === 6 && /^\d{6}$/.test(request.otp)) {
        return {
          success: true,
          message: 'OTP verified successfully',
          token: `token_${Date.now()}`,
          user: {
            id: 'user_123',
            phoneNumber: request.countryCode + request.phoneNumber,
          },
        };
      }
      
      return {
        success: false,
        error: 'Invalid OTP code',
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
      };
    }
  }

  /**
   * Resends OTP to the provided phone number
   */
  async resendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    return this.sendOTP(request);
  }
}

// Export singleton instance
export const authService = new AuthService();

