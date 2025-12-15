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
  const panStartTime = React.useRef(0);

  // Initialize translateY with stack offset for non-top cards
  React.useEffect(() => {
    if (shouldAnimateToTop && !isTopCard) {
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
      panStartTime.current = Date.now();
    })
    .onUpdate((event) => {
      if (!isTopCard) return;
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd((event) => {
      if (!isTopCard) return;
      const panDuration = Date.now() - panStartTime.current;
      const totalMovement = Math.abs(event.translationX) + Math.abs(event.translationY);
      
      if (panDuration < 200 && totalMovement < 30) {
        if (onCardTap) {
          runOnJS(onCardTap)(profile);
        }
        translateX.value = withSpring(0, {
          damping: 22,
          stiffness: 140,
          mass: 1.0,
        });
        translateY.value = withSpring(0, {
          damping: 22,
          stiffness: 140,
          mass: 1.0,
        });
        return;
      }
      
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeLeft || shouldSwipeRight) {
        const direction = shouldSwipeLeft ? 'left' : 'right';
        const targetX = shouldSwipeLeft ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
        
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
    .maxDuration(300)
    .maxDistance(15)
    .onEnd(() => {
      if (Math.abs(translateX.value) < 20 && Math.abs(translateY.value) < 20) {
        if (onCardTap) {
          runOnJS(onCardTap)(profile);
        }
      }
    });

  const composedGesture = Gesture.Race(tapGesture, panGesture);

  useAnimatedReaction(
    () => isTopCard,
    (isTop) => {
      if (isTop) {
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
          {!isTopCard && (
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          )}
        </View>

        <View style={styles.badgesContainer}>
          <View style={[styles.badge, styles.badgeDuration]}>
            <Text style={styles.badgeText}>1h 30m</Text>
          </View>
          <View style={[styles.badge, styles.badgeGenre]}>
            <Text style={[styles.badgeText, styles.badgeGenreText]}>{genre}</Text>
          </View>
        </View>

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

  const handleCardTap = useCallback((profile: Profile) => {
    console.log('Card tapped, navigating to ProfileDetailsScreen', profile?.name);
    if (navigation && profile) {
      try {
        navigation.navigate('ProfileDetailsScreen', { profile });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }, [navigation]);

  const handleSwipeComplete = useCallback((direction: 'left' | 'right') => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        setIsAnimating(false);
        return prev + 1;
      });
    }, 150);
  }, [currentIndex]);

  const visibleCards = profiles.slice(currentIndex, currentIndex + 5);
  
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
      <View style={styles.backgroundImageContainer} />
      
      <Image
        key={`bg-${currentIndex}`}
        source={backgroundImageSource}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={20}
        defaultSource={HomeScreenBg}
      />
      
      <View style={styles.homescreenBackgroundContainer}>
        <Image
          source={SnixxHometext}
          style={styles.snixxHomeText}
          resizeMode="contain"
        />
        
        <View style={styles.backgroundOverlay} />
      </View>

      <View style={styles.cardStackContainer}>
        {visibleCards.map((profile, index) => {
          const isTopCard = index === 0;
          const stackIndex = index;
          
          let stackOffset = 0;
          let stackScale = 1;
          let stackOpacity = 1;

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