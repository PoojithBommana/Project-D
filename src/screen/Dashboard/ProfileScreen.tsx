import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Backicon, Plusicon } from '../../assets';
import { getApiCall } from '../../config/apiCall';
import styles from '../../styles/ProfileScreenStyles';
import { wp } from '../../utils/responsive';

interface ImageItem {
  id?: string;
  url?: string;
  image?: string;
  photo?: string;
  picture?: string;
  title?: string;
  name?: string;
  emoji?: string;
  [key: string]: any;
}

interface ProfileData {
  name?: string;
  first_name?: string;
  full_name?: string;
  username?: string;
  user_name?: string;
  followers?: number;
  followers_count?: number;
  location?: string;
  personalDetails?: string;
  profilePicture?: string;
  profile_picture?: string;
  thumbnailPicture?: string;
  thumbnail_picture?: string;
  images?: ImageItem[];
  photos?: ImageItem[];
  pictures?: ImageItem[];
  stories?: ImageItem[];
  is_verified?: boolean;
  bio?: string;
  height_cm?: number;
  currently?: string;
  drinking?: string;
  smoking?: string;
  gender?: string;
  zodiac_sign?: string;
  religion?: string;
  pronouns?: string;
  hobbies?: string[];
  activity_interests?: string[];
  causes_communities?: string[];
  qualities?: string[];
  known_languages?: string[];
  connection_goal?: string;
  age?: number;
  [key: string]: any;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [accountType, setAccountType] = useState<'My profile' | 'Share profile'>('My profile');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      const legacyToken = await AsyncStorage.getItem('authToken');
      const token = accessToken || legacyToken;

      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      const response = await getApiCall('AUTH', 'GET_PROFILE', token);

      console.log('=== PROFILE API RESPONSE ===');
      console.log('Full Response:', JSON.stringify(response, null, 2));
      console.log('Response Data:', response?.response);
      console.log('Status Code:', response?.statusCode);
      console.log('Error:', response?.error);
      console.log('===========================');

      if (response?.error) {
        console.error('Error fetching profile:', response?.response);
        setLoading(false);
        return;
      }

      const data = response?.response?.profile || response?.response || {};
      
      console.log('=== PROFILE DATA FIELDS ===');
      Object.keys(data).forEach(key => {
        console.log(`${key}:`, data[key]);
      });
      console.log('===========================');

      setProfileData(data);

      // Extract images from various possible fields
      let extractedImages: ImageItem[] = [];
      
      if (data?.images && Array.isArray(data.images)) {
        extractedImages = data.images.map((img: any) => 
          typeof img === 'string' ? { url: img, image: img } : img
        );
        console.log('Found images in data.images:', extractedImages);
      } else if (data?.photos && Array.isArray(data.photos)) {
        extractedImages = data.photos.map((img: any) => 
          typeof img === 'string' ? { url: img, image: img } : img
        );
        console.log('Found images in data.photos:', extractedImages);
      } else if (data?.pictures && Array.isArray(data.pictures)) {
        extractedImages = data.pictures.map((img: any) => 
          typeof img === 'string' ? { url: img, image: img } : img
        );
        console.log('Found images in data.pictures:', extractedImages);
      } else if (data?.stories && Array.isArray(data.stories)) {
        extractedImages = data.stories.map((img: any) => 
          typeof img === 'string' ? { url: img, image: img } : img
        );
        console.log('Found images in data.stories:', extractedImages);
      }

      console.log('=== EXTRACTED IMAGES ===');
      console.log('Total images:', extractedImages.length);
      extractedImages.forEach((img, index) => {
        console.log(`Image ${index}:`, img);
      });
      console.log('========================');

      setImages(extractedImages);

