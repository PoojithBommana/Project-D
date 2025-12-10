import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { rf, wp, hp, rs } from '../../utils/responsive';
import styles from '../../styles/PeopleScreenStyles';
import { Usericon } from '../../assets';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  image: string;
  interests: string[];
  likesYou?: boolean;
}

const { width, height } = Dimensions.get('window');

const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Julia',
    age: 27,
    location: 'California',
    bio: 'Hey there 👋. My name is Julia and I\'m a fashion photographer. I love going to concerts and festivals.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    interests: ['Aries', 'Photography', 'Fashion', 'Music'],
    likesYou: true,
  },
  {
    id: '2',
    name: 'Sarah',
    age: 25,
    location: 'New York',
    bio: 'Coffee enthusiast ☕ | Travel lover ✈️ | Always up for an adventure!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    interests: ['Travel', 'Coffee', 'Yoga', 'Art'],
    likesYou: false,
  },
  {
    id: '3',
    name: 'Emma',
    age: 28,
    location: 'Texas',
    bio: 'Foodie 🍕 | Dog mom 🐕 | Love hiking and outdoor activities!',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    interests: ['Food', 'Hiking', 'Dogs', 'Nature'],
    likesYou: true,
  },
  {
    id: '4',
    name: 'Olivia',
    age: 26,
    location: 'Florida',
    bio: 'Fitness enthusiast 💪 | Beach lover 🏖️ | Always positive vibes!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    interests: ['Fitness', 'Beach', 'Running', 'Wellness'],
    likesYou: false,
  },
  {
    id: '5',
    name: 'Sophia',
    age: 24,
    location: 'Washington',
    bio: 'Bookworm 📚 | Tea lover 🍵 | Love quiet evenings and good conversations!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    interests: ['Reading', 'Tea', 'Writing', 'Philosophy'],
    likesYou: true,
  },
  {
    id: '6',
    name: 'Isabella',
    age: 29,
    location: 'Colorado',
    bio: 'Mountain climber ⛰️ | Adventure seeker 🎒 | Life is an adventure!',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    interests: ['Mountains', 'Adventure', 'Camping', 'Photography'],
    likesYou: false,
  },
  {
    id: '7',
    name: 'Mia',
    age: 23,
    location: 'Arizona',
    bio: 'Yoga instructor 🧘 | Plant mom 🌱 | Living mindfully and spreading good vibes!',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
    interests: ['Yoga', 'Meditation', 'Plants', 'Wellness'],
    likesYou: true,
  },
  {
    id: '8',
    name: 'Charlotte',
    age: 30,
    location: 'Oregon',
    bio: 'Chef 👨‍🍳 | Food blogger 📝 | Love cooking and trying new restaurants!',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    interests: ['Cooking', 'Food', 'Travel', 'Wine'],
    likesYou: false,
  },
  {
    id: '9',
    name: 'Amelia',
    age: 24,
    location: 'Nevada',
    bio: 'Dancer 💃 | Music lover 🎵 | Always dancing to the rhythm of life!',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    interests: ['Dancing', 'Music', 'Fitness', 'Parties'],
    likesYou: true,
  },
  {
    id: '10',
    name: 'Harper',
    age: 27,
    location: 'Utah',
    bio: 'Artist 🎨 | Creative soul ✨ | Expressing myself through art and design!',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400',
    interests: ['Art', 'Design', 'Drawing', 'Creativity'],
    likesYou: false,
  },
];

