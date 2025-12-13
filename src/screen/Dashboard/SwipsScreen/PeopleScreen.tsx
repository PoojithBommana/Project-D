import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PeopleStackParamList } from '../../../navigation/PeopleStackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import { HomeScreenBg, SnixxHometext } from '../../../assets';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureType,
} from 'react-native-gesture-handler';
import { Profile } from '../../../types/Profile';
import styles, {
  CARD_WIDTH,
  CARD_HEIGHT,
  STACK_OFFSET,
  STACK_SCALE_1,
  STACK_SCALE_2,
  STACK_SCALE_3,
  STACK_SCALE_4,
} from './PeopleScreenStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const ROTATION_MULTIPLIER = 10;
const PARALLAX_MULTIPLIER = 0.3;

// Mock data for demonstration - replace with API call
const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    ],
    job: 'Software Engineer',
    profession: 'Senior Software Engineer at Google',
    education: 'MIT - Computer Science',
    location: 'San Francisco, CA',
    distance: 5,
    verified: true,
    isNew: false,
    interests: ['Comedy', 'Adventure', 'Hiking', 'Tech', 'Photography'],
    bio: 'Love coding, hiking, and trying new restaurants. Looking for someone who shares my passion for technology and outdoor adventures. Coffee enthusiast and weekend traveler.',
  },
  {
    id: '2',
    name: 'Emily Chen',
    age: 26,
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    job: 'UI/UX Designer',
    profession: 'Lead Designer at Apple',
    education: 'Stanford - Design & Human-Computer Interaction',
    location: 'Palo Alto, CA',
    distance: 8,
    verified: true,
    isNew: true,
    interests: ['Romance', 'Drama', 'Art', 'Fashion', 'Yoga'],
    bio: 'Creative designer who loves art galleries, indie films, and morning yoga sessions. Passionate about sustainable fashion and finding beauty in everyday moments.',
  },
  {
    id: '3',
    name: 'Jessica Martinez',
    age: 30,
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
    ],
    job: 'Photographer',
    profession: 'Freelance Travel Photographer',
    education: 'NYU - Visual Arts',
    location: 'Brooklyn, NY',
    distance: 12,
    verified: false,
    isNew: false,
    interests: ['Action', 'Thriller', 'Travel', 'Photography', 'Music'],
    bio: 'Travel photographer capturing stories around the world. Love street photography, live music, and discovering hidden gems in the city. Always up for an adventure!',
  },
  {
    id: '4',
    name: 'Olivia Brown',
    age: 27,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=800',
    ],
    job: 'Marketing Manager',
    profession: 'Senior Marketing Manager at Nike',
    education: 'Harvard Business School - MBA',
    location: 'Boston, MA',
    distance: 3,
    verified: true,
    isNew: false,
    interests: ['Drama', 'Romance', 'Fitness', 'Reading', 'Wine'],
    bio: 'Marketing professional by day, bookworm and wine enthusiast by night. Love spin classes, trying new restaurants, and deep conversations over coffee.',
  },
  {
    id: '5',
    name: 'Sophia Williams',
    age: 29,
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
    ],
    job: 'Doctor',
    profession: 'Emergency Medicine Physician',
    education: 'Johns Hopkins - Medicine',
    location: 'Baltimore, MD',
    distance: 7,
    verified: true,
    isNew: true,
    interests: ['Comedy', 'Action', 'Medicine', 'Running', 'Cooking'],
    bio: 'Emergency doctor who loves helping people. When not at the hospital, I enjoy running marathons, cooking Italian food, and binge-watching medical dramas.',
  },
  {
    id: '6',
    name: 'Isabella Garcia',
    age: 25,
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
    ],
    job: 'Artist',
    profession: 'Contemporary Visual Artist',
    education: 'RISD - Fine Arts',
    location: 'Providence, RI',
    distance: 15,
    verified: false,
    isNew: false,
    interests: ['Art', 'Music', 'Painting', 'Jazz', 'Museums'],
    bio: 'Contemporary artist exploring themes of identity and nature. Love visiting art galleries, listening to jazz, and painting in my studio. Always inspired by the world around me.',
  },
  {
    id: '7',
    name: 'Ava Miller',
    age: 31,
    images: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
    ],
    job: 'Lawyer',
    profession: 'Corporate Attorney at Law Firm',
    education: 'Yale Law School - JD',
    location: 'New Haven, CT',
    distance: 4,
    verified: true,
    isNew: false,
    interests: ['Thriller', 'Drama', 'Law', 'Tennis', 'Theater'],
    bio: 'Corporate lawyer who enjoys the challenge of complex cases. Love playing tennis on weekends, attending Broadway shows, and reading legal thrillers.',
  },
  {
    id: '8',
    name: 'Mia Davis',
    age: 24,
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    ],
    job: 'Teacher',
    profession: 'Elementary School Teacher',
    education: 'Columbia University - Education',
    location: 'Manhattan, NY',
    distance: 9,
    verified: false,
    isNew: true,
    interests: ['Romance', 'Comedy', 'Education', 'Dancing', 'Baking'],
    bio: 'Elementary teacher passionate about inspiring young minds. Love dancing salsa, baking cookies for my students, and exploring NYC\'s best brunch spots.',
  },
  {
    id: '9',
    name: 'Charlotte Wilson',
    age: 32,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
    ],
    job: 'Architect',
    profession: 'Senior Architect at Architecture Firm',
    education: 'MIT - Architecture',
    location: 'Cambridge, MA',
    distance: 6,
    verified: true,
    isNew: false,
    interests: ['Adventure', 'Action', 'Architecture', 'Travel', 'Sketching'],
    bio: 'Architect designing sustainable buildings for the future. Love sketching, traveling to see iconic structures, and rock climbing on weekends.',
  },
  {
    id: '10',
    name: 'Amelia Moore',
    age: 26,
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
    ],
    job: 'Writer',
    profession: 'Novelist & Screenwriter',
    education: 'NYU - Creative Writing',
    location: 'Greenwich Village, NY',
    distance: 11,
    verified: false,
    isNew: false,
    interests: ['Drama', 'Romance', 'Writing', 'Poetry', 'Coffee Shops'],
    bio: 'Novelist working on my second book. Love writing in cozy coffee shops, attending poetry readings, and finding inspiration in everyday conversations.',
  },
  {
    id: '11',
    name: 'Harper Taylor',
    age: 28,
    images: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800',
    ],
    job: 'Chef',
    profession: 'Executive Chef at Michelin Restaurant',
    education: 'Culinary Institute of America',
    location: 'SoHo, NY',
    distance: 2,
    verified: true,
    isNew: true,
    interests: ['Comedy', 'Food', 'Cooking', 'Wine', 'Travel'],
    bio: 'Executive chef passionate about farm-to-table cuisine. Love experimenting with flavors, wine pairings, and hosting dinner parties. Always up for a food adventure!',
  },
  {
    id: '12',
    name: 'Evelyn Anderson',
    age: 30,
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    job: 'Entrepreneur',
    profession: 'Founder & CEO of Tech Startup',
    education: 'Stanford - Business & Engineering',
    location: 'Silicon Valley, CA',
    distance: 13,
    verified: true,
    isNew: false,
    interests: ['Action', 'Adventure', 'Business', 'Surfing', 'Meditation'],
    bio: 'Tech entrepreneur building the next big thing. Love surfing in the morning, meditation sessions, and networking events. Always learning and growing.',
  },
  {
    id: '13',
    name: 'Abigail Thomas',
    age: 27,
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    ],
    job: 'Engineer',
    profession: 'Robotics Engineer at Tesla',
    education: 'Caltech - Mechanical Engineering',
    location: 'Pasadena, CA',
    distance: 10,
    verified: false,
    isNew: false,
    interests: ['Tech', 'Gaming', 'Robotics', '3D Printing', 'Sci-Fi'],
    bio: 'Robotics engineer working on autonomous vehicles. Love gaming, building robots, 3D printing, and watching sci-fi movies. Tech geek at heart!',
  },
  {
    id: '14',
    name: 'Lily Jackson',
    age: 25,
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    ],
    job: 'Fashion Designer',
    profession: 'Fashion Designer at Luxury Brand',
    education: 'FIT - Fashion Design',
    location: 'Fashion District, NY',
    distance: 8,
    verified: true,
    isNew: true,
    interests: ['Fashion', 'Art', 'Design', 'Shopping', 'Fashion Week'],
    bio: 'Fashion designer creating sustainable luxury collections. Love attending fashion weeks, exploring art galleries, and finding vintage treasures.',
  },
  {
    id: '15',
    name: 'Grace White',
    age: 29,
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=800',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
    ],
    job: 'Psychologist',
    profession: 'Clinical Psychologist',
    education: 'UCLA - Psychology PhD',
    location: 'Los Angeles, CA',
    distance: 14,
    verified: false,
    isNew: false,
    interests: ['Drama', 'Romance', 'Psychology', 'Yoga', 'Reading'],
    bio: 'Clinical psychologist helping people navigate life\'s challenges. Love practicing yoga, reading psychology books, and enjoying LA\'s beautiful beaches.',
  },
];

