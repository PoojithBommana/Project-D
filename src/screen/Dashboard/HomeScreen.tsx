import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar, Alert, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileCard from '../../components/ProfileCard';
import { Profile, SwipeAction } from '../../types/Profile';
import { profileService } from '../../services/ProfileService';
import { Usericon, Discovericon, Likedicon, Chatsicon } from '../../assets/index';
import styles from '../../styles/HomeScreenStyles';

interface State {
  profiles: Profile[];
  currentIndex: number;
  swipeActions: SwipeAction[];
  loading: boolean;
  loadingMore: boolean;
  activeTab: 'profile' | 'discover' | 'people' | 'liked' | 'chats';
}

export default class HomeScreen extends Component<{}, State> {
  private swiperRef: Swiper<Profile> | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      profiles: this.getMockProfiles(),
      currentIndex: 0,
      swipeActions: [],
      loading: false,
      loadingMore: false,
      activeTab: 'people',
    };
  }

  componentDidMount() {
    this.loadProfiles();
  }

  loadProfiles = async () => {
    this.setState({ loading: true });

    try {
      const response = await profileService.fetchProfiles(1, 10);

      if (response.success && response.profiles && response.profiles.length > 0) {
        this.setState({ profiles: response.profiles });
      } else {
        console.warn('API failed or returned empty, using mock data:', response.error);
        this.setState({ profiles: this.getMockProfiles() });
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      this.setState({ profiles: this.getMockProfiles() });
    } finally {
      this.setState({ loading: false });
    }
  };

  getMockProfiles = (): Profile[] => {
    return [
        {
          id: '1',
          name: 'Sarah Johnson',
          age: 22,
          images: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
          ],
          location: 'Mumbai',
          distance: 5,
          verified: true,
          job: 'Consultancy at Sunshine',
          education: 'iiit',
          isNew: true,
        },
        {
          id: '2',
          name: 'Priya Sharma',
          age: 25,
          images: [
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
          ],
          location: 'Delhi',
          distance: 12,
          verified: false,
          job: 'Software Engineer at Tech Corp',
          education: 'IIT Delhi 2021',
        },
        {
          id: '3',
          name: 'Ananya Patel',
          age: 24,
          images: [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
          ],
          location: 'Bangalore',
          distance: 8,
          verified: true,
          job: 'Designer at Creative Studio',
          education: 'NID 2022',
          isNew: true,
        },
        {
          id: '4',
          name: 'Meera Singh',
          age: 23,
          images: [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          ],
          location: 'Pune',
          distance: 15,
          verified: false,
          job: 'Marketing Manager',
          education: 'Symbiosis 2023',
        },
        {
          id: '5',
          name: 'Kavya Reddy',
          age: 26,
          images: [
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
          ],
          location: 'Hyderabad',
          distance: 20,
          verified: true,
          job: 'Doctor at City Hospital',
          education: 'AIIMS 2020',
        },
    ];
  };

  /**
   * Handles card swipe action with API call
   */
  handleSwipe = async (cardIndex: number, direction: 'left' | 'right') => {
    const { profiles } = this.state;
    const swipedProfile = profiles[cardIndex];

    if (!swipedProfile) return;

    const action: SwipeAction = {
      type: direction === 'right' ? 'like' : 'pass',
      profileId: swipedProfile.id,
      timestamp: Date.now(),
    };

    const newIndex = cardIndex + 1;

    // Update state immediately for smooth UX
    this.setState((prevState) => ({
      swipeActions: [...prevState.swipeActions, action],
      currentIndex: newIndex,
    }));

    // Send swipe action to backend API (fire and forget for better UX)
    try {
      const response = await profileService.submitSwipeAction(action);
      if (response.success && response.isMatch) {
        // Handle match scenario
        Alert.alert('It\'s a Match!', 'You and this person liked each other!');
      }
    } catch (error) {
      // Log error but don't block user experience
      console.error('Error submitting swipe action:', error);
    }

    // Check if all cards are swiped
    if (newIndex >= profiles.length) {
      setTimeout(() => this.handleAllCardsSwiped(), 500);
    }
  };

  /**
   * Handles manual action button press with API call
   */
  handleActionPress = async (action: 'like' | 'pass' | 'superlike') => {
    const { currentIndex, profiles } = this.state;

    if (currentIndex >= profiles.length) {
      return;
    }

    const profile = profiles[currentIndex];
    if (!profile) return;

    const swipeAction: SwipeAction = {
      type: action,
      profileId: profile.id,
      timestamp: Date.now(),
    };

    // Update state immediately for smooth UX
    this.setState((prevState) => ({
      swipeActions: [...prevState.swipeActions, swipeAction],
      currentIndex: prevState.currentIndex + 1,
    }));

    // Perform swipe animation based on action
    if (action === 'like' || action === 'superlike') {
      this.swiperRef?.swipeRight();
    } else if (action === 'pass') {
      this.swiperRef?.swipeLeft();
    }

    // Send action to backend API (fire and forget for better UX)
    try {
      const response = await profileService.submitSwipeAction(swipeAction);
      if (response.success && response.isMatch) {
        // Handle match scenario
        Alert.alert('It\'s a Match!', 'You and this person liked each other!');
      }
    } catch (error) {
      // Log error but don't block user experience
      console.error('Error submitting swipe action:', error);
    }

    // Check if all cards are swiped
    if (currentIndex === profiles.length - 1) {
      setTimeout(() => this.handleAllCardsSwiped(), 500);
    }
  };

  /**
   * Handles when all cards are swiped
   */
  handleAllCardsSwiped = () => {
    Alert.alert(
      'No more profiles',
      'You have swiped through all available profiles. Check back later for more matches!',
      [{ text: 'OK' }]
    );
  };

  /**
   * Handles when a card is swiped right (like)
   */
  onSwipedRight = (cardIndex: number) => {
    this.handleSwipe(cardIndex, 'right');
  };

  /**
   * Handles when a card is swiped left (pass)
   */
  onSwipedLeft = (cardIndex: number) => {
    this.handleSwipe(cardIndex, 'left');
  };

  /**
   * Handles when swiping is aborted
   */
  onSwipedAborted = () => {
    console.log('Swipe aborted');
  };

  /**
   * Renders individual profile card
   */
  renderCard = (profile: Profile, cardIndex: number) => {
    if (!profile) {
      return null;
    }

    return (
      <ProfileCard
        profile={profile}
        onActionPress={this.handleActionPress}
      />
    );
  };

  /**
   * Renders when no more cards are available
   */
  renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No more profiles available</Text>
        <Text style={styles.emptySubtext}>Check back later for more matches!</Text>
      </View>
    );
  };

  render() {
    const { profiles, currentIndex } = this.state;

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>DilMil</Text>
          <View style={styles.headerIcon}>
            {/* Filter/Settings icon can be added here */}
          </View>
        </View>

        {/* Swipeable Cards Container */}
        <View style={styles.swiperContainer}>
          {profiles.length > 0 ? (
            <Swiper
              ref={(ref) => {
                this.swiperRef = ref;
              }}
              cards={profiles}
              renderCard={this.renderCard}
              onSwipedRight={this.onSwipedRight}
              onSwipedLeft={this.onSwipedLeft}
              onSwipedAborted={this.onSwipedAborted}
              cardIndex={currentIndex}
              infinite={false}
              backgroundColor="transparent"
              stackSize={3}
              stackSeparation={15}
              animateOverlayLabelsOpacity
              animateCardOpacity
              disableTopSwipe={false}
              disableBottomSwipe={false} 
              horizontalSwipe={true}
              verticalSwipe={false}
              swipeAnimationDuration={300}
              cardVerticalMargin={0}
              cardHorizontalMargin={0}
              secondCardZoom={0.95}
              overlayLabels={{
                left: {
                  title: 'PASS',
                  style: {
                    label: {
                      backgroundColor: 'red',
                      color: 'white',
                      fontSize: 24,
                      fontFamily: 'OpenSans-Bold',
                      borderColor: 'red',
                      borderWidth: 2,
                      borderRadius: 10,
                      padding: 10,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: -30,
                    },
                  },
                },
                right: {
                  title: 'LIKE',
                  style: {
                    label: {
                      backgroundColor: 'green',
                      color: 'white',
                      fontSize: 24,
                      fontFamily: 'OpenSans-Bold',
                      borderColor: 'green',
                      borderWidth: 2,
                      borderRadius: 10,
                      padding: 10,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: 30,
                    },
                  },
                },
              }}
            />
          ) : (
            this.renderEmpty()
          )}
        </View>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => this.setState({ activeTab: 'profile' })}
          >
            <View style={styles.navIconContainer}>
              <Image 
                source={Usericon}
                style={[
                  styles.navIcon,
                  this.state.activeTab === 'profile' ? styles.navIconActive : styles.navIconInactive
                ]}
                resizeMode="contain"
              />
              {this.state.activeTab === 'profile' && <View style={styles.navDot} />}
            </View>
            <Text style={[
              styles.navLabel,
              this.state.activeTab === 'profile' && styles.navLabelActive
            ]}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => this.setState({ activeTab: 'discover' })}
          >
            <Image 
              source={Discovericon}
              style={[
                styles.navIcon,
                this.state.activeTab === 'discover' ? styles.navIconActive : styles.navIconInactive
              ]}
              resizeMode="contain"
            />
            <Text style={[
              styles.navLabel,
              this.state.activeTab === 'discover' && styles.navLabelActive
            ]}>Discover</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => this.setState({ activeTab: 'people' })}
          >
            <View style={[
              styles.hexagonIcon,
              this.state.activeTab === 'people' && styles.hexagonIconActive
            ]}>
              <Icon 
                name="users" 
                size={20} 
                color={this.state.activeTab === 'people' ? '#FFFFFF' : '#999999'} 
              />
            </View>
            <Text style={[
              styles.navLabel,
              this.state.activeTab === 'people' && styles.navLabelActive
            ]}>People</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => this.setState({ activeTab: 'liked' })}
          >
            <View style={styles.navIconContainer}>
              <Image 
                source={Likedicon}
                style={[
                  styles.navIcon,
                  this.state.activeTab === 'liked' ? styles.navIconActive : styles.navIconInactive
                ]}
                resizeMode="contain"
              />
              <View style={styles.redDot} />
            </View>
            <Text style={[
              styles.navLabel,
              this.state.activeTab === 'liked' && styles.navLabelActive
            ]}>Liked You</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => this.setState({ activeTab: 'chats' })}
          >
            <Image 
              source={Chatsicon}
              style={[
                styles.navIcon,
                this.state.activeTab === 'chats' ? styles.navIconActive : styles.navIconInactive
              ]}
              resizeMode="contain"
            />
            <Text style={[
              styles.navLabel,
              this.state.activeTab === 'chats' && styles.navLabelActive
            ]}>Chats</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}