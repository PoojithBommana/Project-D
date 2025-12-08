import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';

export const API_BASE_URL = __DEV__
  ? 'https://snixx-backend.onrender.com'
  : 'https://snixx-backend.onrender.com';
const Base_URL = API_BASE_URL;

export const getApiUrl = (category: string, endpoint: string) => {
  if (!Base_URL) {
    throw new Error(
      'Base_URL is not set. Please call setTenantAPI with a valid tenant key.',
    );
  }
  return `${Base_URL}/${API_ENDPOINTS[category][endpoint]}`;
};

const api = axios.create({
  baseURL: Base_URL,
});
api.interceptors.request.use(request => {
  console.log('Starting Request', request.url);
  return request;
});

api.interceptors.response.use(response => {
  // console.log("Response:", JSON.stringify(response.data));
  return response;
});
export default api;

export const postApiCall = async (
  method: string,
  screenName: string,
  endpoint: string,
  params: any,
  authToken?: string,
) => {
  try {
    const commonParams = {
      // "DeviceInfo": [
      //   {
      //     "DeviceType": DeviceInfo.deviceType,
      //     "OSVersion": DeviceInfo.osVersion,
      //     "OriginatingIP": "183.82.116.84",
      //     "SessionID": "iedtpmh83f860p0daqq75bhf76kbmmlt",
      //     "Browser": DeviceInfo.osName,
      //     "HostName": "183.82.116.84.actcorp.in",
      //     "SourcePortNo": "0"
      //   }
      // ],
      // "IsAdmin": "0",
      // "UserName":global?.UserName,
      // "Role": "Full Access",
      // "UserId": global?.UserId,
    };

    const finalParams = { ...commonParams, ...params };
    // console.log('Params', commonParams);
    console.log(finalParams, '----->>>finalParams');
    const headers: Record<string, string> = {
      method,
      'Content-Type': 'application/json',
    };

    // Only attach auth header when a token is provided to avoid invalid/empty tokens
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    let responseData = await api.post(
      `${Base_URL}${API_ENDPOINTS[screenName][endpoint]}`,
      finalParams,
      { headers },
    );

    return {
      response: responseData.data,
      statusCode: responseData.status,
      statusText: responseData.statusText,
    };
  } catch (error: any) {
    if (error?.response) {
      return {
        error: true,
        response: error?.response?.data || { Message: error?.message || 'Server error' },
        statusCode: error?.response?.status,
        statusText: error?.response?.statusText,
      };
    } else if (error.request) {
      return {
        error: true,
        response: { Message: 'Network error: Unable to reach server' },
      };
    } else {
      return {
        error: true,
        response: { Message: error?.message || 'Unknown error occurred' },
      };
    }
  }
};

/**
 * Makes a GET request to an external API (full URL)
 * Used for third-party APIs like Spotify
 */
export const getExternalApiCall = async (url: string) => {
  try {
    const responseData = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      response: responseData.data,
      statusCode: responseData.status,
      statusText: responseData.statusText,
    };
  } catch (error: any) {
    if (error?.response) {
      return {
        error: true,
        response: error?.response?.data || { Message: error?.message || 'Server error' },
        statusCode: error?.response?.status,
        statusText: error?.response?.statusText,
      };
    } else if (error.request) {
      return {
        error: true,
        response: { Message: 'Network error: Unable to reach server' },
      };
    } else {
      return {
        error: true,
        response: { Message: error?.message || 'Unknown error occurred' },
      };
    }
  }
};