interface SwipeableCardProps {
  profile: Profile;
  index: number;
  onSwipeComplete: (direction: 'left' | 'right') => void;
  onCardTap?: (profile: Profile) => void;
  isTopCard: boolean;
  stackOffset: number;
  stackScale: number;
  stackOpacity: number;
  shouldAnimateToTop?: boolean;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  profile,
  index,
  onSwipeComplete,
  onCardTap,
  isTopCard,
  stackOffset,
  stackScale,
  stackOpacity,
  shouldAnimateToTop = false,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(stackScale);
  const opacity = useSharedValue(stackOpacity);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Initialize translateY with stack offset for non-top cards
  React.useEffect(() => {
    if (shouldAnimateToTop && !isTopCard) {
      // Smoothly animate this card to become the top card with very smooth spring
      scale.value = withSpring(1, { 
        damping: 25, 
        stiffness: 150,
        mass: 1.2,
        overshootClamping: false,
      });
      opacity.value = withSpring(1, { 
        damping: 25, 
        stiffness: 150,
        mass: 1.2,
        overshootClamping: false,
      });
      translateY.value = withSpring(0, { 
        damping: 25, 
        stiffness: 150,
        mass: 1.2,
        overshootClamping: false,
      });
    } else if (!isTopCard) {
      translateY.value = -stackOffset;
      scale.value = stackScale;
      opacity.value = stackOpacity;
    } else {
      translateY.value = 0;
      scale.value = 1;
      opacity.value = 1;
    }
  }, [isTopCard, stackOffset, shouldAnimateToTop, stackScale, stackOpacity]);

