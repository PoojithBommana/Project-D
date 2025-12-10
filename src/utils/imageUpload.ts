import { Platform } from 'react-native';
import { Asset } from 'react-native-image-picker';

/**
 * Uploads an image (file uri or base64) to Cloudinary's public demo bucket
 * and returns a CDN URL. Replace CLOUD_NAME / UPLOAD_PRESET with project
 * values when you have your own storage.
 */
const CLOUD_NAME = 'drj3vzbiy'; // TODO: replace with your Cloudinary cloud name
const UPLOAD_PRESET = 'snixx_unsigned'; // TODO: replace with your unsigned preset
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export type UploadableImage = Asset | { uri?: string; base64?: string; type?: string; fileName?: string };

export async function uploadImageAndGetUrl(image: UploadableImage): Promise<string> {
  const uri = image?.uri;
  const base64 = (image as any)?.base64;
  const mime = image?.type || 'image/jpeg';
  const name = (image as any)?.fileName || `upload-${Date.now()}.jpg`;

  if (!uri && !base64) {
    throw new Error('No image payload to upload');
  }

  const formData = new FormData();
  formData.append('upload_preset', UPLOAD_PRESET);

  // Cloudinary accepts either a file object (uri) or a data URI string.
  if (uri && !base64) {
    formData.append('file', {
      // iOS requires file://, Android requires content:// or file://
      uri: Platform.OS === 'android' && !uri.startsWith('file://') ? uri : uri,
      type: mime,
      name,
    } as any);
  } else {
    const dataUri = base64?.startsWith('data:')
      ? base64
      : `data:${mime};base64,${base64}`;
    formData.append('file', dataUri);
  }

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image upload failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  if (!data?.secure_url) {
    throw new Error('Image upload failed: secure_url missing in response');
  }

  return data.secure_url as string;
}