      // Set the first image as banner image
      if (extractedImages.length > 0) {
        const firstImage = extractedImages[0];
        let bannerUrl: string | null = null;
        
        if (typeof firstImage === 'string') {
          bannerUrl = firstImage;
        } else if (firstImage && typeof firstImage === 'object') {
          bannerUrl = firstImage.url || firstImage.image || firstImage.photo || firstImage.picture || null;
        }
        
        if (bannerUrl) {
          setBannerImage(bannerUrl);
          console.log('=== BANNER IMAGE SET ===');
          console.log('Banner URL:', bannerUrl);
          console.log('========================');
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error in fetchProfileData:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        {/* Fixed Banner Background */}
        <ImageBackground
          source={
            bannerImage
              ? { uri: bannerImage }
              : require('../../assets/Homescreenbg.png')
          }
          style={styles.fixedBannerBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
            style={styles.bannerGradient}
          />
        </ImageBackground>

        {/* Header Over Banner - Fixed */}
        <View style={styles.headerOverBanner}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <TouchableOpacity style={styles.headerShareButton}>
              <Icon name="arrow-up" size={20} color="#FFFFFF" />
              <Text style={styles.headerShareText}>Share</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="create-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="settings-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Picture Section - Scrollable */}
          <View style={styles.profilePictureSection}>
            {/* Thumbnail with + icon and Name */}
            <View style={styles.profileInfoContainer}>
              <View style={styles.thumbnailContainer}>
                <Image
                  source={
                    profileData?.thumbnailPicture || profileData?.thumbnail_picture
                      ? { uri: profileData.thumbnailPicture || profileData.thumbnail_picture }
                      : require('../../assets/user.png')
                  }
                  style={styles.thumbnailPicture}
                  resizeMode="cover"
                />
                <View style={styles.plusIconContainer}>
                  <Image source={Plusicon} style={styles.plusIcon} />
                </View>
              </View>
              
              {/* Name and Verified Badge */}
              <View style={styles.nameVerifiedContainer}>
                <Text style={styles.profileName}>
                  {profileData?.name || profileData?.first_name || profileData?.full_name || 'TEJ'}
                </Text>
                {profileData?.is_verified && (
                  <Icon name="checkmark-circle" size={18} color="#1DA1F2" style={styles.verifiedIcon} />
                )}
              </View>
            </View>

            {/* Username and Followers on Same Line */}
            <View style={styles.usernameFollowersContainer}>
              <Text style={styles.usernameFollowersText}>
                {profileData?.username || profileData?.user_name || 'yours.tej7'} • {profileData?.followers_count || profileData?.followers || 444} followers
              </Text>
            </View>

            {/* Location */}
            {profileData?.location && (
              <View style={styles.locationContainer}>
                <Icon name="location-outline" size={16} color="#FFFFFF" style={styles.locationIcon} />
                <Text style={styles.locationText}>{profileData.location}</Text>
              </View>
            )}
            {profileData?.city && (
              <View style={styles.locationContainer}>
                <Icon name="location-outline" size={16} color="#FFFFFF" style={styles.locationIcon} />
                <Text style={styles.locationText}>{profileData.city}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.accountButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.accountButton,
                  accountType === 'My profile' && styles.accountButtonActive,
                ]}
                onPress={() => setAccountType('My profile')}
              >
                <Text
                  style={[
                    styles.accountButtonText,
                    accountType === 'My profile' && styles.accountButtonTextActive,
                  ]}
                >
                  My profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.accountButton,
                  accountType === 'Share profile' && styles.accountButtonActive,
                ]}
                onPress={() => setAccountType('Share profile')}
              >
                <Text
                  style={[
                    styles.accountButtonText,
                    accountType === 'Share profile' && styles.accountButtonTextActive,
                  ]}
                >
                  Share profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Location Bar */}
          {profileData?.location && (
            <View style={styles.locationBarContainer}>
              <Icon name="location-outline" size={18} color="#FFFFFF" />
              <Text style={styles.locationBarText}>{profileData.location}</Text>
            </View>
          )}

          {/* Personal Details */}
          {profileData?.personalDetails && (
            <View style={styles.personalDetailsContainer}>
              <Text style={styles.personalDetailsText}>{profileData.personalDetails}</Text>
              <View style={styles.purpleVIcon}>
                <Text style={styles.purpleVText}>V</Text>
              </View>
            </View>
          )}

          {/* Details Section - White background container */}
          <View style={styles.detailsContainer}>
            {/* My Bio Section */}
            {profileData?.bio && (
              <View style={styles.bioCard}>
                <Text style={styles.sectionTitle}>My bio</Text>
                <Text style={styles.bioText}>{profileData.bio}</Text>
              </View>
            )}

            {/* About me Section - Basic Info */}
            {(() => {
              const tags: React.ReactElement[] = [];
              
              // Height
              if (profileData?.height_cm && profileData.height_cm !== null) {
                tags.push(
                  <View key="height" style={styles.tag}>
                    <Icon name="resize-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.height_cm} cm</Text>
                  </View>
                );
              }
              
              // Gender
              if (profileData?.gender && profileData.gender.trim() !== '') {
                tags.push(
                  <View key="gender" style={styles.tag}>
                    <Icon name="person-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.gender}</Text>
                  </View>
                );
              }
              
              // Pronouns
              if (profileData?.pronouns && profileData.pronouns.trim() !== '') {
                tags.push(
                  <View key="pronouns" style={styles.tag}>
                    <Icon name="person-circle-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.pronouns}</Text>
                  </View>
                );
              }
              
              // Age
              if (profileData?.age && profileData.age > 0) {
                tags.push(
                  <View key="age" style={styles.tag}>
                    <Icon name="calendar-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.age}</Text>
                  </View>
                );
              }
              
              // Zodiac sign
              if (profileData?.zodiac_sign && profileData.zodiac_sign.trim() !== '') {
                tags.push(
                  <View key="zodiac" style={styles.tag}>
                    <Icon name="star-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.zodiac_sign}</Text>
                  </View>
                );
              }
              
              if (tags.length === 0) return null;
              
              return (
                <View style={styles.aboutCard}>
                  <Text style={styles.sectionTitle}>About me</Text>
                  <View style={styles.tagsContainer}>
                    {tags}
                  </View>
                </View>
              );
            })()}

            {/* Lifestyle Section */}
            {(() => {
              const tags: React.ReactElement[] = [];
              
              // Drinking
              if (profileData?.drinking && profileData.drinking.trim() !== '') {
                tags.push(
                  <View key="drinking" style={styles.tag}>
                    <Icon name="wine-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.drinking}</Text>
                  </View>
                );
              }
              
              // Smoking
              if (profileData?.smoking && profileData.smoking.trim() !== '') {
                tags.push(
                  <View key="smoking" style={styles.tag}>
                    <Icon name="create-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.smoking}</Text>
                  </View>
                );
              }
              
              if (tags.length === 0) return null;
              
              return (
                <View style={styles.aboutCard}>
                  <Text style={styles.sectionTitle}>Lifestyle</Text>
                  <View style={styles.tagsContainer}>
                    {tags}
                  </View>
                </View>
              );
            })()}

            {/* Images Gallery - 1 per row, full width */}
            <View style={styles.imagesContainer}>
              {images.length > 0 ? (
                images.map((imageItem, index) => {
                  // Extract image URL from various possible fields
                  let imageUrl: string | undefined;
                  
                  if (typeof imageItem === 'string') {
                    imageUrl = imageItem;
                  } else if (imageItem && typeof imageItem === 'object') {
                    imageUrl = imageItem.url || imageItem.image || imageItem.photo || imageItem.picture;
                  }
                  
                  return (
                    <View key={imageItem?.id || index} style={styles.imageItem}>
                      <Image
                        source={
                          imageUrl && typeof imageUrl === 'string'
                            ? { uri: imageUrl }
                            : require('../../assets/user.png')
                        }
                        style={styles.gridImage}
                        resizeMode="cover"
                      />
                    </View>
                  );
                })
              ) : (
                <View style={styles.noImagesContainer}>
                  <Text style={styles.noImagesText}>No images yet</Text>
                </View>
              )}
            </View>

            {/* Comment Button below Images */}
            {images.length > 0 && (
              <View style={styles.commentButtonContainer}>
                <TouchableOpacity style={styles.commentButton}>
                  <Icon name="chatbubble-ellipses-outline" size={18} color="#000000" />
                  <Text style={styles.commentButtonText}>Comment</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Education & Career Section */}
            {profileData?.currently && profileData.currently.trim() !== '' && (
              <View style={styles.aboutCard}>
                <Text style={styles.sectionTitle}>Education & Career</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tag}>
                    <Icon name="school-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.currently}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Interests Section */}
            {(() => {
              const tags: React.ReactElement[] = [];
              
              // Hobbies
              if (profileData?.hobbies && Array.isArray(profileData.hobbies) && profileData.hobbies.length > 0) {
                profileData.hobbies.forEach((hobby: string, idx: number) => {
                  if (hobby && hobby.trim() !== '') {
                    tags.push(
                      <View key={`hobby-${idx}`} style={styles.tag}>
                        <Text style={styles.tagText}>{hobby}</Text>
                      </View>
                    );
                  }
                });
              }
              
              // Activity Interests
              if (profileData?.activity_interests && Array.isArray(profileData.activity_interests) && profileData.activity_interests.length > 0) {
                profileData.activity_interests.forEach((interest: string, idx: number) => {
                  if (interest && interest.trim() !== '') {
                    tags.push(
                      <View key={`activity-${idx}`} style={styles.tag}>
                        <Text style={styles.tagText}>{interest}</Text>
                      </View>
                    );
                  }
                });
              }
              
              if (tags.length === 0) return null;
              
              return (
                <View style={styles.aboutCard}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  <View style={styles.tagsContainer}>
                    {tags}
                  </View>
                </View>
              );
            })()}

            {/* Values Section */}
            {(() => {
              const tags: React.ReactElement[] = [];
              
              // Religion
              if (profileData?.religion && profileData.religion.trim() !== '') {
                tags.push(
                  <View key="religion" style={styles.tag}>
                    <Icon name="happy-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.religion}</Text>
                  </View>
                );
              }
              
              // Causes & Communities
              if (profileData?.causes_communities && Array.isArray(profileData.causes_communities) && profileData.causes_communities.length > 0) {
                profileData.causes_communities.forEach((cause: string, idx: number) => {
                  if (cause && cause.trim() !== '') {
                    tags.push(
                      <View key={`cause-${idx}`} style={styles.tag}>
                        <Icon name="people-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                        <Text style={styles.tagText}>{cause}</Text>
                      </View>
                    );
                  }
                });
              }
              
              // Qualities
              if (profileData?.qualities && Array.isArray(profileData.qualities) && profileData.qualities.length > 0) {
                profileData.qualities.forEach((quality: string, idx: number) => {
                  if (quality && quality.trim() !== '') {
                    tags.push(
                      <View key={`quality-${idx}`} style={styles.tag}>
                        <Icon name="sparkles-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                        <Text style={styles.tagText}>{quality}</Text>
                      </View>
                    );
                  }
                });
              }
              
              if (tags.length === 0) return null;
              
              return (
                <View style={styles.aboutCard}>
                  <Text style={styles.sectionTitle}>Values</Text>
                  <View style={styles.tagsContainer}>
                    {tags}
                  </View>
                </View>
              );
            })()}

            {/* Looking for Section */}
            {profileData?.connection_goal && profileData.connection_goal.trim() !== '' && (
              <View style={styles.aboutCard}>
                <Text style={styles.sectionTitle}>Looking for</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tag}>
                    <Icon name="heart-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                    <Text style={styles.tagText}>{profileData.connection_goal}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Languages Section */}
            {profileData?.known_languages && Array.isArray(profileData.known_languages) && profileData.known_languages.length > 0 && (
              <View style={styles.aboutCard}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.tagsContainer}>
                  {profileData.known_languages.map((lang: string, idx: number) => {
                    if (lang && lang.trim() !== '') {
                      return (
                        <View key={`lang-${idx}`} style={styles.tag}>
                          <Icon name="language-outline" size={16} color="#000000" style={{ marginRight: wp(6) }} />
                          <Text style={styles.tagText}>{lang}</Text>
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;