export default function PeopleScreen() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<Swiper<Profile>>(null);

  const handleSwipeLeft = (cardIndex: number) => {
    console.log('Swiped left (pass) on card:', cardIndex);
    setCurrentIndex(cardIndex + 1);
    // Handle pass action
  };

  const handleSwipeRight = (cardIndex: number) => {
    console.log('Swiped right (like) on card:', cardIndex);
    setCurrentIndex(cardIndex + 1);
    // Handle like action
  };

  const handleSwipeTop = (cardIndex: number) => {
    console.log('Swiped top (superlike) on card:', cardIndex);
    setCurrentIndex(cardIndex + 1);
    // Handle superlike action
  };

  const handleOnSwiping = (x: number, y: number) => {
    // Track swiping to update stacked cards
  };

  const handleOnTapCard = (cardIndex: number) => {
    console.log('Tapped on card:', cardIndex);
  };

  const handleSwipedAll = () => {
    console.log('All cards swiped!');
    // Reset or load more profiles
    setProfiles(mockProfiles);
  };

  const handlePass = () => {
    swiperRef.current?.swipeLeft();
  };

  const handleLike = () => {
    swiperRef.current?.swipeRight();
  };

  const handleSuperlike = () => {
    swiperRef.current?.swipeTop();
  };

  const renderCard = (profile: Profile, cardIndex: number) => {
    if (!profile) {
      return (
        <View style={[styles.profileCard, { width: width - wp(40), height: hp(600) }]}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: rf(18), color: '#999' }}>No more profiles</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.profileCard, { width: width - wp(40), height: hp(600) }]}>
        {/* Profile Image */}
        <Image
          source={{ uri: profile.image }}
          style={styles.profileImage}
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
          locations={[0, 0.5, 1]}
          style={styles.gradientOverlay}
        />

        {/* Content Overlay */}
        <View style={styles.contentOverlay}>
          {/* Likes You Badge */}
          {profile.likesYou && (
            <View style={styles.likesYouBadge}>
              <Icon name="favorite" size={rs(16)} color="#FF6B6B" />
              <Text style={styles.likesYouText}>She likes you!</Text>
            </View>
          )}

          {/* Location */}
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={rs(18)} color="#FFFFFF" />
            <Text style={styles.locationText}>{profile.location}</Text>
          </View>

          {/* Name and Age */}
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{profile.name}</Text>
            <Text style={styles.ageText}>{profile.age}</Text>
          </View>

          {/* Bio */}
          <Text style={styles.bioText}>{profile.bio}</Text>

          {/* Interest Tags */}
          <View style={styles.interestsContainer}>
            {profile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Snixx</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Icon name="search" size={rs(24)} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Image source={Usericon} style={styles.profileIcon} resizeMode="cover" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Swiper Container */}
      <View style={styles.swiperWrapper}>
        <View style={styles.cardStackContainer}>
          {/* Render cards behind the swiper manually for stacking effect */}
          {profiles.slice(currentIndex + 1, Math.min(currentIndex + 3, profiles.length)).map((profile, index) => (
            <View
              key={`back-${profile.id}-${currentIndex}`}
              style={[
                styles.profileCard,
                styles.stackCard,
                {
                  width: width - wp(40),
                  height: hp(600),
                  transform: [{ scale: 0.92 - index * 0.02 }],
                  top: (index + 1) * 15,
                  zIndex: 2 - index,
                  opacity: 0.95 - index * 0.05,
                },
              ]}
            >
              <Image
                source={{ uri: profile.image }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                locations={[0, 0.5, 1]}
                style={styles.gradientOverlay}
              />
            </View>
          ))}
          
          <View style={{ width: width - wp(40), height: hp(600), zIndex: 10, position: 'absolute' }}>
            <Swiper
              ref={swiperRef}
              cards={profiles}
              renderCard={renderCard}
              onSwipedLeft={handleSwipeLeft}
              onSwipedRight={handleSwipeRight}
              onSwipedTop={handleSwipeTop}
              onTapCard={handleOnTapCard}
              onSwipedAll={handleSwipedAll}
              cardIndex={currentIndex}
              backgroundColor="transparent"
              stackSize={1}
              stackSeparation={0}
              animateOverlayLabelsOpacity
              animateCardOpacity={false}
              disableTopSwipe={false}
              disableBottomSwipe={true}
              infinite={false}
              cardVerticalMargin={0}
              cardHorizontalMargin={0}
              verticalSwipe={false}
              showSecondCard={false}
              horizontalThreshold={width / 4}
              stackAnimationFriction={10}
              stackAnimationTension={50}
              onSwiping={handleOnSwiping}
          overlayLabels={{
            left: {
              title: 'PASS',
              style: {
                label: {
                  backgroundColor: 'red',
                  borderColor: 'red',
                  color: 'white',
                  borderWidth: 2,
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
                  backgroundColor: '#4CAF50',
                  borderColor: '#4CAF50',
                  color: 'white',
                  borderWidth: 2,
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
            top: {
              title: 'SUPER LIKE',
              style: {
                label: {
                  backgroundColor: '#2196F3',
                  borderColor: '#2196F3',
                  color: 'white',
                  borderWidth: 2,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: 20,
                },
              },
            },
          }}
            />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
     
    </SafeAreaView>
  );
}
