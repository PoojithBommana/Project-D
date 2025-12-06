import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/MusicArtistsScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { musicService, Playlist } from '../../services/MusicService';
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
  imageUrl?: string;
}

export default function MusicArtistsScreen({ navigation, route }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [displayedPlaylists, setDisplayedPlaylists] = useState<any[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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
    
    // Fetch featured playlists
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    // setLoadingPlaylists(true);
    // try {
    //   const response = await musicService.fetchFeaturedPlaylists();
    //   console.log('=== Featured Playlists API Response ===');
    //   console.log(JSON.stringify(response, null, 2));
    //   console.log('=======================================');
      
    //   if (response.success && response.playlists) {
    //     setPlaylists(response.playlists);
    //     setDisplayedPlaylists(response.playlists);
    //   } else {
    //     console.error('Failed to fetch playlists:', response.error);
    //   }
    // } catch (error) {
    //   console.error('Error fetching playlists:', error);
    // } finally {
    //   setLoadingPlaylists(false);
    // }
  };

  const handleShuffle = () => {
    if (playlists.length === 0) return;
    
    // Create a shuffled copy of the playlists
    const shuffled = [...playlists].sort(() => Math.random() - 0.5);
    setDisplayedPlaylists(shuffled);
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

  const handleAddPlaylist = (playlist:any) => {
    // Convert playlist to artist format for selection
    const artist: Artist = {
      id: playlist.id,
      name: playlist.name,
      imageUrl: playlist.images && playlist.images.length > 0 ? playlist.images[0].url : undefined,
    };
    handleAddArtist(artist);
  };

  const handleRemoveArtist = (artistId: string) => {
    setSelectedArtists(selectedArtists.filter(a => a.id !== artistId));
  };

  const handleContinue = () => {
    animateButtonPress();
    setTimeout(() => {
      navigation?.navigate('OnboardingStep3', {
        firstName: route?.params?.firstName || '',
        lastName: route?.params?.lastName || '',
        username: route?.params?.username || '',
        gender: route?.params?.gender || '',
        age: route?.params?.age || 0,
        showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      });
    }, 150);
  };

  const progress = 70; // Progress percentage

  const renderPlaceholderSlot = (index: number) => {
    const artist = selectedArtists[index];
    const imageUrl = artist?.imageUrl || artist?.image;
    
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
                <View style={styles.artistImagePlaceholder}>
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

  const renderPopularPlaylist = ({ item }: { item: any }) => {
    const isSelected = selectedArtists.some(a => a.id === item.id);
    const playlistImage = item.images && item.images.length > 0 ? item.images[0].url : null;
    
    return (
      <TouchableOpacity
        style={styles.popularArtistCard}
        onPress={() => isSelected ? handleRemoveArtist(item.id) : handleAddPlaylist(item)}
        activeOpacity={0.7}
      >
        <View style={styles.popularArtistImageContainer}>
          {playlistImage ? (
            <Image
              source={{ uri: playlistImage }}
              style={styles.popularArtistImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.popularArtistImagePlaceholder}>
              <Text style={styles.popularArtistInitial}>{item.name.charAt(0)}</Text>
            </View>
          )}
          {!isSelected && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddPlaylist(item)}
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
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

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
                  <Text style={styles.popularSectionTitle}>Popular on DilMill</Text>
                </View>
                <TouchableOpacity 
                  style={styles.shuffleButton}
                  onPress={handleShuffle}
                  disabled={displayedPlaylists.length === 0}
                  activeOpacity={0.7}
                >
                  <Icon name="shuffle" size={rs(20)} color={displayedPlaylists.length === 0 ? "#CCCCCC" : "#666666"} />
                </TouchableOpacity>
              </View>

              {loadingPlaylists ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#4A90E2" />
                </View>
              ) : displayedPlaylists.length > 0 ? (
                <FlatList
                  data={displayedPlaylists}
                  renderItem={renderPopularPlaylist}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.popularArtistsList}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No playlists available</Text>
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
                  style={styles.continueButtonActive}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <Text style={styles.continueButtonTextActive}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

