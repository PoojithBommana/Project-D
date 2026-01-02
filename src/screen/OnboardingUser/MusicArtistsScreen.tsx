import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/MusicArtistsScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getApiCall } from '../../config/apiCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lightbulbicon } from '../../assets';

interface Props {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'MusicArtistsScreen'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username: string;
      gender: string;
      age: number;
      showOnlyFirstLetter: boolean;
    };
  };
}

interface Artist {
  id: string;
  name: string;
  image?: string;
  genres?: string[];
  // Keep raw backend fields if any extra come through
  [key: string]: any;
}

export default function MusicArtistsScreen({ navigation, route }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [displayedArtists, setDisplayedArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const [showSkipModal, setShowSkipModal] = useState(false);
  const skipModalScale = useRef(new Animated.Value(0)).current;
  const skipModalOpacity = useRef(new Animated.Value(0)).current;
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Fetch curated artists on mount
    fetchArtists();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim() === '') {
      // If search is empty, show curated list
      setDisplayedArtists(artists);
      return;
    }

    // Debounce search by 500ms
    searchTimeoutRef.current = setTimeout(() => {
      searchArtists(searchQuery.trim());
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const fetchArtists = async (query?: string) => {
    setLoadingArtists(true);
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        setLoadingArtists(false);
        return;
      }

      const params = query ? { query } : {};
      const response = await getApiCall('ONBOARDING', 'MUSIC_SEARCH', accessToken, params);

      // Console the raw MUSIC_SEARCH response from backend for debugging
      console.log(
        '[MusicArtistsScreen] MUSIC_SEARCH raw response:',
        JSON.stringify(response?.response, null, 2),
      );

      if (response?.error) {
        console.error('Error fetching artists:', response.response);
        setLoadingArtists(false);
        return;
      }

      if (response?.response?.artists) {
        // Use the artists array from backend as‑is (no filtering/mapping)
        const artistsData: Artist[] = response.response.artists;
        if (query) {
          // Search results - replace displayed artists
          setDisplayedArtists(artistsData);
        } else {
          // Curated list - set both artists and displayed
          setArtists(artistsData);
          setDisplayedArtists(artistsData);
        }
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoadingArtists(false);
    }
  };

  const searchArtists = useCallback((query: string) => {
    fetchArtists(query);
  }, []);

  const handleShuffle = () => {
    if (artists.length === 0) return;
    
    // Create a shuffled copy of the artists
    const shuffled = [...artists].sort(() => Math.random() - 0.5);
    setDisplayedArtists(shuffled);
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  };

  const handleAddArtist = (artist: Artist) => {
    if (selectedArtists.length < 4 && !selectedArtists.find(a => a.id === artist.id)) {
      setSelectedArtists([...selectedArtists, artist]);
    }
  };

  const handleAddArtistFromList = (artistItem: Artist) => {
    handleAddArtist(artistItem);
  };

  const handleRemoveArtist = (artistId: string) => {
    setSelectedArtists(selectedArtists.filter(a => a.id !== artistId));
  };

  const navigateToNextStep = async () => {
    // Extract artist IDs from selected artists
    const musicArtistIds = selectedArtists.map(artist => artist.id);
    // Extract genres from selected artists (flatten and dedupe)
    const musicGenres = Array.from(
      new Set(selectedArtists.flatMap(artist => artist.genres || []))
    );

    try {
      // Persist selections so they are available at final onboarding step
      await AsyncStorage.setItem(
        'onboarding_music_artist_ids',
        JSON.stringify(musicArtistIds),
      );
      await AsyncStorage.setItem(
        'onboarding_music_genres',
        JSON.stringify(musicGenres),
      );
    } catch (e) {
      console.warn('[MusicArtistsScreen] Failed to persist music selections:', e);
    }

    navigation?.navigate('HeightScreen', {
      firstName: route?.params?.firstName || '',
      lastName: route?.params?.lastName || '',
      username: route?.params?.username || '',
      gender: route?.params?.gender || '',
      age: route?.params?.age || 0,
      showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      currently: (route?.params as any)?.currently || '',
      music_artist_ids: musicArtistIds,
      music_genres: musicGenres,
    });
  };

  const handleContinue = () => {
    animateButtonPress();
    setTimeout(() => {
      navigateToNextStep();
    }, 150);
  };

  const openSkipModal = () => {
    setShowSkipModal(true);
    skipModalScale.setValue(0.9);
    skipModalOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(skipModalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(skipModalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSkipModal = (callback?: () => void) => {
    Animated.parallel([
      Animated.spring(skipModalScale, {
        toValue: 0.9,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(skipModalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSkipModal(false);
      if (callback) {
        callback();
      }
    });
  };

  const handleSkipNo = () => {
    closeSkipModal();
  };

  const handleSkipYes = () => {
    closeSkipModal(() => {
      // Skip with empty arrays
      setSelectedArtists([]);
      animateButtonPress();
      setTimeout(() => {
        navigateToNextStep();
      }, 150);
    });
  };

  const progress = 70; // Progress percentage

  const renderPlaceholderSlot = (index: number) => {
    const artist = selectedArtists[index];
    const imageUrl = artist?.image;
    
    return (
      <View key={index} style={styles.placeholderSlot}>
        {artist ? (
          <View style={styles.selectedArtistSlot}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveArtist(artist.id)}
            >
              <Icon name="close" size={rs(16)} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.artistImageContainer}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.artistImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.artistImagePlaceholder, { borderRadius: rs(8) }]}>
                  <Text style={styles.artistInitial}>{artist.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.artistNameSmall} numberOfLines={1}>
              {artist.name}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.addIconContainer}>
              <Icon name="add" size={rs(32)} color="#B0B0B0" />
            </View>
          </>
        )}
      </View>
    );
  };

  const renderPopularArtist = ({ item }: { item: Artist }) => {
    const isSelected = selectedArtists.some(a => a.id === item.id);
    const artistImage = item.image;
    
    return (
      <TouchableOpacity
        style={styles.popularArtistCard}
        onPress={() => isSelected ? handleRemoveArtist(item.id) : handleAddArtistFromList(item)}
        activeOpacity={0.7}
      >
        <View style={styles.popularArtistImageContainer}>
          {artistImage ? (
            <Image
              source={{ uri: artistImage }}
              style={styles.popularArtistImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.popularArtistImagePlaceholder, { borderRadius: rs(12) }]}>
              <Text style={styles.popularArtistInitial}>{item.name.charAt(0)}</Text>
            </View>
          )}
          {!isSelected && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddArtistFromList(item)}
            >
              <Icon name="add" size={rs(16)} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          {isSelected && (
            <TouchableOpacity
              style={styles.removeButtonPopular}
              onPress={() => handleRemoveArtist(item.id)}
            >
              <Icon name="close" size={rs(16)} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.popularArtistName} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header row with progress and skip */}
            <View style={styles.topBarContainer}>
              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
              </View>
              <TouchableOpacity
                onPress={openSkipModal}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </View>

            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>Add your favourite music artists</Text>
              <Text style={styles.subheading}>
                {selectedArtists.length} of 4 added to your profile
              </Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Icon name="search" size={rs(20)} color="#999999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search & add artists / band"
                  placeholderTextColor="#999999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Placeholder Slots */}
            <View style={styles.slotsContainer}>
              {[0, 1, 2, 3].map((index) => renderPlaceholderSlot(index))}
            </View>

            {/* Separator */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>or</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Popular Artists Section */}
            <View style={styles.popularSection}>
              <View style={styles.popularSectionHeader}>
                <View style={styles.popularSectionTitleContainer}>
                  <Text style={styles.popularSectionTitle}>Popular on Snixx</Text>
                </View>
                <TouchableOpacity 
                  style={styles.shuffleButton}
                  onPress={handleShuffle}
                  disabled={artists.length === 0 || searchQuery.trim() !== ''}
                  activeOpacity={0.7}
                >
                  <Icon name="shuffle" size={rs(20)} color={artists.length === 0 || searchQuery.trim() !== '' ? "#CCCCCC" : "#666666"} />
                </TouchableOpacity>
              </View>

              {loadingArtists ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FDDA0D" />
                </View>
              ) : displayedArtists.length > 0 ? (
                <FlatList
                  data={displayedArtists}
                  renderItem={renderPopularArtist}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.popularArtistsList}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No artists found' : 'No artists available'}
                  </Text>
                </View>
              )}
            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <Animated.View
                style={{
                  transform: [{ scale: buttonScale }],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                  ]}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.continueButtonText,
                    ]}
                  >
                    Continue
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

          </Animated.View>
        </ScrollView>
        {/* Themed Skip Confirmation Modal */}
        <Modal
          visible={showSkipModal}
          transparent
          animationType="none"
          onRequestClose={handleSkipNo}
        >
          <Animated.View
            style={[
              styles.modalOverlay,
              {
                opacity: skipModalOpacity,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: skipModalScale }],
                },
              ]}
            >
              <View style={styles.modalIconContainer}>
                <Icon name="music-note" size={rs(48)} color="#FDDA0D" />
              </View>

              <Text style={styles.modalTitle}>
                Skip music preferences?
              </Text>

              <Text style={styles.modalSubtext}>
                You can always confirm and update your profile matching preferences later.
              </Text>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonNo]}
                  onPress={handleSkipNo}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonYes]}
                  onPress={handleSkipYes}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextYes]}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

