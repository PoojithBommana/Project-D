import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Backicon, Plusicon } from '../../assets';
import styles from '../../styles/ProfileScreenStyles';

interface StoryItem {
  id: string;
  title: string;
  emoji: string;
  image: any; // Placeholder for image
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'Stories' | 'Spotlight' | 'Insights'>('Stories');
  const [accountType, setAccountType] = useState<'My account' | 'Public Profile'>('My account');

  // Mock data for stories
  const stories: StoryItem[] = [
    { id: '1', title: 'ISCON', emoji: '🛕', image: null },
    { id: '2', title: 'DINDI DAM', emoji: '🌊', image: null },
    { id: '3', title: 'SRISAILAM', emoji: '⛰️', image: null },
    { id: '4', title: 'THOUSAND PILLAR', emoji: '', image: null },
    { id: '5', title: 'WARANGAL FORT', emoji: '', image: null },
    { id: '6', title: 'ANANTHAGIRI', emoji: '', image: null },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="share-outline" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="create-outline" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="settings-outline" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <View style={styles.profilePictureContainer}>
              {/* Main Profile Picture */}
            </View>

            {/* Name with Verified Checkmark and Thumbnail */}
            <View style={styles.nameContainer}>
              {/* Thumbnail with + icon */}
              <View style={styles.thumbnailContainer}>
                <Image
                  source={require('../../assets/user.png')}
                  style={styles.thumbnailPicture}
                  resizeMode="cover"
                />
                <View style={styles.plusIconContainer}>
                  <Image source={Plusicon} style={styles.plusIcon} />
                </View>
              </View>
              <Text style={styles.profileName}>TEJ</Text>
              <Icon name="checkmark-circle" size={20} color="#1DA1F2" style={styles.verifiedIcon} />
            </View>

            {/* Username and Followers */}
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>yours.tej7</Text>
              <Text style={styles.followersText}>444 followers</Text>
            </View>

            {/* Account Type Buttons */}
            <View style={styles.accountButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.accountButton,
                  accountType === 'My account' && styles.accountButtonActive,
                ]}
                onPress={() => setAccountType('My account')}
              >
                <Text
                  style={[
                    styles.accountButtonText,
                    accountType === 'My account' && styles.accountButtonTextActive,
                  ]}
                >
                  My account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.accountButton,
                  accountType === 'Public Profile' && styles.accountButtonActive,
                ]}
                onPress={() => setAccountType('Public Profile')}
              >
                <Text
                  style={[
                    styles.accountButtonText,
                    accountType === 'Public Profile' && styles.accountButtonTextActive,
                  ]}
                >
                  Public Profile
                </Text>
              </TouchableOpacity>
            </View>

            {/* Location */}
            <View style={styles.locationContainer}>
              <Icon name="location-outline" size={16} color="#666666" />
              <Text style={styles.locationText}>Hyderabad, Gachibowli, India</Text>
            </View>

            {/* Personal Details */}
            <View style={styles.personalDetailsContainer}>
              <Text style={styles.personalDetailsText}>• 28-04 |5'10 |Aries</Text>
              <View style={styles.purpleVIcon}>
                <Text style={styles.purpleVText}>V</Text>
              </View>
            </View>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.navTabsContainer}>
            <TouchableOpacity
              style={[styles.navTab, activeTab === 'Stories' && styles.navTabActive]}
              onPress={() => setActiveTab('Stories')}
            >
              <Text
                style={[styles.navTabText, activeTab === 'Stories' && styles.navTabTextActive]}
              >
                Stories
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navTab, activeTab === 'Spotlight' && styles.navTabActive]}
              onPress={() => setActiveTab('Spotlight')}
            >
              <Text
                style={[styles.navTabText, activeTab === 'Spotlight' && styles.navTabTextActive]}
              >
                Spotlight
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navTab, activeTab === 'Insights' && styles.navTabActive]}
              onPress={() => setActiveTab('Insights')}
            >
              <Text
                style={[styles.navTabText, activeTab === 'Insights' && styles.navTabTextActive]}
              >
                Insights
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stories Grid */}
          <View style={styles.storiesGridContainer}>
            {stories.map((story, index) => (
              <View key={story.id} style={styles.storyItem}>
                <View style={styles.storyImageContainer}>
                  <Image
                    source={require('../../assets/user.png')}
                    style={styles.storyImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.storyTitleContainer}>
                  <Text style={styles.storyTitle}>
                    {story.title} {story.emoji}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.floatingButton}>
          <Icon name="layers-outline" size={20} color="#FFFFFF" style={styles.floatingButtonIcon} />
          <Text style={styles.floatingButtonText}>New profile Story</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
