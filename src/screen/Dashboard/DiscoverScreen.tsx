import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DiscoverStackParamList } from '../../navigation/DiscoverStackNavigator';
import { DiscoverProfile } from '../../types/Discover';
import discoverService from '../../services/DiscoverService';
import styles from '../../styles/DiscoverScreenStyles';

// Section Components
import SmartSearchBar from './Discover/components/SmartSearchBar';
// import DiscoveryPromptBanner from './Discover/components/DiscoveryPromptBanner'; // Optional banner
import TopSnixxedSection from './Discover/components/TopSnixxedSection';
import AIPicksSection from './Discover/components/AIPicksSection';
import VibeDiscoverySection from './Discover/components/VibeDiscoverySection';
import NearbyActiveSection from './Discover/components/NearbyActiveSection';
import StyleMatchesSection from './Discover/components/StyleMatchesSection';
import ConversationStartersSection from './Discover/components/ConversationStartersSection';
import MoodDiscoverySection from './Discover/components/MoodDiscoverySection';
import NewOnSnixxSection from './Discover/components/NewOnSnixxSection';

interface DiscoverScreenProps {
  navigation?: NativeStackNavigationProp<DiscoverStackParamList, 'DiscoverScreen'>;
}

export default function DiscoverScreen({ navigation }: DiscoverScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Data states
  const [topSnixxed, setTopSnixxed] = useState<DiscoverProfile[]>([]);
  const [aiPicks, setAiPicks] = useState<DiscoverProfile[]>([]);
  const [nearbyActive, setNearbyActive] = useState<DiscoverProfile[]>([]);
  const [styleMatches, setStyleMatches] = useState<DiscoverProfile[]>([]);
  const [newUsers, setNewUsers] = useState<DiscoverProfile[]>([]);

  // Loading states
  const [loadingTopSnixxed, setLoadingTopSnixxed] = useState(true);
  const [loadingAIPicks, setLoadingAIPicks] = useState(true);
  const [loadingNearby, setLoadingNearby] = useState(true);
  const [loadingStyleMatches, setLoadingStyleMatches] = useState(true);
  const [loadingNewUsers, setLoadingNewUsers] = useState(true);

  const loadAllData = useCallback(async () => {
    try {
      // Load all sections in parallel
      const [
        topSnixxedData,
        aiPicksData,
        nearbyData,
        styleMatchesData,
        newUsersData,
      ] = await Promise.all([
        discoverService.getTopSnixxedProfiles().then(data => {
          setTopSnixxed(data);
          setLoadingTopSnixxed(false);
          return data;
        }),
        discoverService.getAIPicks().then(data => {
          setAiPicks(data);
          setLoadingAIPicks(false);
          return data;
        }),
        discoverService.getNearbyActive().then(data => {
          setNearbyActive(data);
          setLoadingNearby(false);
          return data;
        }),
        discoverService.getStyleMatches().then(data => {
          setStyleMatches(data);
          setLoadingStyleMatches(false);
          return data;
        }),
        discoverService.getNewUsers().then(data => {
          setNewUsers(data);
          setLoadingNewUsers(false);
          return data;
        }),
      ]);
    } catch (error) {
      console.error('Error loading discover data:', error);
      // Set loading to false even on error
      setLoadingTopSnixxed(false);
      setLoadingAIPicks(false);
      setLoadingNearby(false);
      setLoadingStyleMatches(false);
      setLoadingNewUsers(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Reset loading states
    setLoadingTopSnixxed(true);
    setLoadingAIPicks(true);
    setLoadingNearby(true);
    setLoadingStyleMatches(true);
    setLoadingNewUsers(true);
    
    await loadAllData();
    setRefreshing(false);
  }, [loadAllData]);

  const handleProfilePress = useCallback((profile: DiscoverProfile, context?: any) => {
    navigation?.navigate('DiscoverProfileDetailsScreen', {
      profile,
      context,
    });
  }, [navigation]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // In future, could filter sections based on search
  }, []);

  const handleMoodChange = useCallback((moodId: string | null) => {
    setSelectedMood(moodId);
    // In future, could filter sections based on mood
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SmartSearchBar
            onSearch={handleSearch}
            placeholder="Search people, vibes, or interests"
          />
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FDFF8D"
            />
          }
        >
          {/* Optional Discovery Prompt Banner - Commented out by default */}
          {/* <DiscoveryPromptBanner
            onActionPress={(action) => {
              // Handle quick actions
              console.log('Quick action:', action);
            }}
          /> */}

          {/* Section 1: Top Snixxed Near You */}
          <TopSnixxedSection
            profiles={topSnixxed}
            loading={loadingTopSnixxed}
            onProfilePress={(profile) =>
              handleProfilePress(profile, { source: 'top_snixxed' })
            }
          />

          {/* Section 2: AI Picks for You */}
          <AIPicksSection
            profiles={aiPicks}
            loading={loadingAIPicks}
            onProfilePress={(profile) =>
              handleProfilePress(profile, { source: 'ai_picks' })
            }
          />

          {/* Section 3: Discover by Vibe */}
          <VibeDiscoverySection
            onVibePress={(vibeId) => {
              // Navigate to vibe-filtered profiles
              console.log('Vibe selected:', vibeId);
            }}
          />

          {/* Section 4: Nearby & Active */}
          <NearbyActiveSection
            profiles={nearbyActive}
            loading={loadingNearby}
            onProfilePress={(profile) =>
              handleProfilePress(profile, { source: 'nearby' })
            }
          />

          {/* Section 5: Style Matches */}
          <StyleMatchesSection
            profiles={styleMatches}
            loading={loadingStyleMatches}
            onProfilePress={(profile) =>
              handleProfilePress(profile, { source: 'style_match' })
            }
          />

          {/* Section 6: Break the Ice */}
          <ConversationStartersSection
            onStarterPress={(starterId) => {
              // Show profiles who answered
              console.log('Conversation starter:', starterId);
            }}
          />

          {/* Section 7: Mood Discovery */}
          <MoodDiscoverySection
            selectedMood={selectedMood}
            onMoodChange={handleMoodChange}
          />

          {/* Section 8: New on Snixx */}
          <NewOnSnixxSection
            profiles={newUsers}
            loading={loadingNewUsers}
            onProfilePress={(profile) =>
              handleProfilePress(profile, { source: 'new_users' })
            }
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
