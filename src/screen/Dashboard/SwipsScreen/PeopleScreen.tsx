import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import styles from './PeopleScreenStyles';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface Profile {
  id: string;
  name: string;
  age: number;
  image: string;
  bio?: string;
  location?: string;
  distance?: number;
  verified?: boolean;
  job?: string;
  education?: string;
  isNew?: boolean;
  interests?: string[];
}

export default function PeopleScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const nextCardScale = useRef(new Animated.Value(0.96)).current;
  const nextCardOpacity = useRef(new Animated.Value(1)).current;
  const currentAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const isAnimatingRef = useRef(false);

  // Reset animation values when index changes to prevent flickering
  useEffect(() => {
    // Stop any ongoing animations
    if (currentAnimation.current) {
      currentAnimation.current.stop();
      currentAnimation.current = null;
    }
    
    // Reset values without animation
    position.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    nextCardScale.setValue(0.96);
    setIsAnimating(false);
    isAnimatingRef.current = false;
  }, [currentIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAnimation.current) {
        currentAnimation.current.stop();
      }
    };
  }, []);

  const profiles: Profile[] = useMemo(
    () => [
      {
        id: '1',
        name: 'Julia',
        age: 27,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=800&auto=format&fit=crop',
        bio: "Hey there 👋 My name is Julia and I'm a fashion photographer. I love going to concerts and festivals.",
        location: 'California',
        distance: 5,
        verified: true,
        job: 'Fashion Photographer',
        education: 'UCLA',
        isNew: true,
        interests: ['Artists', 'Photography', 'Fashion', 'Music'],
      },
      {
        id: '2',
        name: 'Amelia',
        age: 25,
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
        bio: 'Love going to concerts and festivals.',
        location: 'New York',
        distance: 8,
        job: 'Product Designer',
        education: 'Parsons',
        interests: ['Music', 'Travel', 'Art'],
      },
      {
        id: '3',
        name: 'Sophia',
        age: 29,
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop',
        location: 'Boston',
        distance: 2,
        job: 'Software Engineer',
        education: 'MIT',
        verified: true,
        interests: ['Tech', 'Coffee', 'Hiking'],
      },
      {
        id: '4',
        name: 'Ava',
        age: 26,
        image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=800&auto=format&fit=crop',
        location: 'Seattle',
        distance: 3,
        job: 'Architect',
        interests: ['Design', 'Architecture'],
      },
    
      // ---- 46 Artificially Generated Members Below ---- //
    
      {
        id: '5',
        name: 'Mia',
        age: 24,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
        bio: 'Writer ✍️ Lover of books and sunsets.',
        location: 'Chicago',
        distance: 6,
        job: 'Content Writer',
        interests: ['Books', 'Tea', 'Travel'],
      },
      {
        id: '6',
        name: 'Isabella',
        age: 28,
        image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=800&auto=format&fit=crop',
        location: 'San Francisco',
        job: 'UI/UX Designer',
        distance: 4,
        interests: ['Art', 'Design', 'Hiking'],
        verified: true,
      },
      {
        id: '7',
        name: 'Charlotte',
        age: 30,
        image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=800&auto=format&fit=crop',
        location: 'Houston',
        distance: 10,
        job: 'Nurse',
        interests: ['Fitness', 'Cycling'],
      },
      {
        id: '8',
        name: 'Harper',
        age: 23,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
        location: 'Miami',
        distance: 3,
        job: 'Barista',
        interests: ['Coffee', 'Beach', 'Surfing'],
        isNew: true,
      },
      {
        id: '9',
        name: 'Evelyn',
        age: 27,
        image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop',
        location: 'Denver',
        job: 'Data Analyst',
        distance: 7,
        verified: true,
        interests: ['Tech', 'Chess'],
      },
      {
        id: '10',
        name: 'Abigail',
        age: 26,
        image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=800&auto=format&fit=crop',
        location: 'Austin',
        distance: 9,
        job: 'Marketing Manager',
        interests: ['Branding', 'Music Festivals'],
      },
    
      {
        id: '11',
        name: 'Emily',
        age: 22,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
        location: 'Las Vegas',
        job: 'Student',
        interests: ['Movies', 'Dance', 'Gaming'],
      },
      {
        id: '12',
        name: 'Ella',
        age: 25,
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
        location: 'Washington',
        verified: true,
        job: 'Political Analyst',
        interests: ['Debates', 'History'],
      },
      {
        id: '13',
        name: 'Grace',
        age: 29,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29339?q=80&w=800&auto=format&fit=crop',
        location: 'Phoenix',
        distance: 5,
        job: 'Event Manager',
        interests: ['Parties', 'Photography'],
      },
      {
        id: '14',
        name: 'Chloe',
        age: 28,
        image: 'https://images.unsplash.com/photo-1475546651228-74e7450c0a21?q=80&w=800&auto=format&fit=crop',
        location: 'Philadelphia',
        distance: 6,
        interests: ['Cooking', 'Yoga'],
        education: 'NYU',
      },
      {
        id: '15',
        name: 'Lily',
        age: 26,
        image: 'https://images.unsplash.com/photo-1502767089025-6572583495ef?q=80&w=800&auto=format&fit=crop',
        location: 'Seattle',
        job: 'Interior Designer',
        interests: ['Art', 'Architecture', 'Crafts'],
      },
      {
        id: '16',
        name: 'Hannah',
        age: 27,
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
        location: 'Dallas',
        distance: 4,
        job: 'Fitness Instructor',
        verified: true,
        interests: ['Gym', 'Running'],
      },
      {
        id: '17',
        name: 'Zoey',
        age: 24,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        location: 'San Diego',
        distance: 2,
        isNew: true,
        job: 'Student',
        interests: ['Beach', 'Surfing', 'Yoga'],
      },
      {
        id: '18',
        name: 'Nora',
        age: 30,
        image: 'https://images.unsplash.com/photo-1517091421724-005eec06c04b?q=80&w=800&auto=format&fit=crop',
        location: 'New Jersey',
        job: 'Chef',
        interests: ['Cooking', 'Wine', 'Travel'],
      },
      {
        id: '19',
        name: 'Riley',
        age: 25,
        image: 'https://images.unsplash.com/photo-1503341455253-b0e723bb3da0?q=80&w=800&auto=format&fit=crop',
        location: 'Atlanta',
        distance: 8,
        interests: ['Biking', 'Photography'],
      },
      {
        id: '20',
        name: 'Victoria',
        age: 31,
        image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=800&auto=format&fit=crop',
        location: 'Orlando',
        job: 'Lawyer',
        verified: true,
      },
    
      // Continuing…
    
      ...Array.from({ length: 30 }).map((_, i) => ({
        id: `${21 + i}`,
        name: `User${21 + i}`,
        age: 22 + (i % 10),
        image: `https://images.unsplash.com/photo-15${80 + i}...?auto=format&fit=crop`,
        location: ['LA', 'NY', 'TX', 'FL', 'Chicago'][i % 5],
        distance: (i % 12) + 1,
        job: ['Artist', 'Engineer', 'Doctor', 'Photographer', 'Developer'][i % 5],
        verified: i % 3 === 0,
        isNew: i % 4 === 0,
        interests: ['Music', 'Travel', 'Food', 'Tech'].slice(0, (i % 4) + 1),
      })),
    
    ],
    []
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isAnimatingRef.current,
        onMoveShouldSetPanResponder: (_, gesture) => {
          // Only start responding if there's significant movement and not animating
          return !isAnimatingRef.current && (Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2);
        },
        onPanResponderMove: (_, gesture) => {
          if (isAnimatingRef.current) return;
          
          position.setValue({ x: gesture.dx, y: gesture.dy });
          rotate.setValue(gesture.dx * 0.08);
          
          const progress = Math.min(Math.abs(gesture.dx) / 100, 1);
          nextCardScale.setValue(0.96 + progress * 0.04);
        },
        onPanResponderRelease: (_, gesture) => {
          if (isAnimatingRef.current) return;
          
          // Check velocity for faster swipes
          const isSwipeFast = Math.abs(gesture.vx) > 0.5 || Math.abs(gesture.vy) > 0.5;
          const swipeThreshold = isSwipeFast ? SWIPE_THRESHOLD * 0.5 : SWIPE_THRESHOLD;
          
          if (Math.abs(gesture.dx) > swipeThreshold) {
            handleSwipe(gesture.dx > 0 ? 'right' : 'left');
          } else if (gesture.dy < -swipeThreshold) {
            handleSwipe('up');
          } else {
            resetPosition();
          }
        },
      }),
    []
  );

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (isAnimatingRef.current || currentIndex >= profiles.length) return;
    
    // Stop any ongoing animation
    if (currentAnimation.current) {
      currentAnimation.current.stop();
    }
    
    setIsAnimating(true);
    isAnimatingRef.current = true;
    
    const x = direction === 'left' ? -width * 1.5 : direction === 'right' ? width * 1.5 : 0;
    const y = direction === 'up' ? -height * 1.5 : 0;

    currentAnimation.current = Animated.parallel([
      Animated.timing(position, {
        toValue: { x, y },
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(nextCardScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]);

    currentAnimation.current.start(({ finished }) => {
      currentAnimation.current = null;
      
      if (finished) {
        // Advance to next card - the useEffect will reset isAnimating
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        // Animation was interrupted, reset position
        position.setValue({ x: 0, y: 0 });
        rotate.setValue(0);
        nextCardScale.setValue(0.96);
        setIsAnimating(false);
        isAnimatingRef.current = false;
      }
    });
  };

  const resetPosition = () => {
    // Stop any ongoing animation
    if (currentAnimation.current) {
      currentAnimation.current.stop();
    }

    currentAnimation.current = Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(rotate, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(nextCardScale, {
        toValue: 0.96,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]);

    currentAnimation.current.start(() => {
      currentAnimation.current = null;
    });
  };

  const renderCard = (profile: Profile, index: number) => {
    const isTopCard = index === currentIndex;
    const isNextCard = index === currentIndex + 1;
    const isThirdCard = index === currentIndex + 2;

    // Don't render cards that have been swiped
    if (index < currentIndex) return null;
    // Only render top 3 cards for performance
    if (index > currentIndex + 2) return null;

    const rotateCard = rotate.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-20deg', '0deg', '20deg'],
    });

    const likeOpacity = position.x.interpolate({
      inputRange: [0, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const nopeOpacity = position.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const superLikeOpacity = position.y.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const cardStyle = isTopCard
      ? {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate: rotateCard },
          ],
          zIndex: 1000,
          opacity: 1,
        }
      : isNextCard
      ? {
          transform: [
            { scale: 0.97 },
            { translateX: 12 },
            { translateY: -3 }
          ],
          zIndex: 999,
          opacity: 1,
        }
      : {
          transform: [
            { scale: 0.94 },
            { translateX: 24 },
            { translateY: -3 }
          ],
          zIndex: 998,
          opacity: 1,
        };

    return (
      <Animated.View
        key={profile.id}
        style={[styles.card, cardStyle]}
        {...(isTopCard ? panResponder.panHandlers : {})}
      >
        <Image source={{ uri: profile.image }} style={styles.cardImage} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        {isTopCard && (
          <>
            <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
              <Text style={styles.likeLabelText}>LIKE</Text>
            </Animated.View>

            <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
              <Text style={styles.nopeLabelText}>NOPE</Text>
            </Animated.View>

            <Animated.View style={[styles.superLikeLabel, { opacity: superLikeOpacity }]}>
              <Text style={styles.superLikeLabelText}>SUPER LIKE</Text>
            </Animated.View>
          </>
        )}

        {profile.isNew && isTopCard && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>She likes you</Text>
          </View>
        )}

        <View style={styles.profileInfo}>
          <View style={styles.locationContainer}>
            <Icon name="map-marker" size={14} color="#fff" />
            <Text style={styles.locationText}>{profile.location}</Text>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>{profile.age}</Text>
            {profile.verified && (
              <Icon name="check-circle" size={24} color="#00BCD4" style={styles.verifiedIcon} />
            )}
          </View>

          {profile.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {profile.bio}
            </Text>
          )}

          {profile.job && <Text style={styles.detail}>💼 {profile.job}</Text>}
          {profile.education && <Text style={styles.detail}>🎓 {profile.education}</Text>}
          {profile.distance && <Text style={styles.distance}>📍 {profile.distance} km away</Text>}

          {profile.interests && profile.interests.length > 0 && (
            <View style={styles.interestsContainer}>
              {profile.interests.map((interest, i) => (
                <View key={i} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>You're all caught up!</Text>
      <Text style={styles.emptySubtext}>Come back later for more profiles.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>snixx</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="search" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIconCircle}>
            <Icon name="user" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

    
      <View style={styles.cardsContainer}>
        {currentIndex >= profiles.length
          ? renderEmptyState()
          : profiles.map((profile, index) => renderCard(profile, index))}
      </View>

    
    </SafeAreaView>
  );
}