  const panGesture = Gesture.Pan()
    .enabled(isTopCard)
    .activeOffsetX([-10, 10])
    .onStart(() => {
      if (!isTopCard) return;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      if (!isTopCard) return;
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd((event) => {
      if (!isTopCard) return;
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeLeft || shouldSwipeRight) {
        const direction = shouldSwipeLeft ? 'left' : 'right';
        const targetX = shouldSwipeLeft ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
        
        // Smooth exit animation with easing
        translateX.value = withTiming(targetX, { 
          duration: 400,
        });
        translateY.value = withTiming(event.translationY, { 
          duration: 400,
        });
        opacity.value = withTiming(0, { 
          duration: 350,
        }, () => {
          runOnJS(onSwipeComplete)(direction);
        });
      } else {
        // Spring back to center with smoother animation
        translateX.value = withSpring(0, {
          damping: 22,
          stiffness: 140,
          mass: 1.0,
          overshootClamping: false,
        });
        translateY.value = withSpring(0, {
          damping: 22,
          stiffness: 140,
          mass: 1.0,
          overshootClamping: false,
        });
      }
    });

  const tapGesture = Gesture.Tap()
    .enabled(isTopCard)
    .numberOfTaps(1)
    .maxDuration(250)
    .onEnd(() => {
      // Only trigger tap if card hasn't moved significantly
      if (Math.abs(translateX.value) < 10 && Math.abs(translateY.value) < 10) {
        if (onCardTap) {
          runOnJS(onCardTap)(profile);
        }
      }
    });

  const composedGesture = Gesture.Race(tapGesture, panGesture);

  // Update scale, opacity, and position when this card becomes the top card
  useAnimatedReaction(
    () => isTopCard,
    (isTop) => {
      if (isTop) {
        // Smoothly animate to top position with very smooth spring
        scale.value = withSpring(1, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
        opacity.value = withSpring(1, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
        translateY.value = withSpring(0, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
      } else {
        // Animate to stacked position with smooth spring
        scale.value = withSpring(stackScale, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
        opacity.value = withSpring(stackOpacity, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
        translateY.value = withSpring(-stackOffset, { 
          damping: 25, 
          stiffness: 150,
          mass: 1.2,
          overshootClamping: false,
        });
      }
    },
    [stackScale, stackOpacity, stackOffset],
  );

  const cardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-ROTATION_MULTIPLIER, 0, ROTATION_MULTIPLIER],
      Extrapolate.CLAMP,
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotation}deg` },
      ],
      opacity: opacity.value,
    };
  });


  const imageStyle = useAnimatedStyle(() => {
    // Image moves exactly with card - no parallax to prevent separation
    return {
      transform: [{ translateX: 0 }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const labelOpacity = interpolate(
      Math.abs(translateX.value),
      [SWIPE_THRESHOLD * 0.7, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity: labelOpacity,
    };
  });

  const likeLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP,
    );
    return { opacity };
  });

  const passLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.5],
      [1, 0],
      Extrapolate.CLAMP,
    );
    return { opacity };
  });

  const primaryImage = profile.images && profile.images.length > 0 
    ? { uri: profile.images[0] } 
    : require('../../../assets/girl.png');

  const genre = profile.interests && profile.interests.length > 0 
    ? profile.interests[0] 
    : 'Dating';

  // Static z-index for proper stacking (animated views need static z-index)
  const staticZIndex = isTopCard ? 1000 : 100 - index;

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.card, cardStyle, { zIndex: staticZIndex }]}>
        <View style={styles.cardImageContainer}>
          <Image
            source={primaryImage}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {/* Only show gradient overlay on stacked cards, not on top card */}
          {!isTopCard && (
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          )}
        </View>

        {/* Badges */}
        <View style={styles.badgesContainer}>
          <View style={[styles.badge, styles.badgeDuration]}>
            <Text style={styles.badgeText}>1h 30m</Text>
          </View>
          <View style={[styles.badge, styles.badgeGenre]}>
            <Text style={[styles.badgeText, styles.badgeGenreText]}>{genre}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          {profile.verified && (
            <Text style={styles.subtitle}>
              {profile.name.split(' ')[0].toUpperCase()}
            </Text>
          )}
          <Text style={styles.title}>
            {profile.name.split(' ')[0]}, {profile.age}
          </Text>
          {profile.job && (
            <Text style={styles.subtitle}>{profile.job}</Text>
          )}
          {profile.distance && (
            <Text style={styles.dateText}>
              {profile.distance} km away
            </Text>
          )}
        </View>

        {/* Swipe Overlay Labels */}
        {isTopCard && (
          <Animated.View style={styles.overlayLabelContainer} pointerEvents="none">
            <Animated.View style={[styles.overlayLabel, styles.likeLabel, likeLabelStyle]}>
              <Text style={[styles.overlayLabelText, styles.likeLabelText]}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.overlayLabel, styles.passLabel, passLabelStyle]}>
              <Text style={[styles.overlayLabelText, styles.passLabelText]}>PASS</Text>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

interface PeopleScreenProps {
  navigation?: NativeStackNavigationProp<PeopleStackParamList, 'PeopleScreen'>;
}

const PeopleScreen: React.FC<PeopleScreenProps> = ({ navigation }) => {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(1); // 0: Coming Soon, 1: Now Playing, 2: Tomorrow

  const handleCardTap = useCallback((profile: Profile) => {
    // Small delay for smoother transition
    setTimeout(() => {
      navigation?.navigate('ProfileDetailsScreen', { profile });
    }, 50);
  }, [navigation]);

  const handleSwipeComplete = useCallback((direction: 'left' | 'right') => {
    setIsAnimating(true);
    // Delay to ensure smooth transition animation starts after card exits
    setTimeout(() => {
      setCurrentIndex((prev) => {
        setIsAnimating(false);
        return prev + 1;
      });
    }, 150);
    // TODO: Call API to save swipe action
    // await postApiCall('POST', 'SWIPE', 'ACTION', {
    //   profileId: profiles[currentIndex].id,
    //   action: direction === 'right' ? 'like' : 'pass',
    // });
  }, [currentIndex]);

  // Show 5 cards in the stack for better visual stacking effect
  const visibleCards = profiles.slice(currentIndex, currentIndex + 5);
  
  console.log(`Showing ${visibleCards.length} cards, currentIndex: ${currentIndex}, total profiles: ${profiles.length}`);

  // Get current top card's image for background
  const currentTopCard = visibleCards[0];
  const backgroundImageSource = currentTopCard?.images && currentTopCard.images.length > 0
    ? { uri: currentTopCard.images[0] }
    : HomeScreenBg;

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No more profiles available.{'\n'}Check back later!
          </Text>
        </View>
      </View>
    );
  }

  

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Background Image - Blurred card image */}
      <Image
        source={backgroundImageSource}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={20}
      />
      
      {/* Homescreen Background - Behind cards but on top of blurred background */}
      <View style={styles.homescreenBackgroundContainer}>
       
        {/* Snixx Home Text at top */}
        <Image
          source={SnixxHometext}
          style={styles.snixxHomeText}
          resizeMode="contain"
        />
        
        {/* Light black overlay from top to bottom */}
        <View style={styles.backgroundOverlay} />
      </View>
      
      {/* Top Header Section */}
     

      <View style={styles.cardStackContainer}>
        {visibleCards.map((profile, index) => {
          const isTopCard = index === 0;
          const stackIndex = index;
          
          let stackOffset = 0;
          let stackScale = 1;
          let stackOpacity = 1;

          // Progressive stacking: each card behind gets more offset, smaller scale, and lower opacity
          // Increased values for more pronounced top stack effect
          if (stackIndex === 1) {
            stackOffset = STACK_OFFSET;
            stackScale = STACK_SCALE_1;
            stackOpacity = 0.6;
          } else if (stackIndex === 2) {
            stackOffset = STACK_OFFSET * 2;
            stackScale = STACK_SCALE_2;
            stackOpacity = 0.4;
          } else if (stackIndex === 3) {
            stackOffset = STACK_OFFSET * 3;
            stackScale = STACK_SCALE_3;
            stackOpacity = 0.25;
          } else if (stackIndex === 4) {
            stackOffset = STACK_OFFSET * 4;
            stackScale = STACK_SCALE_4;
            stackOpacity = 0.15;
          }

          // Render cards from back to front for proper stacking
          // Cards behind should render first (lower z-index), top card renders last (higher z-index)
          const zIndex = isTopCard ? 1000 : 100 - index;

          // The card that will become the new top card should animate smoothly
          const shouldAnimateToTop = index === 1 && isAnimating;

          return (
            <SwipeableCard
              key={`${profile.id}-${currentIndex + index}`}
              profile={profile}
              index={index}
              onSwipeComplete={handleSwipeComplete}
              onCardTap={handleCardTap}
              isTopCard={isTopCard}
              stackOffset={stackOffset}
              stackScale={stackScale}
              stackOpacity={stackOpacity}
              shouldAnimateToTop={shouldAnimateToTop}
            />
          );
        }).reverse()}
      </View>
    </GestureHandlerRootView>
  );
};

export default PeopleScreen;
