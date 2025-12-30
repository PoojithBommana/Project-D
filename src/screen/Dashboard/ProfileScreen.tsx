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

interface MusicArtist {
  id: string;
  name: string;
  image?: string;
  genres?: string[];
  popularity?: number | null;
}

interface ProfileData {
  id?: string | number;
  uid?: string;
  email?: string;
  phone?: string | null;
  name?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  user_name?: string;
  followers?: number;
  followers_count?: number;
  location?: string;
  personalDetails?: string;
  profilePicture?: string;
  profile_picture?: string;
  profile_photo?: string;
  thumbnailPicture?: string;
  thumbnail_picture?: string;
  images?: ImageItem[];
  photos?: ImageItem[];
  pictures?: ImageItem[];
  stories?: ImageItem[];
  is_verified?: boolean;
  gender?: string;
  birthday?: string;
  age?: number;
  height_cm?: number;
  currently?: string;
  drinking?: string;
  smoking?: string;
  bio?: string;
  qualities?: string[];
  activity_interests?: string[];
  causes_communities?: string[];
  religion?: string;
  zodiac_sign?: string;
  city?: string;
  music_artist_ids?: string[];
  music_genres?: string[];
  music_artists?: MusicArtist[];
  [key: string]: any;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState<'Edit Profile' | 'Share Profile'>('Edit Profile');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async (userId?: number) => {
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

      const params = userId ? { user_id: userId } : undefined;
      const response = await getApiCall('AUTH', 'GET_PROFILE', token, params);

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
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.shareButton}>
              <Icon name="arrow-up" size={18} color="#FFFFFF" />
              <Text style={styles.headerShareText}>Share</Text>
            </TouchableOpacity>
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
                    profileData?.profile_photo || profileData?.profilePicture || profileData?.profile_picture
                      ? { uri: profileData.profile_photo || profileData.profilePicture || profileData.profile_picture }
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

            {/* Username */}
            <View style={styles.usernameFollowersContainer}>
              <Text style={styles.usernameFollowersText}>
                {profileData?.username || profileData?.user_name || 'yours.tej7'}
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
                  selectedButton === 'Edit Profile' && styles.accountButtonActive,
                ]}
                onPress={() => setSelectedButton('Edit Profile')}
              >
                <Text
                  style={[
                    styles.accountButtonText,
                    selectedButton === 'Edit Profile' && styles.accountButtonTextActive,
                  ]}
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.accountButton,
                  selectedButton === 'Share Profile' && styles.accountButtonActive,
                ]}
                onPress={() => setSelectedButton('Share Profile')}
              >
                <Text
                  style={[
                    styles.accountButtonText,
                    selectedButton === 'Share Profile' && styles.accountButtonTextActive,
                  ]}
                >
                  Share Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Personal Details */}
          {profileData?.personalDetails && (
            <View style={styles.personalDetailsContainer}>
              <Text style={styles.personalDetailsText}>{profileData.personalDetails}</Text>
              <View style={styles.purpleVIcon}>
                <Text style={styles.purpleVText}>V</Text>
              </View>
            </View>
          )}

          {/* Images Grid - 2x2 Layout */}
          <View style={styles.imagesGridContainer}>
            {images.length > 0 ? (
              images.slice(0, 4).map((imageItem, index) => {
                // Extract image URL from various possible fields
                let imageUrl: string | undefined;
                
                if (typeof imageItem === 'string') {
                  imageUrl = imageItem;
                } else if (imageItem && typeof imageItem === 'object') {
                  imageUrl = imageItem.url || imageItem.image || imageItem.photo || imageItem.picture;
                }
                
                return (
                  <View key={imageItem?.id || index} style={styles.imageGridItem}>
                    <Image
                      source={
                        imageUrl && typeof imageUrl === 'string'
                          ? { uri: imageUrl }
                          : require('../../assets/user.png')
                      }
                      style={styles.imageGridImage}
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

          {/* Detailed Profile Data Section */}
          <View style={styles.detailSection}>
            {/* About me Card */}
            <View style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>About me</Text>
              <View style={styles.tagsContainer}>
                {profileData?.email && (
                  <View style={styles.pillTag}>
                    <Icon name="mail-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.email}</Text>
                  </View>
                )}
                {profileData?.username && (
                  <View style={styles.pillTag}>
                    <Icon name="person-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.username}</Text>
                  </View>
                )}
                {profileData?.city && (
                  <View style={styles.pillTag}>
                    <Icon name="location-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.city}</Text>
                  </View>
                )}
                {profileData?.gender && (
                  <View style={styles.pillTag}>
                    <Icon name="person-circle-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.gender}</Text>
                  </View>
                )}
                {profileData?.age && (
                  <View style={styles.pillTag}>
                    <Icon name="calendar-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.age} years</Text>
                  </View>
                )}
                {profileData?.height_cm && (
                  <View style={styles.pillTag}>
                    <Icon name="resize-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.height_cm} cm</Text>
                  </View>
                )}
                {profileData?.birthday && (
                  <View style={styles.pillTag}>
                    <Icon name="gift-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.birthday}</Text>
                  </View>
                )}
                {profileData?.drinking && (
                  <View style={styles.pillTag}>
                    <Icon name="wine-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.drinking}</Text>
                  </View>
                )}
                {profileData?.smoking && (
                  <View style={styles.pillTag}>
                    <Icon name="flame-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.smoking}</Text>
                  </View>
                )}
                {profileData?.currently && (
                  <View style={styles.pillTag}>
                    <Icon name="briefcase-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.currently}</Text>
                  </View>
                )}
                {profileData?.religion && (
                  <View style={styles.pillTag}>
                    <Icon name="happy-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.religion}</Text>
                  </View>
                )}
                {profileData?.zodiac_sign && (
                  <View style={styles.pillTag}>
                    <Icon name="star-outline" size={16} color="#000000" style={styles.tagIcon} />
                    <Text style={styles.pillTagText}>{profileData.zodiac_sign}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* About Section */}
            {profileData?.bio && (
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>About</Text>
                <Text style={styles.detailBioText}>{profileData.bio}</Text>
              </View>
            )}

            {/* I'm looking for Card */}
            {profileData?.qualities && Array.isArray(profileData.qualities) && profileData.qualities.length > 0 && (
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>I'm looking for</Text>
                <View style={styles.tagsContainer}>
                  {profileData.qualities.map((quality, index) => (
                    <View key={index} style={styles.pillTag}>
                      <Icon name="search-outline" size={16} color="#000000" style={styles.tagIcon} />
                      <Text style={styles.pillTagText}>{quality}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* My interests Card */}
            {profileData?.activity_interests && Array.isArray(profileData.activity_interests) && profileData.activity_interests.length > 0 && (
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>My interests</Text>
                <View style={styles.tagsContainer}>
                  {profileData.activity_interests.map((interest, index) => (
                    <View key={index} style={styles.pillTag}>
                      <Icon name="heart-outline" size={16} color="#000000" style={styles.tagIcon} />
                      <Text style={styles.pillTagText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Causes & Communities Card */}
            {profileData?.causes_communities && Array.isArray(profileData.causes_communities) && profileData.causes_communities.length > 0 && (
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>Causes & Communities</Text>
                <View style={styles.tagsContainer}>
                  {profileData.causes_communities.map((cause, index) => (
                    <View key={index} style={styles.pillTag}>
                      <Icon name="people-outline" size={16} color="#000000" style={styles.tagIcon} />
                      <Text style={styles.pillTagText}>{cause}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Music Card */}
            {(profileData?.music_artists && Array.isArray(profileData.music_artists) && profileData.music_artists.length > 0) ||
             (profileData?.music_genres && Array.isArray(profileData.music_genres) && profileData.music_genres.length > 0) ? (
              <View style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>Music</Text>
                
                {/* Music Artists */}
                {profileData?.music_artists && Array.isArray(profileData.music_artists) && profileData.music_artists.length > 0 && (
                  <View style={styles.musicArtistsContainer}>
                    {profileData.music_artists.map((artist, index) => (
                      <View key={artist.id || index} style={styles.musicArtistItem}>
                        {artist.image ? (
                          <Image
                            source={{ uri: artist.image }}
                            style={styles.musicArtistImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.musicArtistImagePlaceholder}>
                            <Icon name="musical-notes-outline" size={20} color="#999999" />
                          </View>
                        )}
                        <Text style={styles.musicArtistName} numberOfLines={1}>
                          {artist.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Music Genres */}
                {profileData?.music_genres && Array.isArray(profileData.music_genres) && profileData.music_genres.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {profileData.music_genres.map((genre, index) => (
                      <View key={index} style={styles.pillTag}>
                        <Icon name="musical-notes-outline" size={16} color="#000000" style={styles.tagIcon} />
                        <Text style={styles.pillTagText}>{genre}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
     
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;