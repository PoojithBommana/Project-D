import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, Animated, Dimensions, FlatList, InteractionManager, StatusBar, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import { GEMINI_API_KEY, GEMINI_API_URL_TEXT, GEMINI_API_URL_VISION } from '../../../config/apiConfig';
import { WardrobeStackParamList } from './WardrobeFeature';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { ClosetLogo } from '../../../assets';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AIScreenProps {
  navigation?: NativeStackNavigationProp<WardrobeStackParamList, 'Dashboard'>;
}

interface DayData {
  id: string;
  day: string;
  date: string;
  isToday: boolean;
  weatherIcon: string;
  tempHigh: string;
  tempLow: string;
}

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  outfits: SavedOutfit[];
}

interface CollectionItem {
  id: string;
  name: string;
  image: string;
}

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  items: CollectionItem[];
}

type SavedOutfitCarouselItem = SavedOutfit & { _loopKey: string; _baseIndex: number };

interface SavedOutfit {
  id: string;
  name: string;
  date: string;
  items: string[];
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUri?: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const OUTFIT_CARD_WIDTH = 160;
const OUTFIT_CARD_SPACING = 20;
const OUTFIT_CARD_FULL_WIDTH = OUTFIT_CARD_WIDTH + OUTFIT_CARD_SPACING;
const OUTFIT_CAROUSEL_SIDE_PADDING = (SCREEN_WIDTH - OUTFIT_CARD_WIDTH) / 2;
const CATEGORY_CARD_HEIGHT = 100;
const CATEGORY_CARD_VERTICAL_SPACING = 16;
const CATEGORY_CARD_VERTICAL_FULL_HEIGHT = CATEGORY_CARD_HEIGHT + CATEGORY_CARD_VERTICAL_SPACING;
// Max scale is 1.06, so max height is 100 * 1.06 = 106px. Need extra padding for scaled cards
const MAX_SCALED_CARD_HEIGHT = CATEGORY_CARD_HEIGHT * 1.06;
const CATEGORY_CAROUSEL_VERTICAL_PADDING = (SCREEN_HEIGHT * 0.3 - MAX_SCALED_CARD_HEIGHT) / 2;
// Horizontal card dimensions
const CATEGORY_CARD_HORIZONTAL_WIDTH = 140;
const CATEGORY_CARD_HORIZONTAL_HEIGHT = 120;
const CATEGORY_CARD_HORIZONTAL_SPACING = 12;
const CATEGORY_CARD_HORIZONTAL_FULL_WIDTH = CATEGORY_CARD_HORIZONTAL_WIDTH + CATEGORY_CARD_HORIZONTAL_SPACING;
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Utility constants for calendar
const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate 7 days starting from today for the week view
const generateWeekDays = (): DayData[] => {
  const today = new Date();
  const days: DayData[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const isToday = i === 0;
    const dayName = isToday ? 'Today' : weekDays[date.getDay()];
    const monthName = monthAbbreviations[date.getMonth()];
    const dayNumber = date.getDate();
    const dateString = `${monthName} ${dayNumber}`;
    
    days.push({
      id: `day-${i}`,
      day: dayName,
      date: dateString,
      isToday: isToday,
      weatherIcon: 'weather-sunny',
      tempHigh: '29°',
      tempLow: '24°',
    });
  }
  
  return days;
};

// Circular 3D Outfit Cards Component
interface Circular3DOutfitCardsProps {
  outfits: SavedOutfit[];
  navigation?: NativeStackNavigationProp<WardrobeStackParamList, 'Dashboard'>;
  onOutfitSelect?: (outfit: SavedOutfit) => void;
}

interface CircularCardProps {
  index: number;
  outfit: SavedOutfit | undefined;
  rotation: ReturnType<typeof useSharedValue<number>>;
  step: number;
  radius: number;
  isSelected: boolean;
  onPress: () => void;
}

const CircularCard = ({ index, outfit, rotation, step, radius, isSelected, onPress }: CircularCardProps) => {
  const style = useAnimatedStyle(() => {
    const angle = rotation.value + index * step;

    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle);

    // Enhanced pop-up effect: scale from 0.6 to 1.35 for more prominent focused card
    const scale = 0.6 + z * 0.75;
    
    // Lift focused card up smoothly: translateY from 0 to -22px when focused
    const translateY = -(1 - z) * 22;

    // Calculate z-index with boost for selected card to ensure it's always on top
    // z ranges from -1 to 1, so we map it to 0-200, then add boost for selected
    const baseZIndex = Math.round((z + 1) * 100); // Maps -1 to 0, 1 to 200
    const zIndex = isSelected ? baseZIndex + 1000 : baseZIndex; // Selected card gets significant boost

    return {
      transform: [
        { perspective: 1000 },
        { translateY },
        { translateX: x },
        { scale },
      ],
      opacity: withTiming(0.4 + z * 0.6, { duration: 200 }),
      zIndex,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Reanimated.View
        style={[
          circularCardsStyles.card,
          style,
          isSelected && circularCardsStyles.selected,
        ]}
      >
        {outfit && (
          <View style={circularCardsStyles.cardContent}>
            <LinearGradient
              colors={isSelected ? ['#666666', '#888888'] : ['#F5F5F5', '#E8E8E8']}
              style={circularCardsStyles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon 
                name="hanger" 
                size={isSelected ? 32 : 28} 
                color={isSelected ? '#FFFFFF' : '#666666'} 
              />
            </LinearGradient>
            <Text style={[circularCardsStyles.cardName, isSelected && circularCardsStyles.cardNameSelected]} numberOfLines={2}>
              {outfit.name}
            </Text>
          </View>
        )}
      </Reanimated.View>
    </Pressable>
  );
};

const Circular3DOutfitCards = ({ outfits, navigation: _navigation, onOutfitSelect }: Circular3DOutfitCardsProps) => {
  const CARD_COUNT = Math.max(10, outfits.length || 10);
  const RADIUS = 200;
  const STEP = (2 * Math.PI) / CARD_COUNT;

  const rotation = useSharedValue(0);
  const [selected, setSelected] = useState(0);

  const centerOnCard = useCallback((index: number, isLoopingForward: boolean = false, isLoopingBackward: boolean = false) => {
    const currentRotation = rotation.value;
    const targetAngle = -index * STEP;
    
    // Calculate the shortest rotation path
    let rotationDelta = targetAngle - currentRotation;
    
    // Normalize rotationDelta to [-π, π] range
    while (rotationDelta > Math.PI) rotationDelta -= 2 * Math.PI;
    while (rotationDelta < -Math.PI) rotationDelta += 2 * Math.PI;
    
    // Handle seamless looping - continue in the same direction
    if (isLoopingForward) {
      // Going from last to first: continue forward by adding full rotation
      if (rotationDelta < 0) {
        rotationDelta += 2 * Math.PI;
      }
    } else if (isLoopingBackward) {
      // Going from first to last: continue backward by subtracting full rotation
      if (rotationDelta > 0) {
        rotationDelta -= 2 * Math.PI;
      }
    }
    
    const target = currentRotation + rotationDelta;
    
    rotation.value = withSpring(target, {
      damping: 28,
      stiffness: 105,
      mass: 1.0,
      overshootClamping: false,
    });
    setSelected(index);
  }, [STEP, rotation]);

  const goToNextCard = useCallback(() => {
    setSelected((prev) => {
      const isAtLast = prev === CARD_COUNT - 1;
      const next = (prev + 1) % CARD_COUNT;
      centerOnCard(next, isAtLast, false);
      return next;
    });
  }, [CARD_COUNT, centerOnCard]);

  const goToPreviousCard = useCallback(() => {
    setSelected((prev) => {
      const isAtFirst = prev === 0;
      const prevIndex = prev === 0 ? CARD_COUNT - 1 : prev - 1;
      centerOnCard(prevIndex, false, isAtFirst);
      return prevIndex;
    });
  }, [CARD_COUNT, centerOnCard]);

  return (
    <View style={circularCardsStyles.wrapper}>
      <View style={circularCardsStyles.container}>
        {Array.from({ length: CARD_COUNT }).map((_, index) => {
          const outfit = outfits.length > 0 ? outfits[index % outfits.length] : undefined;
          return (
            <CircularCard
              key={index}
              index={index}
              outfit={outfit}
              rotation={rotation}
              step={STEP}
              radius={RADIUS}
              isSelected={selected === index}
              onPress={() => {
                centerOnCard(index);
                if (outfit && onOutfitSelect) {
                  onOutfitSelect(outfit);
                }
              }}
            />
          );
        })}
      </View>
      <View style={circularCardsStyles.arrowButtonsContainer}>
        <TouchableOpacity
          style={circularCardsStyles.arrowButton}
          onPress={goToPreviousCard}
          activeOpacity={0.7}
        >
          <Icon name="chevron-left" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={circularCardsStyles.arrowButton}
          onPress={goToNextCard}
          activeOpacity={0.7}
        >
          <Icon name="chevron-right" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const circularCardsStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: 380,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  arrowButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginTop: 16,
    paddingVertical: 8,
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    position: 'absolute',
    width: 120,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    overflow: 'hidden',
    // Ensure cards are centered from their center point
    alignSelf: 'center',
  },
  selected: {
    borderColor: '#666666',
    borderWidth: 3,
    shadowColor: '#666666',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 16,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardName: {
    fontSize: 13,
    fontFamily: 'GTMaruMedium',
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  cardNameSelected: {
    color: '#333333',
    fontWeight: '700',
  },
});

const AIScreen = ({ navigation }: AIScreenProps) => {
  // Gradient palettes for category cards
  const gradientPalettes = [
    ['#4A90E2', '#87CEEB'], // Blue to sky-blue
    ['#FF6B6B', '#FFB88C'], // Orange to pink
    ['#9B59B6', '#E8D5FF'], // Purple to lavender
    ['#FF8A80', '#FFB74D'], // Warm gradient
  ];
  
  // All hooks must be at the top level in consistent order
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [showAddToCalendarModal, setShowAddToCalendarModal] = useState(false);
  const [selectedOutfitForDate, setSelectedOutfitForDate] = useState<SavedOutfit | null>(null);
  const [showDateOutfitModal, setShowDateOutfitModal] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [showChatbotModal, setShowChatbotModal] = useState(false);
  const [showOutfitPreviewModal, setShowOutfitPreviewModal] = useState(false);
  const [selectedOutfitForPreview, setSelectedOutfitForPreview] = useState<SavedOutfit | null>(null);
  
  // Chatbot state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your Fashion Advisor. I can help you with outfit suggestions, style tips, and color coordination. What would you like to know?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  // Saved outfits state - moved earlier to maintain consistent hook order
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(() => {
    // Use lazy initializer to compute initial state
    const today = new Date();
    const outfitDates: string[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const monthName = monthAbbreviations[date.getMonth()];
      const dayNumber = date.getDate();
      const year = date.getFullYear();
      outfitDates.push(`${monthName} ${dayNumber}, ${year}`);
    }
    
    return [
      { id: '1', name: 'Casual Weekend', date: outfitDates[0], items: ['White T-Shirt', 'Jeans', 'Sneakers'] },
      { id: '2', name: 'Business Meeting', date: outfitDates[1], items: ['Blazer', 'Button-Up Shirt', 'Tailored Pants', 'Oxfords'] },
      { id: '3', name: 'Date Night', date: outfitDates[2], items: ['Leather Jacket', 'Striped Shirt', 'Chinos', 'Boots'] },
      { id: '4', name: 'Gym Outfit', date: outfitDates[3], items: ['Tank Top', 'Leggings', 'Running Shoes'] },
      { id: '5', name: 'Beach Day', date: outfitDates[4], items: ['T-Shirt', 'Shorts', 'Sandals'] },
      { id: '6', name: 'Winter Look', date: outfitDates[5], items: ['Wool Coat', 'Sweater', 'Jeans', 'Boots'] },
      { id: '7', name: 'Weekend Casual', date: outfitDates[6], items: ['Hoodie', 'Jeans', 'Sneakers'] },
    ];
  });
  const chatScrollViewRef = useRef<ScrollView>(null);
  const [_focusedCategoryIndexRow1, _setFocusedCategoryIndexRow1] = useState(0);
  const [_focusedCategoryIndexRow2, _setFocusedCategoryIndexRow2] = useState(0);
  const categoryScrollYRow1 = useRef(new Animated.Value(0)).current;
  const categoryFlatListRefRow1 = useRef<FlatList<CategoryData>>(null);
  const categoryFlatListRefRow2 = useRef<FlatList<CategoryData>>(null);
  const outfitScrollX = useRef(new Animated.Value(0)).current;
  const [_focusedOutfitIndex, setFocusedOutfitIndex] = useState(0);
  const outfitFlatListRef = useRef<FlatList<SavedOutfitCarouselItem>>(null);
  const outfitRawIndexRef = useRef(0);
  const outfitAutoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Animation shared values for modals
  const collectionModalTranslateY = useSharedValue(SCREEN_HEIGHT);
  const collectionModalOpacity = useSharedValue(0);
  const calendarModalTranslateY = useSharedValue(SCREEN_HEIGHT);
  const calendarModalOpacity = useSharedValue(0);
  const addToCalendarModalTranslateY = useSharedValue(SCREEN_HEIGHT);
  const addToCalendarModalOpacity = useSharedValue(0);
  const viewAllModalTranslateY = useSharedValue(SCREEN_HEIGHT);
  const viewAllModalOpacity = useSharedValue(0);
  const dateOutfitModalTranslateY = useSharedValue(SCREEN_HEIGHT);
  const dateOutfitModalOpacity = useSharedValue(0);
  const chatbotModalTranslateY = useSharedValue(SCREEN_HEIGHT);
  const chatbotModalOpacity = useSharedValue(0);
  const outfitPreviewModalTranslateY = useSharedValue(SCREEN_HEIGHT);
  const outfitPreviewModalOpacity = useSharedValue(0);

  // Button press animations
  const createOutfitButtonScale = useSharedValue(1);
  const addToCalendarButtonScale = useSharedValue(1);
  const myCollectionButtonScale = useSharedValue(1);
  const chatbotTriggerButtonScale = useSharedValue(1);

  // Utility constants for calendar
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const calendarDays = useMemo(() => generateWeekDays(), []);

  // Mock data for collection categories - Row 1 (lazy loaded only when modal opens)
  const collectionCategoriesRow1: CategoryData[] = useMemo(() => {
    if (!showCollectionModal) return [];
    return [
    { 
      id: '1', 
      name: 'Shirts', 
      icon: 'tshirt-crew', 
      itemCount: 8,
      items: [
        { id: '1', name: 'Striped Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '2', name: 'Button-Up Shirt', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
        { id: '3', name: 'Polo Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '4', name: 'Flannel Shirt', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
        { id: '5', name: 'Oxford Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '6', name: 'Denim Shirt', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
        { id: '7', name: 'Chambray Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '8', name: 'Linen Shirt', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
      ]
    },
    { 
      id: '2', 
      name: 'Tshirts', 
      icon: 'tshirt-crew', 
      itemCount: 10,
      items: [
        { id: '1', name: 'White T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '2', name: 'Black T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '3', name: 'Gray T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '4', name: 'Navy T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '5', name: 'V-Neck T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '6', name: 'Long Sleeve Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '7', name: 'Graphic Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '8', name: 'Henley Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '9', name: 'Tank Top', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
        { id: '10', name: 'Crew Neck Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      ]
    },
    { 
      id: '3', 
      name: 'Pants', 
      icon: 'human-male-height', 
      itemCount: 12,
      items: [
        { id: '1', name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
        { id: '2', name: 'Chinos', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
        { id: '3', name: 'Wide-Leg Trousers', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
        { id: '4', name: 'Cargo Pants', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
        { id: '5', name: 'Sweatpants', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop' },
        { id: '6', name: 'Leggings', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
        { id: '7', name: 'Shorts', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
        { id: '8', name: 'Tailored Pants', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
        { id: '9', name: 'Skinny Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
        { id: '10', name: 'Straight Leg Pants', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
        { id: '11', name: 'Joggers', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop' },
        { id: '12', name: 'Track Pants', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop' },
      ]
    },
    { 
      id: '4', 
      name: 'Jackets', 
      icon: 'jacket', 
      itemCount: 9,
      items: [
        { id: '1', name: 'Bomber Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
        { id: '2', name: 'Denim Jacket', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop' },
        { id: '3', name: 'Leather Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
        { id: '4', name: 'Blazer', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
        { id: '5', name: 'Trench Coat', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
        { id: '6', name: 'Windbreaker', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop' },
        { id: '7', name: 'Puffer Jacket', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop' },
        { id: '8', name: 'Cardigan', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
        { id: '9', name: 'Hooded Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
      ]
    },
    { 
      id: '5', 
      name: 'Dresses', 
      icon: 'hanger', 
      itemCount: 7,
      items: [
        { id: '1', name: 'Summer Dress', image: 'https://images.unsplash.com/photo-1594633312681-425a7b93ccfa?w=400&h=400&fit=crop' },
        { id: '2', name: 'Maxi Dress', image: 'https://images.unsplash.com/photo-1594633312681-425a7b93ccfa?w=400&h=400&fit=crop' },
        { id: '3', name: 'Midi Dress', image: 'https://images.unsplash.com/photo-1594633312681-425a7b93ccfa?w=400&h=400&fit=crop' },
        { id: '4', name: 'A-Line Dress', image: 'https://images.unsplash.com/photo-1594633312681-425a7b93ccfa?w=400&h=400&fit=crop' },
        { id: '5', name: 'Wrap Dress', image: 'https://images.unsplash.com/photo-1594633312681-425a7b93ccfa?w=400&h=400&fit=crop' },
        { id: '6', name: 'Bodycon Dress', image: 'https://images.unsplash.com/photo-1594633312681-425a7b93ccfa?w=400&h=400&fit=crop' },
        { id: '7', name: 'Shift Dress', image: 'https://images.unsplash.com/photo-1594633312681-425a7b93ccfa?w=400&h=400&fit=crop' },
      ]
    },
    { 
      id: '6', 
      name: 'Shoes', 
      icon: 'shoe-formal', 
      itemCount: 11,
      items: [
        { id: '1', name: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
        { id: '2', name: 'Loafers', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
        { id: '3', name: 'Boots', image: 'https://images.unsplash.com/photo-1608256246200-53bd35f3f44e?w=400&h=400&fit=crop' },
        { id: '4', name: 'Oxfords', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
        { id: '5', name: 'Sandals', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
        { id: '6', name: 'High Tops', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
        { id: '7', name: 'Running Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
        { id: '8', name: 'Chelsea Boots', image: 'https://images.unsplash.com/photo-1608256246200-53bd35f3f44e?w=400&h=400&fit=crop' },
        { id: '9', name: 'Heels', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
        { id: '10', name: 'Flats', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
        { id: '11', name: 'Ankle Boots', image: 'https://images.unsplash.com/photo-1608256246200-53bd35f3f44e?w=400&h=400&fit=crop' },
      ]
    },
    ];
  }, [showCollectionModal]);

  // Mock data for collection categories - Row 2 (lazy loaded only when modal opens)
  const collectionCategoriesRow2: CategoryData[] = useMemo(() => {
    if (!showCollectionModal) return [];
    return [
    { 
      id: '7', 
      name: 'Accessories', 
      icon: 'necklace', 
      itemCount: 8,
      items: [
        { id: '1', name: 'Silver Necklace', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
        { id: '2', name: 'Gold Chain', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
        { id: '3', name: 'Pearl Necklace', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
        { id: '4', name: 'Choker', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
        { id: '5', name: 'Scarf', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop' },
        { id: '6', name: 'Belt', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=400&h=400&fit=crop' },
        { id: '7', name: 'Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
        { id: '8', name: 'Sunglasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
      ]
    },
    { 
      id: '8', 
      name: 'Bags', 
      icon: 'handbag', 
      itemCount: 9,
      items: [
        { id: '1', name: 'Tote Bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
        { id: '2', name: 'Backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
        { id: '3', name: 'Handbag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
        { id: '4', name: 'Crossbody Bag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
        { id: '5', name: 'Clutch', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
        { id: '6', name: 'Messenger Bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
        { id: '7', name: 'Satchel', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
        { id: '8', name: 'Bucket Bag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
        { id: '9', name: 'Shoulder Bag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
      ]
    },
    { 
      id: '9', 
      name: 'Jewelry', 
      icon: 'diamond-stone', 
      itemCount: 10,
      items: [
        { id: '1', name: 'Diamond Ring', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
        { id: '2', name: 'Gold Bracelet', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
        { id: '3', name: 'Silver Earrings', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
        { id: '4', name: 'Pearl Earrings', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
        { id: '5', name: 'Gold Necklace', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
        { id: '6', name: 'Diamond Pendant', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
        { id: '7', name: 'Silver Bracelet', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
        { id: '8', name: 'Charm Bracelet', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
        { id: '9', name: 'Hoop Earrings', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
        { id: '10', name: 'Tennis Bracelet', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
      ]
    },
    { 
      id: '10', 
      name: 'Hats', 
      icon: 'hat-fedora', 
      itemCount: 7,
      items: [
        { id: '1', name: 'Baseball Cap', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop' },
        { id: '2', name: 'Fedora', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop' },
        { id: '3', name: 'Beanie', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop' },
        { id: '4', name: 'Bucket Hat', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop' },
        { id: '5', name: 'Snapback', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop' },
        { id: '6', name: 'Beret', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop' },
        { id: '7', name: 'Trucker Hat', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop' },
      ]
    },
    { 
      id: '11', 
      name: 'Socks', 
      icon: 'sock', 
      itemCount: 6,
      items: [
        { id: '1', name: 'Ankle Socks', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
        { id: '2', name: 'Crew Socks', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
        { id: '3', name: 'No-Show Socks', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
        { id: '4', name: 'Knee-High Socks', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
        { id: '5', name: 'Athletic Socks', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
        { id: '6', name: 'Dress Socks', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      ]
    },
    ];
  }, [showCollectionModal]);

  // Calculate base outfit length using useMemo to ensure stability
  const baseOutfitLength = useMemo(() => savedOutfits.length, [savedOutfits]);
  const outfitCarouselData: SavedOutfitCarouselItem[] = useMemo(() => {
    if (baseOutfitLength === 0) return [];
    const combined = [
      ...savedOutfits,
      ...savedOutfits,
      ...savedOutfits,
    ];
    return combined.map((item, idx) => ({
      ...item,
      _loopKey: `outfit-${item.id}-${idx}`,
      _baseIndex: idx % baseOutfitLength,
    }));
  }, [savedOutfits, baseOutfitLength]);

  // Initialize vertical scroll positions when modal opens
  useEffect(() => {
    if (showCollectionModal && collectionCategoriesRow1.length > 0 && categoryFlatListRefRow1.current) {
      categoryScrollYRow1.setValue(0);
      categoryFlatListRefRow1.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, [showCollectionModal, collectionCategoriesRow1.length, categoryScrollYRow1]);

  useEffect(() => {
    if (showCollectionModal && collectionCategoriesRow2.length > 0 && categoryFlatListRefRow2.current) {
      categoryFlatListRefRow2.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, [showCollectionModal, collectionCategoriesRow2.length]);

  // Animate Collection Modal
  useEffect(() => {
    if (showCollectionModal) {
      collectionModalTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      collectionModalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      collectionModalTranslateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      collectionModalOpacity.value = withTiming(0, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCollectionModal]);

  // Animate Calendar Modal
  useEffect(() => {
    if (showCalendarModal) {
      calendarModalTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      calendarModalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      calendarModalTranslateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      calendarModalOpacity.value = withTiming(0, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCalendarModal]);

  // Animate Add to Calendar Modal
  useEffect(() => {
    if (showAddToCalendarModal) {
      addToCalendarModalTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      addToCalendarModalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      addToCalendarModalTranslateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      addToCalendarModalOpacity.value = withTiming(0, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddToCalendarModal]);

  // Animate View All Modal
  useEffect(() => {
    if (showViewAllModal) {
      viewAllModalTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      viewAllModalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      viewAllModalTranslateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      viewAllModalOpacity.value = withTiming(0, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showViewAllModal]);

  // Animate Date Outfit Modal
  useEffect(() => {
    if (showDateOutfitModal) {
      dateOutfitModalTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      dateOutfitModalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      dateOutfitModalTranslateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      dateOutfitModalOpacity.value = withTiming(0, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDateOutfitModal]);

  // Animate Chatbot Modal
  useEffect(() => {
    if (showChatbotModal) {
      chatbotModalTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      chatbotModalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      chatbotModalTranslateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      chatbotModalOpacity.value = withTiming(0, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChatbotModal]);

  // Animate Outfit Preview Modal
  useEffect(() => {
    if (showOutfitPreviewModal) {
      outfitPreviewModalTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      outfitPreviewModalOpacity.value = withTiming(1, { duration: 300 });
    } else {
      outfitPreviewModalTranslateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      });
      outfitPreviewModalOpacity.value = withTiming(0, { duration: 300 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOutfitPreviewModal]);

  const stopOutfitAutoPlay = React.useCallback(() => {
    if (outfitAutoIntervalRef.current) {
      clearInterval(outfitAutoIntervalRef.current);
      outfitAutoIntervalRef.current = null;
    }
  }, []);

  const startOutfitAutoPlay = React.useCallback(() => {
    // Auto-scrolling disabled
    return;
  }, []);

  // Defer heavy rendering until after interactions complete
  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => {
      interaction.cancel();
    };
  }, []);

  useEffect(() => {
    if (baseOutfitLength === 0 || !outfitFlatListRef.current) return;
    if (!isReady) return; // Don't initialize until ready
    const startRawIndex = baseOutfitLength;
    outfitRawIndexRef.current = startRawIndex;
    const startOffset = startRawIndex * OUTFIT_CARD_FULL_WIDTH;
    outfitFlatListRef.current.scrollToOffset({
      offset: startOffset,
      animated: false,
    });
    setFocusedOutfitIndex(0);
    
    // Auto-scrolling disabled - removed autoplay start
    
    return () => {
      stopOutfitAutoPlay();
    };
  }, [baseOutfitLength, startOutfitAutoPlay, stopOutfitAutoPlay, isReady]);

  const renderCategoryCardRow1 = React.useCallback(({ item, index }: { item: CategoryData; index: number }) => {
    const inputRange = [
      (index - 2) * CATEGORY_CARD_VERTICAL_FULL_HEIGHT,
      (index - 1) * CATEGORY_CARD_VERTICAL_FULL_HEIGHT,
      index * CATEGORY_CARD_VERTICAL_FULL_HEIGHT,
      (index + 1) * CATEGORY_CARD_VERTICAL_FULL_HEIGHT,
      (index + 2) * CATEGORY_CARD_VERTICAL_FULL_HEIGHT,
    ];

    const scale = categoryScrollYRow1.interpolate({
      inputRange,
      outputRange: [0.65, 0.75, 1.06, 0.75, 0.65],
      extrapolate: 'clamp',
    });

    const opacity = categoryScrollYRow1.interpolate({
      inputRange,
      outputRange: [0.3, 0.5, 1, 0.5, 0.3],
      extrapolate: 'clamp',
    });

    const gradientColors = gradientPalettes[index % gradientPalettes.length];
    
    return (
      <AnimatedTouchableOpacity
        style={[
          styles.categoryCardVertical,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => {
          setShowCollectionModal(false);
          navigation?.navigate('Closet', { categoryData: item });
        }}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.categoryCardGradientHeader}
        />
        <View style={styles.categoryHeaderVertical}>
          <View style={styles.categoryIconContainerVertical}>
            <Icon name={item.icon} size={28} color="#000000" />
            <TouchableOpacity 
              style={styles.categoryAddButton}
              onPress={(e) => {
                e.stopPropagation();
                setShowCollectionModal(false);
                navigation?.navigate('Camera');
              }}
            >
              <Icon name="plus" size={14} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryTextContainer}>
            <Text style={styles.categoryNameVertical}>{item.name}</Text>
            <Text style={styles.categoryCountVertical}>{item.itemCount} items</Text>
          </View>
        </View>
      </AnimatedTouchableOpacity>
    );
  }, [navigation, categoryScrollYRow1]);

  const renderCategoryCardHorizontal = React.useCallback(({ item, index }: { item: CategoryData; index: number }) => {
    const gradientColors = gradientPalettes[index % gradientPalettes.length];

    return (
      <TouchableOpacity
        style={styles.categoryCardHorizontal}
        activeOpacity={0.8}
        onPress={() => {
          setShowCollectionModal(false);
          navigation?.navigate('Closet', { categoryData: item });
        }}
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.categoryCardGradientHeaderHorizontal}
        />
        <View style={styles.categoryHeaderHorizontal}>
          <View style={styles.categoryIconContainerHorizontal}>
            <Icon name={item.icon} size={24} color="#000000" />
            <TouchableOpacity 
              style={styles.categoryAddButtonHorizontal}
              onPress={(e) => {
                e.stopPropagation();
                setShowCollectionModal(false);
                navigation?.navigate('Camera');
              }}
            >
              <Icon name="plus" size={12} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryTextContainerHorizontal}>
            <Text style={styles.categoryNameHorizontal} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.categoryCountHorizontal}>{item.itemCount} items</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigation]);

  const renderOutfitCard = React.useCallback(({ item, index }: { item: SavedOutfitCarouselItem; index: number }) => {
    const meta = item.items.slice(0, 2).join(' · ');

    return (
      <TouchableOpacity
        style={styles.myOutfitCard}
        activeOpacity={0.9}
        onPress={() => navigation?.navigate('Studio')}
      >
        {/* Simple Background - replaced BlurView for better performance */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 252, 241, 0.95)', borderRadius: 28 }]} />
        {/* Glossy Overlay */}
        <View style={styles.glossyOverlay} />
        {/* Card Content */}
        <View style={styles.outfitCardContent}>
          <View style={styles.outfitArcIcon}>
            <Icon name="hanger" size={26} color="#000000" />
          </View>
          <Text style={styles.outfitArcName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.outfitArcMeta} numberOfLines={1}>{meta}</Text>
        </View>
      </TouchableOpacity>
    );
  }, [navigation]);


  // Helper function to format collection data for AI context
  const getFormattedCollectionData = useCallback((): string => {
    const allCategories = [...collectionCategoriesRow1, ...collectionCategoriesRow2];
    
    if (allCategories.length === 0) {
      return 'No items in collection yet.';
    }

    const formattedData = allCategories.map(category => {
      const itemNames = category.items.map(item => item.name).join(', ');
      return `${category.name}: ${itemNames}`;
    }).join('\n');

    return formattedData;
  }, [collectionCategoriesRow1, collectionCategoriesRow2]);

  // Helper function to parse markdown and return formatted Text components
  const parseMarkdown = (text: string, isUser: boolean): React.ReactNode[] => {
    if (!text) return [];
    
    // Remove all markdown asterisks and return clean text
    // This removes **bold** and *italic* markdown, keeping only the text content
    const cleanedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** but keep text
      .replace(/\*(.*?)\*/g, '$1'); // Remove *italic* but keep text
    
    return [
      <Text key="text-0" style={isUser ? styles.userMessageText : styles.botMessageText}>
        {cleanedText}
      </Text>
    ];
  };

  // Helper function to detect if query is asking to show items
  const detectShowRequest = (query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    const showKeywords = ['show', 'display', 'view', 'see', 'list'];
    return showKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  // Helper function to extract category name from query
  const extractCategory = useCallback((query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    const allCategories = [...collectionCategoriesRow1, ...collectionCategoriesRow2];
    
    // Try to find category name in query
    for (const category of allCategories) {
      const categoryLower = category.name.toLowerCase();
      // Check if category name appears in query
      if (lowerQuery.includes(categoryLower)) {
        return category.name;
      }
    }
    
    // Also check for common variations
    const categoryVariations: { [key: string]: string } = {
      'shirt': 'Shirts',
      'tshirt': 'Tshirts',
      't-shirt': 'Tshirts',
      'tee': 'Tshirts',
      'pant': 'Pants',
      'trouser': 'Pants',
      'shoe': 'Shoes',
      'sneaker': 'Sneakers',
      'jacket': 'Jackets',
      'coat': 'Jackets',
      'dress': 'Dresses',
      'accessory': 'Accessories',
      'bag': 'Bags',
      'jewelry': 'Jewelry',
      'jewellery': 'Jewelry',
      'hat': 'Hats',
      'sock': 'Socks',
    };
    
    for (const [variation, categoryName] of Object.entries(categoryVariations)) {
      if (lowerQuery.includes(variation)) {
        return categoryName;
      }
    }
    
    return null;
  }, [collectionCategoriesRow1, collectionCategoriesRow2]);

  // Helper function to find collection items by category
  const findCollectionItems = useCallback((categoryName: string): CollectionItem[] => {
    const allCategories = [...collectionCategoriesRow1, ...collectionCategoriesRow2];
    const category = allCategories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.items : [];
  }, [collectionCategoriesRow1, collectionCategoriesRow2]);

  // Helper function to create image messages from collection items
  const createImageMessages = (items: CollectionItem[], categoryName: string): ChatMessage[] => {
    if (items.length === 0) {
      return [{
        id: Date.now().toString(),
        text: `I couldn't find any ${categoryName} in your collection.`,
        isUser: false,
        timestamp: new Date(),
      }];
    }

    const messages: ChatMessage[] = [];
    
    // First message with text - styled as header
    messages.push({
      id: Date.now().toString(),
      text: `📸 Here are your ${categoryName} (${items.length} ${items.length === 1 ? 'item' : 'items'}):`,
      isUser: false,
      timestamp: new Date(),
    });

    // Create a message for each item with its image
    items.forEach((item, index) => {
      messages.push({
        id: (Date.now() + index + 1).toString(),
        text: item.name,
        isUser: false,
        timestamp: new Date(),
        imageUri: item.image,
      });
    });

    return messages;
  };


  const parseOutfitDate = (dateString: string): Date | null => {
    try {
      // Handle formats like "Dec 5, 2024" or "April 11, 2025"
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date;
    } catch {
      return null;
    }
  };

  const getOutfitsForDate = useCallback((year: number, month: number, day: number): SavedOutfit[] => {
    return savedOutfits.filter(outfit => {
      const outfitDate = parseOutfitDate(outfit.date);
      if (!outfitDate) return false;
      return outfitDate.getFullYear() === year &&
             outfitDate.getMonth() === month &&
             outfitDate.getDate() === day;
    });
  }, [savedOutfits]);

  const parseCalendarDayDate = (dateString: string): { year: number; month: number; day: number } | null => {
    try {
      // Parse date like "Dec 6" to get full date
      const today = new Date();
      const year = today.getFullYear();
      const date = new Date(`${dateString}, ${year}`);
      if (isNaN(date.getTime())) return null;
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
      };
    } catch {
      return null;
    }
  };

  const getOutfitsForCalendarDay = useCallback((day: DayData): SavedOutfit[] => {
    const parsedDate = parseCalendarDayDate(day.date);
    if (!parsedDate) return [];
    return getOutfitsForDate(parsedDate.year, parsedDate.month, parsedDate.day);
  }, [getOutfitsForDate]);

  // Pre-calculate calendar days with outfits to avoid expensive calls during render
  // Only compute when calendar section is visible (isReady) or when modal is open
  const calendarDaysWithOutfits = useMemo(() => {
    if (!isReady && !showCalendarModal) return [];
    return calendarDays.map((day) => {
      const dayOutfits = getOutfitsForCalendarDay(day);
      const firstOutfit = dayOutfits.length > 0 ? dayOutfits[0] : null;
      return {
        ...day,
        dayOutfits,
        firstOutfit,
      };
    });
  }, [calendarDays, isReady, showCalendarModal, getOutfitsForCalendarDay]);

  const generateCalendarDays = useCallback((): CalendarDay[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Add days from previous month
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        outfits: []
      });
    }

    // Add days from current month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day &&
                     today.getMonth() === currentMonth &&
                     today.getFullYear() === currentYear;
      const outfits = getOutfitsForDate(currentYear, currentMonth, day);
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        outfits
      });
    }

    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        outfits: []
      });
    }

    return days;
  }, [currentYear, currentMonth, getOutfitsForDate]);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleOutfitSelectForCalendar = (outfit: SavedOutfit) => {
    // If there's a selected calendar date (from date modal), assign directly
    if (selectedCalendarDate) {
      const dateString = `${monthNames[selectedCalendarDate.month]} ${selectedCalendarDate.day}, ${selectedCalendarDate.year}`;
      setSavedOutfits(prevOutfits => 
        prevOutfits.map(o => 
          o.id === outfit.id 
            ? { ...o, date: dateString }
            : o
        )
      );
      setShowAddToCalendarModal(false);
      setSelectedCalendarDate(null);
    } else {
      // Otherwise, open calendar to select a date
      setSelectedOutfitForDate(outfit);
      setShowAddToCalendarModal(false);
      setShowCalendarModal(true);
    }
  };

  const handleDateSelectForOutfit = (year: number, month: number, day: number) => {
    if (selectedOutfitForDate) {
      // Update outfit date
      const dateString = `${monthNames[month]} ${day}, ${year}`;
      
      // Update the savedOutfits array with the new date
      setSavedOutfits(prevOutfits => 
        prevOutfits.map(outfit => 
          outfit.id === selectedOutfitForDate.id 
            ? { ...outfit, date: dateString }
            : outfit
        )
      );
      
      // Reset states
      setSelectedOutfitForDate(null);
      setShowCalendarModal(false);
    }
  };

  const handleCalendarDateClick = (calendarDay: CalendarDay) => {
    if (calendarDay.isCurrentMonth) {
      setSelectedCalendarDate({
        year: currentYear,
        month: currentMonth,
        day: calendarDay.day
      });
      setShowDateOutfitModal(true);
    }
  };

  // Memoize generateCalendarDays to prevent expensive recalculation on every render
  const generatedCalendarDays = useMemo(() => generateCalendarDays(), [generateCalendarDays]);

  // API Configuration - imported from config file (uses environment variables with fallback)

  // Image picker handler
  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as PhotoQuality,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: true, // Request base64 data directly
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const imageUri = asset.uri;
        const base64 = asset.base64;
        
        if (imageUri) {
          // Create message with image
          const imageMessage: ChatMessage = {
            id: Date.now().toString(),
            text: chatInput.trim() || 'Check this outfit',
            isUser: true,
            timestamp: new Date(),
            imageUri: imageUri,
          };
          
          setChatMessages(prev => [...prev, imageMessage]);
          const messageText = chatInput.trim() || 'What do you think about this outfit?';
          setChatInput('');
          setIsTyping(true);
          
          // Send image to API
          if (base64) {
            handleSendMessageWithImage(base64, messageText);
          } else {
            // Fallback: convert URI to base64
            imageToBase64(imageUri)
              .then(base64Data => {
                handleSendMessageWithImage(base64Data, messageText);
              })
              .catch(() => {
                setIsTyping(false);
                Alert.alert('Error', 'Failed to process image. Please try again.');
              });
          }
        }
      }
    });
  };

  // Convert image to base64 for API
  const imageToBase64 = async (uri: string): Promise<string> => {
    try {
      // For React Native, we can use fetch to get the image and convert to base64
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Remove data URL prefix (data:image/jpeg;base64,)
          const base64String = result.split(',')[1] || result;
          resolve(base64String);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read image'));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Image conversion error:', error);
      throw new Error('Failed to convert image to base64');
    }
  };

  // Chatbot API function with image support
  const generateBotResponse = async (userMessage: string, imageBase64?: string): Promise<string> => {
    try {
      // Check if API key is configured
      if (!GEMINI_API_KEY) {
        throw new Error('API key is not configured. Please set GEMINI_API_KEY in .env file.');
      }

      // Create context about user's wardrobe
      const userOutfits = savedOutfits.map(outfit => 
        `${outfit.name}: ${outfit.items.join(', ')}`
      ).join('\n');

      // Get formatted collection data
      const collectionData = getFormattedCollectionData();

      const systemPrompt = `You are a helpful Fashion Advisor assistant. Help users with outfit suggestions, style tips, color coordination, and fashion advice based on their actual wardrobe collection.

IMPORTANT: When users ask about specific items in their wardrobe (e.g., "what are black striped shirts", "do I have any jeans", "show me my jackets"), you MUST search through the COLLECTION ITEMS list below and provide accurate information based on what they actually own. Only mention items that exist in their collection.

USER'S COLLECTION ITEMS:
${collectionData}

USER'S SAVED OUTFITS:
${userOutfits || 'No outfits saved yet'}

INSTRUCTIONS:
- When asked about specific items, search the COLLECTION ITEMS and respond with what they actually have
- Suggest outfit combinations using items from their COLLECTION ITEMS
- Provide helpful, concise, and friendly fashion advice
- Keep responses under 200 words and be conversational
- If an item is not in their collection, politely let them know they don't have it`;

      const parts: any[] = [
        {
          text: `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
        }
      ];

      // Add image if provided
      if (imageBase64) {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64
          }
        });
      }

      // Use vision model if image is present, otherwise use text model
      const baseApiUrl = imageBase64 ? GEMINI_API_URL_VISION : GEMINI_API_URL_TEXT;
      // Construct API URL with key as query parameter
      const apiUrl = `${baseApiUrl}?key=${GEMINI_API_KEY}`;
      
      const requestBody: any = {
        contents: [
          {
            parts: parts
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      console.log('API URL:', apiUrl);
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          console.error('API Error Text:', errorText);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const botResponse = data.candidates[0].content.parts[0].text;
        return botResponse.trim();
      } else {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid API response format');
      }
    } catch (error: any) {
      console.error('Chat API Error:', error);
      // Fallback response on error
      return `I apologize, but I'm having trouble connecting right now. Please try again in a moment. ${error.message ? `(Error: ${error.message})` : ''}`;
    }
  };

  // Handle sending message with image
  const handleSendMessageWithImage = async (imageBase64: string, messageText: string) => {
    try {
      const botResponseText = await generateBotResponse(messageText, imageBase64);
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, botResponse]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing the image. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const query = chatInput.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: query,
      isUser: true,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    
    try {
      // Check if user is asking to show items
      if (detectShowRequest(query)) {
        const categoryName = extractCategory(query);
        
        if (categoryName) {
          const items = findCollectionItems(categoryName);
          const imageMessages = createImageMessages(items, categoryName);
          
          // Add all image messages
          setChatMessages(prev => [...prev, ...imageMessages]);
          
          // Also get AI response for additional context
          try {
            const botResponseText = await generateBotResponse(query);
            const botResponse: ChatMessage = {
              id: (Date.now() + imageMessages.length + 1).toString(),
              text: botResponseText,
              isUser: false,
              timestamp: new Date(),
            };
            setChatMessages(prev => [...prev, botResponse]);
          } catch {
            // If AI response fails, that's okay - we already showed images
          }
        } else {
          // Show request but category not found, get AI response
          const botResponseText = await generateBotResponse(query);
          const botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: botResponseText,
            isUser: false,
            timestamp: new Date(),
          };
          setChatMessages(prev => [...prev, botResponse]);
        }
      } else {
        // Normal query, get AI response
        const botResponseText = await generateBotResponse(query);
        
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponseText,
          isUser: false,
          timestamp: new Date(),
        };
        
        setChatMessages(prev => [...prev, botResponse]);
      }
    } catch {
      // Error handling
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickSuggestion = async (suggestion: string) => {
    // Send quick suggestion directly
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: suggestion,
      isUser: true,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Check if suggestion is asking to show items
      if (detectShowRequest(suggestion)) {
        const categoryName = extractCategory(suggestion);
        
        if (categoryName) {
          const items = findCollectionItems(categoryName);
          const imageMessages = createImageMessages(items, categoryName);
          
          // Add all image messages
          setChatMessages(prev => [...prev, ...imageMessages]);
          
          // Also get AI response for additional context
          try {
            const botResponseText = await generateBotResponse(suggestion);
            const botResponse: ChatMessage = {
              id: (Date.now() + imageMessages.length + 1).toString(),
              text: botResponseText,
              isUser: false,
              timestamp: new Date(),
            };
            setChatMessages(prev => [...prev, botResponse]);
          } catch {
            // If AI response fails, that's okay - we already showed images
          }
        } else {
          // Show request but category not found, get AI response
          const botResponseText = await generateBotResponse(suggestion);
          const botResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: botResponseText,
            isUser: false,
            timestamp: new Date(),
          };
          setChatMessages(prev => [...prev, botResponse]);
        }
      } else {
        // Normal query, get AI response
        const botResponseText = await generateBotResponse(suggestion);
        
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponseText,
          isUser: false,
          timestamp: new Date(),
        };
        
        setChatMessages(prev => [...prev, botResponse]);
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new message is added
    if (chatScrollViewRef.current) {
      setTimeout(() => {
        chatScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages, isTyping]);

  // Animated styles for Collection Modal
  const collectionModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: collectionModalTranslateY.value }],
    };
  });

  const collectionBackdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: collectionModalOpacity.value,
    };
  });

  // Animated styles for Calendar Modal
  const calendarModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: calendarModalTranslateY.value }],
    };
  });

  const calendarBackdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: calendarModalOpacity.value,
    };
  });

  // Animated styles for Add to Calendar Modal
  const addToCalendarModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: addToCalendarModalTranslateY.value }],
    };
  });

  const addToCalendarBackdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: addToCalendarModalOpacity.value,
    };
  });

  // Animated styles for View All Modal
  const viewAllModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: viewAllModalTranslateY.value }],
    };
  });

  const viewAllBackdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: viewAllModalOpacity.value,
    };
  });

  // Animated styles for Date Outfit Modal
  const dateOutfitModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: dateOutfitModalTranslateY.value }],
    };
  });

  const dateOutfitBackdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: dateOutfitModalOpacity.value,
    };
  });

  // Animated styles for Chatbot Modal
  const chatbotModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: chatbotModalTranslateY.value }],
    };
  });

  const chatbotBackdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: chatbotModalOpacity.value,
    };
  });

  // Animated styles for Outfit Preview Modal
  const outfitPreviewModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: outfitPreviewModalTranslateY.value }],
    };
  });

  const outfitPreviewBackdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: outfitPreviewModalOpacity.value,
    };
  });

  // Button animated styles
  const createOutfitButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: createOutfitButtonScale.value }],
    };
  });

  const addToCalendarButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: addToCalendarButtonScale.value }],
    };
  });

  const myCollectionButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: myCollectionButtonScale.value }],
    };
  });

  const chatbotTriggerButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: chatbotTriggerButtonScale.value }],
    };
  });

  // Button press handlers with smooth animations
  const handleCreateOutfitPress = () => {
    createOutfitButtonScale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
    createOutfitButtonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    navigation?.navigate('Studio');
  };

  const handleAddToCalendarPress = () => {
    addToCalendarButtonScale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
    addToCalendarButtonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    setShowAddToCalendarModal(true);
  };

  const handleMyCollectionPress = () => {
    myCollectionButtonScale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
    myCollectionButtonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    setShowCollectionModal(true);
  };

  const handleChatbotTriggerPress = () => {
    chatbotTriggerButtonScale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
    chatbotTriggerButtonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    setShowChatbotModal(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FDFF8D', '#FFFCF1']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.backgroundGradient}
      />
      
      <ScrollView 
        style={styles.scrollViewContainer} 
        contentContainerStyle={styles.content}
        removeClippedSubviews={true}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        overScrollMode={Platform.OS === 'android' ? 'never' : undefined}
        disableIntervalMomentum={true}
        decelerationRate="normal"
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="never"
      >
        {/* Header */}
        <View style={styles.header}>
        <Image source={ClosetLogo} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.mainText}>Create your own outfit with items from your closet</Text>
      </View>

      {/* Main Action Section */}
      <View style={styles.mainSection}>
        
        <View style={styles.actionButtons}>
          {/* Create outfit button */}
          <Reanimated.View style={createOutfitButtonAnimatedStyle}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCreateOutfitPress}
              activeOpacity={1}
            >
              <View style={[styles.actionButtonCircle, styles.actionButtonCircleBlack]}>
                <View style={styles.iconWithPlus}>
                  <Icon name="hanger" size={28} color="#000000" />
                  <View style={styles.plusIconSmall}>
                    <Icon name="plus" size={12} color="#000000" />
                  </View>
                </View>
              </View>
              <Text style={styles.actionButtonLabel}>Create outfit</Text>
            </TouchableOpacity>
          </Reanimated.View>

          {/* Add to calendar button */}
          <Reanimated.View style={addToCalendarButtonAnimatedStyle}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAddToCalendarPress}
              activeOpacity={1}
            >
              <View style={[styles.actionButtonCircle, styles.actionButtonCircleWhite]}>
                <View style={styles.iconWithPlus}>
                  <Icon name="calendar-outline" size={28} color="#000000" />
                  <View style={styles.plusIconSmall}>
                    <Icon name="plus" size={12} color="#000000" />
                  </View>
                </View>
              </View>
              <Text style={styles.actionButtonLabel}>Add to calendar</Text>
            </TouchableOpacity>
          </Reanimated.View>

          {/* My collection button */}
          <Reanimated.View style={myCollectionButtonAnimatedStyle}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleMyCollectionPress}
              activeOpacity={1}
            >
              <View style={[styles.actionButtonCircle, styles.actionButtonCircleWhite]}>
                <View style={styles.iconWithPlus}>
                  <Icon name="folder-multiple" size={28} color="#000000" />
                  <View style={styles.plusIconSmall}>
                    <Icon name="plus" size={12} color="#000000" />
                  </View>
                </View>
              </View>
              <Text style={styles.actionButtonLabel}>My collection</Text>
            </TouchableOpacity>
          </Reanimated.View>
        </View>
      </View>

      {/* AI Fashion Advisor Trigger Button */}
      <Reanimated.View style={chatbotTriggerButtonAnimatedStyle}>
        <TouchableOpacity
          style={styles.chatbotTriggerButton}
          onPress={handleChatbotTriggerPress}
          activeOpacity={1}
        >
        <View style={styles.chatbotTriggerContent}>
          <View style={styles.chatbotTriggerIconContainer}>
            <Icon name="robot" size={24} color="#000000" />
          </View>
          <Text style={styles.chatbotTriggerText}>Snixxy</Text>
          <Icon name="chevron-right" size={20} color="#000000" />
        </View>
      </TouchableOpacity>
      </Reanimated.View>

      {/* My Outfits Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MY OUTFITS</Text>
          <TouchableOpacity onPress={() => setShowViewAllModal(true)}>
            <Text style={styles.viewAllLink}>View All &gt;</Text>
          </TouchableOpacity>
        </View>
        {isReady ? (
          <Circular3DOutfitCards 
            outfits={savedOutfits} 
            navigation={navigation}
            onOutfitSelect={(outfit) => {
              setSelectedOutfitForPreview(outfit);
              setShowOutfitPreviewModal(true);
            }}
          />
        ) : (
          <View style={[styles.myOutfitsContainer, { paddingHorizontal: OUTFIT_CAROUSEL_SIDE_PADDING, height: 380, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="small" color="#000000" />
          </View>
        )}
      </View>

      {/* Outfit Calendar Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Outfit calendar</Text>
          <TouchableOpacity onPress={() => setShowCalendarModal(true)}>
            <Text style={styles.viewCalendarLink}>View Calendar &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Days Scrollable List with Integrated Outfit Cards */}
        {isReady ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysContainer}
            nestedScrollEnabled={true}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            disableIntervalMomentum={true}
            decelerationRate="fast"
          >
            {calendarDaysWithOutfits.map((day: DayData & { dayOutfits: SavedOutfit[]; firstOutfit: SavedOutfit | null }) => (
              <TouchableOpacity
                key={day.id}
                style={styles.dayItem}
                onPress={() => {
                  if (day.firstOutfit) {
                    navigation?.navigate('Studio');
                  } else {
                    setShowAddToCalendarModal(true);
                  }
                }}
              >
                {day.isToday && <View style={styles.todayDot} />}
                <Text style={[styles.dayText, day.isToday && styles.dayTextToday]}>{day.day}</Text>
                <Text style={[styles.dateText, day.isToday && styles.dateTextToday]}>{day.date}</Text>
                <View style={styles.weatherContainer}>
                  <Icon name="weather-sunny" size={16} color="#000000" />
                  <Text style={styles.tempText}>{day.tempHigh} {day.tempLow}</Text>
                </View>
                
                {/* Outfit Section */}
                <View style={styles.dayItemOutfitSection}>
                  {day.firstOutfit ? (
                    <View style={styles.calendarOutfitNameContainer}>
                      <Icon name="hanger" size={16} color="#000000" />
                      <Text style={styles.calendarOutfitName} numberOfLines={1}>{day.firstOutfit.name}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.emptyOutfitCard}
                      onPress={(e) => {
                        e.stopPropagation();
                        setShowAddToCalendarModal(true);
                      }}
                    >
                      <Icon name="calendar-plus" size={24} color="#CCCCCC" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.daysContainer, { height: 120, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="small" color="#000000" />
          </View>
        )}
      </View>

      {/* My Collection Modal */}
      <Modal
        visible={showCollectionModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowCollectionModal(false)}
      >
        <Reanimated.View style={[styles.modalOverlay, collectionBackdropAnimatedStyle]}>
          <BlurView
            blurType="dark"
            blurAmount={30}
            style={StyleSheet.absoluteFill}
            reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
          />
          <View style={styles.darkOverlay} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowCollectionModal(false)}
          />
          {isLiquidGlassSupported ? (
            <LiquidGlassView
              style={styles.collectionModalGlass}
              effect="regular"
              tintColor="rgba(255, 255, 255, 0.15)"
              colorScheme="dark"
              interactive={true}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.05)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.modalGradientOverlay}
              />
              <Reanimated.View style={[styles.collectionModalContent, collectionModalAnimatedStyle]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>My Collection</Text>
                  <TouchableOpacity 
                    onPress={() => setShowCollectionModal(false)}
                    style={styles.closeButton}
                  >
                    <Icon name="close" size={24} color="#000000" />
                  </TouchableOpacity>
                </View>

            {/* Row 1 - Categories */}
            <View style={styles.collectionRow}>
              <Text style={styles.collectionRowTitle}>Categories</Text>
              <Animated.FlatList
                ref={categoryFlatListRefRow1}
                data={collectionCategoriesRow1}
                keyExtractor={(item) => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderCategoryCardRow1}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: categoryScrollYRow1 } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={1}
                snapToInterval={CATEGORY_CARD_VERTICAL_FULL_HEIGHT}
                snapToAlignment="center"
                decelerationRate={0.88}
                disableIntervalMomentum={true}
                bounces={false}
                contentContainerStyle={[
                  styles.categoryVerticalContainer,
                  { paddingVertical: CATEGORY_CAROUSEL_VERTICAL_PADDING },
                ]}
                getItemLayout={(_, index) => ({
                  length: CATEGORY_CARD_VERTICAL_FULL_HEIGHT,
                  offset: CATEGORY_CARD_VERTICAL_FULL_HEIGHT * index,
                  index,
                })}
                removeClippedSubviews={false}
              />
            </View>

            {/* Row 2 - Other Categories */}
            <View style={styles.collectionRowHorizontal}>
              <Text style={styles.collectionRowTitle}>Other Categories</Text>
              <FlatList
                ref={categoryFlatListRefRow2}
                data={collectionCategoriesRow2}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={renderCategoryCardHorizontal}
                contentContainerStyle={styles.categoryHorizontalContainer}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                getItemLayout={(_, index) => ({
                  length: CATEGORY_CARD_HORIZONTAL_FULL_WIDTH,
                  offset: CATEGORY_CARD_HORIZONTAL_FULL_WIDTH * index,
                  index,
                })}
                removeClippedSubviews={false}
              />
            </View>
              </Reanimated.View>
            </LiquidGlassView>
          ) : (
            <Reanimated.View style={[styles.collectionModalContent, collectionModalAnimatedStyle]}>
              <BlurView
                blurType="dark"
                blurAmount={20}
                style={StyleSheet.absoluteFill}
                reducedTransparencyFallbackColor="rgba(26, 26, 26, 0.95)"
              />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.05)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>My Collection</Text>
                <TouchableOpacity 
                  onPress={() => setShowCollectionModal(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#000000" />
                </TouchableOpacity>
              </View>

            {/* Row 1 - Categories */}
            <View style={styles.collectionRow}>
              <Text style={styles.collectionRowTitle}>Categories</Text>
              <Animated.FlatList
                ref={categoryFlatListRefRow1}
                data={collectionCategoriesRow1}
                keyExtractor={(item) => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                renderItem={renderCategoryCardRow1}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: categoryScrollYRow1 } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={1}
                snapToInterval={CATEGORY_CARD_VERTICAL_FULL_HEIGHT}
                snapToAlignment="center"
                decelerationRate={0.88}
                disableIntervalMomentum={true}
                bounces={false}
                contentContainerStyle={[
                  styles.categoryVerticalContainer,
                  { paddingVertical: CATEGORY_CAROUSEL_VERTICAL_PADDING },
                ]}
                getItemLayout={(_, index) => ({
                  length: CATEGORY_CARD_VERTICAL_FULL_HEIGHT,
                  offset: CATEGORY_CARD_VERTICAL_FULL_HEIGHT * index,
                  index,
                })}
                removeClippedSubviews={false}
              />
            </View>

            {/* Row 2 - Other Categories */}
            <View style={styles.collectionRowHorizontal}>
              <Text style={styles.collectionRowTitle}>Other Categories</Text>
              <FlatList
                ref={categoryFlatListRefRow2}
                data={collectionCategoriesRow2}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={renderCategoryCardHorizontal}
                contentContainerStyle={styles.categoryHorizontalContainer}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                getItemLayout={(_, index) => ({
                  length: CATEGORY_CARD_HORIZONTAL_FULL_WIDTH,
                  offset: CATEGORY_CARD_HORIZONTAL_FULL_WIDTH * index,
                  index,
                })}
                removeClippedSubviews={false}
              />
            </View>
            </Reanimated.View>
          )}
        </Reanimated.View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendarModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <Reanimated.View style={[styles.modalOverlay, calendarBackdropAnimatedStyle]}>
          <BlurView
            blurType="dark"
            blurAmount={20}
            style={StyleSheet.absoluteFill}
            reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
          />
          <View style={styles.darkOverlay} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowCalendarModal(false)}
          />
          <Reanimated.View style={[styles.calendarModalContent, calendarModalAnimatedStyle]}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity 
                onPress={() => setShowCalendarModal(false)}
                style={styles.calendarBackButton}
              >
                <Icon name="arrow-left" size={24} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.calendarMonthYear}>
                <Text style={styles.calendarMonthYearText}>
                  {monthNames[currentMonth]} {currentYear} ▼
                </Text>
              </TouchableOpacity>
              <View style={styles.calendarHeaderIcons}>
                <TouchableOpacity style={styles.calendarHeaderIcon}>
                  <Icon name="calendar" size={24} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.calendarHeaderIcon}>
                  <Icon name="view-grid" size={24} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Selected Outfit Indicator */}
            {selectedOutfitForDate && (
              <View style={styles.selectedOutfitBanner}>
                <View style={styles.selectedOutfitBannerContent}>
                  <Icon name="hanger" size={20} color="#000000" />
                  <Text style={styles.selectedOutfitBannerText}>
                    Select a date to assign "{selectedOutfitForDate.name}"
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setSelectedOutfitForDate(null)}
                    style={styles.selectedOutfitBannerClose}
                  >
                    <Icon name="close" size={18} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Calendar Navigation */}
            <View style={styles.calendarNav}>
              <TouchableOpacity onPress={handlePreviousMonth} style={styles.calendarNavButton}>
                <Icon name="chevron-left" size={24} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextMonth} style={styles.calendarNavButton}>
                <Icon name="chevron-right" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Week Days Header */}
            <View style={styles.weekDaysHeader}>
              {weekDays.map((day) => (
                <View key={day} style={styles.weekDayCell}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <ScrollView style={styles.calendarGridContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.calendarGrid}>
                {generatedCalendarDays.map((calendarDay, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDayCell,
                      !calendarDay.isCurrentMonth && styles.calendarDayCellOtherMonth,
                      calendarDay.isToday && styles.calendarDayCellToday
                    ]}
                    onPress={() => {
                      if (selectedOutfitForDate && calendarDay.isCurrentMonth) {
                        // Assign selected outfit to this date
                        handleDateSelectForOutfit(currentYear, currentMonth, calendarDay.day);
                      } else {
                        // Show outfits for this date or allow selection
                        handleCalendarDateClick(calendarDay);
                      }
                    }}
                  >
                    <Text style={[
                      styles.calendarDayNumber,
                      !calendarDay.isCurrentMonth && styles.calendarDayNumberOtherMonth,
                      calendarDay.isToday && styles.calendarDayNumberToday
                    ]}>
                      {calendarDay.day}
                    </Text>
                    {calendarDay.outfits.length > 0 && (
                      <View style={styles.calendarDayOutfits}>
                        {calendarDay.outfits.slice(0, 3).map((outfit) => (
                          <View key={outfit.id} style={styles.calendarOutfitThumbnail}>
                            <Icon name="hanger" size={12} color="#000000" />
                          </View>
                        ))}
                        {calendarDay.outfits.length > 3 && (
                          <View style={styles.calendarOutfitMore}>
                            <Text style={styles.calendarOutfitMoreText}>+{calendarDay.outfits.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Outfit Cards Section */}
            <View style={styles.calendarOutfitCardsSection}>
              <Text style={styles.calendarOutfitCardsTitle}>Outfits</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.calendarOutfitCardsContainer}
              >
                {generatedCalendarDays.filter(day => day.isCurrentMonth).map((calendarDay, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.calendarOutfitCard}
                    onPress={() => {
                      if (calendarDay.outfits.length > 0) {
                        console.log('Outfits:', calendarDay.outfits);
                      } else {
                        setShowCalendarModal(false);
                        navigation?.navigate('Studio');
                      }
                    }}
                  >
                    {calendarDay.outfits.length > 0 ? (
                      <View style={styles.calendarOutfitCardContent}>
                        <Icon name="hanger" size={32} color="#000000" />
                        <Text style={styles.calendarOutfitCardDate}>{calendarDay.day}</Text>
                      </View>
                    ) : (
                      <View style={styles.calendarOutfitCardContent}>
                        <View style={styles.calendarOutfitCardIcon}>
                          <Icon name="calendar-plus" size={32} color="#CCCCCC" />
                          <View style={styles.calendarOutfitCardPlus}>
                            <Icon name="plus" size={12} color="#000000" />
                          </View>
                        </View>
                        <Text style={styles.calendarOutfitCardDate}>{calendarDay.day}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Reanimated.View>
        </Reanimated.View>
      </Modal>

      {/* Add to Calendar Modal - Outfit Selection */}
      <Modal
        visible={showAddToCalendarModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowAddToCalendarModal(false)}
      >
        <Reanimated.View style={[styles.modalOverlay, addToCalendarBackdropAnimatedStyle]}>
          <BlurView
            blurType="dark"
            blurAmount={20}
            style={StyleSheet.absoluteFill}
            reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
          />
          <View style={styles.darkOverlay} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowAddToCalendarModal(false)}
          />
          <Reanimated.View style={[styles.addToCalendarModalContent, addToCalendarModalAnimatedStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Outfit to Calendar</Text>
              <TouchableOpacity 
                onPress={() => setShowAddToCalendarModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.outfitSelectionContainer}
            >
              {/* Create New Outfit Card - First in list */}
              <TouchableOpacity
                style={styles.createNewOutfitCard}
                onPress={() => {
                  setShowAddToCalendarModal(false);
                  navigation?.navigate('Studio');
                }}
              >
                <View style={styles.createNewOutfitCardContent}>
                  <View style={styles.createNewOutfitIconContainer}>
                    <Icon name="plus" size={32} color="#000000" />
                  </View>
                  <Text style={styles.createNewOutfitCardText}>Create New Outfit</Text>
                </View>
              </TouchableOpacity>

              {/* All Existing Outfits */}
              {savedOutfits.map((outfit) => (
                <TouchableOpacity
                  key={outfit.id}
                  style={styles.outfitSelectionCard}
                  onPress={() => handleOutfitSelectForCalendar(outfit)}
                >
                  <View style={styles.outfitSelectionCardHeader}>
                    <Icon name="hanger" size={24} color="#000000" />
                    <Text style={styles.outfitSelectionName}>{outfit.name}</Text>
                  </View>
                  <Text style={styles.outfitSelectionDate}>{outfit.date}</Text>
                  <View style={styles.outfitSelectionItems}>
                    {outfit.items.slice(0, 3).map((item, index) => (
                      <View key={index} style={styles.outfitSelectionItemTag}>
                        <Text style={styles.outfitSelectionItemText}>{item}</Text>
                      </View>
                    ))}
                    {outfit.items.length > 3 && (
                      <View style={styles.outfitSelectionItemTag}>
                        <Text style={styles.outfitSelectionItemText}>+{outfit.items.length - 3}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Reanimated.View>
        </Reanimated.View>
      </Modal>

      {/* View All Outfits Modal */}
      <Modal
        visible={showViewAllModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowViewAllModal(false)}
      >
        <Reanimated.View style={[styles.modalOverlay, viewAllBackdropAnimatedStyle]}>
          <BlurView
            blurType="dark"
            blurAmount={20}
            style={StyleSheet.absoluteFill}
            reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
          />
          <View style={styles.darkOverlay} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowViewAllModal(false)}
          />
          <Reanimated.View style={[styles.viewAllModalContent, viewAllModalAnimatedStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All Outfits</Text>
              <TouchableOpacity 
                onPress={() => setShowViewAllModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.viewAllOutfitsContainer}
            >
              {savedOutfits.map((outfit) => (
                <TouchableOpacity
                  key={outfit.id}
                  style={styles.viewAllOutfitCard}
                  onPress={() => {
                    setShowViewAllModal(false);
                    navigation?.navigate('Studio');
                  }}
                >
                  <View style={styles.outfitSelectionCardHeader}>
                    <Icon name="hanger" size={24} color="#000000" />
                    <Text style={styles.outfitSelectionName}>{outfit.name}</Text>
                  </View>
                  <Text style={styles.outfitSelectionDate}>{outfit.date}</Text>
                  <View style={styles.outfitSelectionItems}>
                    {outfit.items.map((item, index) => (
                      <View key={index} style={styles.outfitSelectionItemTag}>
                        <Text style={styles.outfitSelectionItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Reanimated.View>
        </Reanimated.View>
      </Modal>

      {/* Date-Based Outfit Selection Modal */}
      <Modal
        visible={showDateOutfitModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowDateOutfitModal(false)}
      >
        <Reanimated.View style={[styles.modalOverlay, dateOutfitBackdropAnimatedStyle]}>
          <BlurView
            blurType="dark"
            blurAmount={20}
            style={StyleSheet.absoluteFill}
            reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
          />
          <View style={styles.darkOverlay} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowDateOutfitModal(false)}
          />
          <Reanimated.View style={[styles.dateOutfitModalContent, dateOutfitModalAnimatedStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedCalendarDate 
                  ? `${monthNames[selectedCalendarDate.month]} ${selectedCalendarDate.day}, ${selectedCalendarDate.year}`
                  : 'Select Date'
                }
              </Text>
              <TouchableOpacity 
                onPress={() => setShowDateOutfitModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {selectedCalendarDate && (
              <>
                {getOutfitsForDate(selectedCalendarDate.year, selectedCalendarDate.month, selectedCalendarDate.day).length > 0 ? (
                  <View style={styles.dateOutfitsSection}>
                    <Text style={styles.dateOutfitsTitle}>Outfits for this date:</Text>
                    <ScrollView 
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.dateOutfitsList}
                    >
                      {getOutfitsForDate(selectedCalendarDate.year, selectedCalendarDate.month, selectedCalendarDate.day).map((outfit) => (
                        <TouchableOpacity
                          key={outfit.id}
                          style={styles.outfitSelectionCard}
                          onPress={() => {
                            setShowDateOutfitModal(false);
                            navigation?.navigate('Studio');
                          }}
                        >
                          <View style={styles.outfitSelectionCardHeader}>
                            <Icon name="hanger" size={24} color="#000000" />
                            <Text style={styles.outfitSelectionName}>{outfit.name}</Text>
                          </View>
                          <View style={styles.outfitSelectionItems}>
                            {outfit.items.slice(0, 3).map((item, index) => (
                              <View key={index} style={styles.outfitSelectionItemTag}>
                                <Text style={styles.outfitSelectionItemText}>{item}</Text>
                              </View>
                            ))}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={styles.dateOutfitsEmpty}>
                    <Icon name="calendar-plus" size={48} color="#CCCCCC" />
                    <Text style={styles.dateOutfitsEmptyText}>No outfits for this date</Text>
                  </View>
                )}

                <View style={styles.dateOutfitActions}>
                  <TouchableOpacity
                    style={styles.dateOutfitActionButton}
                    onPress={() => {
                      setShowDateOutfitModal(false);
                      setShowAddToCalendarModal(true);
                    }}
                  >
                    <Icon name="hanger" size={20} color="#000000" />
                    <Text style={styles.dateOutfitActionText}>Select from Existing</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dateOutfitActionButton, styles.dateOutfitActionButtonPrimary]}
                    onPress={() => {
                      setShowDateOutfitModal(false);
                      navigation?.navigate('Studio');
                    }}
                  >
                    <Icon name="plus" size={20} color="#000000" />
                    <Text style={styles.dateOutfitActionText}>Create New Outfit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Reanimated.View>
        </Reanimated.View>
      </Modal>

      {/* Outfit Preview Modal */}
      <Modal
        visible={showOutfitPreviewModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowOutfitPreviewModal(false)}
      >
        <Reanimated.View style={[styles.modalOverlay, outfitPreviewBackdropAnimatedStyle]}>
          <BlurView
            blurType="dark"
            blurAmount={20}
            style={StyleSheet.absoluteFill}
            reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
          />
          <View style={styles.darkOverlay} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowOutfitPreviewModal(false)}
          />
          <Reanimated.View style={[styles.outfitPreviewModalContent, outfitPreviewModalAnimatedStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Outfit Preview</Text>
              <TouchableOpacity 
                onPress={() => setShowOutfitPreviewModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {selectedOutfitForPreview && (
              <View style={styles.outfitPreviewContent}>
                <View style={styles.outfitPreviewHeader}>
                  <View style={styles.outfitPreviewIconContainer}>
                    <Icon name="hanger" size={32} color="#000000" />
                  </View>
                  <Text style={styles.outfitPreviewName}>{selectedOutfitForPreview.name}</Text>
                  <Text style={styles.outfitPreviewDate}>{selectedOutfitForPreview.date}</Text>
                </View>

                <View style={styles.outfitPreviewItemsContainer}>
                  <Text style={styles.outfitPreviewItemsTitle}>Items:</Text>
                  <View style={styles.outfitPreviewItems}>
                    {selectedOutfitForPreview.items.map((item, index) => (
                      <View key={index} style={styles.outfitPreviewItemTag}>
                        <Text style={styles.outfitPreviewItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </Reanimated.View>
        </Reanimated.View>
      </Modal>

      {/* AI Fashion Advisor Chatbot Modal */}
      <Modal
        visible={showChatbotModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowChatbotModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <Reanimated.View style={[StyleSheet.absoluteFill, chatbotBackdropAnimatedStyle]}>
            <BlurView
              blurType="dark"
              blurAmount={20}
              style={StyleSheet.absoluteFill}
              reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
            />
            <View style={styles.darkOverlay} />
          </Reanimated.View>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowChatbotModal(false)}
          />
          <Reanimated.View style={[styles.chatbotModalContent, chatbotModalAnimatedStyle]}>
            <View style={styles.modalHeader}>
              <View style={styles.chatbotHeaderLeft}>
                <View style={styles.chatbotIconContainer}>
                  <Icon name="robot" size={20} color="#000000" />
                </View>
                <Text style={styles.modalTitle}>AI Fashion Advisor</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowChatbotModal(false)}
              >
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView 
              ref={chatScrollViewRef}
              style={styles.chatMessagesContainerModal}
              contentContainerStyle={styles.chatMessagesContent}
              showsVerticalScrollIndicator={false}
            >
              {(() => {
                const renderedMessages: React.ReactNode[] = [];
                let i = 0;
                
                while (i < chatMessages.length) {
                  const message = chatMessages[i];
                  
                  // Check if this is the start of a collection items group
                  // Collection items are consecutive bot messages with imageUri
                  if (!message.isUser && message.imageUri) {
                    // Collect all consecutive collection item messages
                    const collectionItems: ChatMessage[] = [];
                    let j = i;
                    
                    while (j < chatMessages.length && 
                           !chatMessages[j].isUser && 
                           chatMessages[j].imageUri) {
                      collectionItems.push(chatMessages[j]);
                      j++;
                    }
                    
                    // Render collection items in horizontal ScrollView
                    if (collectionItems.length > 0) {
                      renderedMessages.push(
                        <View
                          key={`collection-group-${i}`}
                          style={styles.collectionGroupContainer}
                        >
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.collectionItemsScrollContent}
                            style={styles.collectionItemsScrollView}
                            nestedScrollEnabled={true}
                            scrollEventThrottle={16}
                          >
                            {collectionItems.map((item, index) => (
                              <View
                                key={item.id}
                                style={[
                                  styles.collectionItemCard,
                                  index === 0 && styles.collectionItemCardFirst,
                                  index === collectionItems.length - 1 && styles.collectionItemCardLast
                                ]}
                              >
                                <View style={styles.collectionImageContainer}>
                                  <Image
                                    source={{ uri: item.imageUri }}
                                    style={styles.collectionItemImage}
                                    resizeMode="cover"
                                  />
                                  {item.text && (
                                    <View style={styles.collectionItemLabel}>
                                      <Text style={styles.collectionItemName}>
                                        {item.text}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              </View>
                            ))}
                          </ScrollView>
                        </View>
                      );
                      
                      i = j; // Skip processed messages
                      continue;
                    }
                  }
                  
                  // Render normal message
                  renderedMessages.push(
                    <View
                      key={message.id}
                      style={[
                        styles.messageContainer,
                        message.isUser ? styles.userMessageContainer : styles.botMessageContainer
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          message.isUser ? styles.userMessageBubble : styles.botMessageBubble
                        ]}
                      >
                        {message.text && (
                          <Text
                            style={[
                              styles.messageText,
                            ]}
                          >
                            {parseMarkdown(message.text, message.isUser)}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                  
                  i++;
                }
                
                return renderedMessages;
              })()}
              {isTyping && (
                <View style={styles.botMessageContainer}>
                  <View style={styles.thinkingBubble}>
                    <ActivityIndicator 
                      size="small" 
                      color="#666666" 
                      style={styles.thinkingSpinner}
                    />
                    <Text style={styles.thinkingText}>Thinking...</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Quick Suggestions */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickSuggestionsContainer}
            >
              <TouchableOpacity
                style={styles.quickSuggestionButton}
                onPress={() => handleQuickSuggestion('Suggest outfit for today')}
              >
                <Text style={styles.quickSuggestionText}>Suggest outfit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickSuggestionButton}
                onPress={() => handleQuickSuggestion('Color tips')}
              >
                <Text style={styles.quickSuggestionText}>Color tips</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickSuggestionButton}
                onPress={() => handleQuickSuggestion('Style advice')}
              >
                <Text style={styles.quickSuggestionText}>Style advice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickSuggestionButton}
                onPress={() => handleQuickSuggestion('Outfit ideas')}
              >
                <Text style={styles.quickSuggestionText}>Outfit ideas</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Chat Input */}
            <View style={styles.chatInputContainer}>
              <TouchableOpacity
                style={styles.attachmentButton}
                onPress={handleImagePicker}
              >
                <Icon name="pin" size={22} color="#000000" />
              </TouchableOpacity>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask me anything about fashion..."
                placeholderTextColor="#999999"
                value={chatInput}
                onChangeText={setChatInput}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                style={[styles.sendButton, !chatInput.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!chatInput.trim()}
              >
                <Icon name="send" size={20} color={chatInput.trim() ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)"} />
              </TouchableOpacity>
            </View>
          </Reanimated.View>
        </KeyboardAvoidingView>
      </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  scrollViewContainer: {
    flex: 1,
    zIndex: 2,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 0,
    marginTop: Platform.OS === 'ios' ? -150 : -(StatusBar.currentHeight || 0) - 60,
    gap: 0,
  },
  headerLogo: {
    height: 300,
    width: 300,
    marginBottom: -80,
    marginLeft: -10,
    marginTop: 0,
  },
  mainSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  mainText: {
    fontSize: 16,
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    marginTop: 0,
    marginBottom: 40,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionButtonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  actionButtonCircleBlack: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  actionButtonCircleWhite: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  iconWithPlus: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIconSmall: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  actionButtonLabel: {
    fontSize: 12,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.5,
  },
  viewCalendarLink: {
    fontSize: 14,
    fontFamily: 'GTMaruMedium',
    color: '#666666',
  },
  daysContainer: {
    paddingRight: 20,
    marginBottom: 16,
  },
  dayItem: {
    width: 180,
    minHeight: 160,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    alignItems: 'center',
  },
  dayItemOutfitSection: {
    width: '100%',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  calendarOutfitNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  calendarOutfitName: {
    fontSize: 14,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  todayDot: {
    position: 'absolute',
    top: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FDFF8D',
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'GTMaruMedium',
    color: '#666666',
    marginBottom: 4,
  },
  dayTextToday: {
    color: '#000000',
    fontFamily: 'GTMaruBold',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginBottom: 8,
  },
  dateTextToday: {
    color: '#000000',
    fontFamily: 'GTMaruMedium',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tempText: {
    fontSize: 11,
    fontFamily: 'GTMaruRegular',
    color: '#000000',
  },
  outfitCard: {
    width: 180,
    minHeight: 160,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyOutfitCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  myOutfitsContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  viewAllLink: {
    fontSize: 14,
    fontFamily: 'GTMaruMedium',
    color: '#666666',
  },
  myOutfitCard: {
    width: OUTFIT_CARD_WIDTH,
    height: OUTFIT_CARD_WIDTH,
    borderRadius: 28,
    marginRight: OUTFIT_CARD_SPACING,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glossyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253, 255, 142, 0.1)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '40%',
    opacity: 0.6,
  },
  outfitCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    zIndex: 1,
  },
  outfitArcIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FDFF8D',
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  outfitArcName: {
    fontSize: 14,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  outfitArcMeta: {
    fontSize: 11,
    fontFamily: 'GTMaruMedium',
    color: '#666666',
    textAlign: 'center',
  },
  outfitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  outfitCardName: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginLeft: 8,
    flex: 1,
  },
  outfitCardDate: {
    fontSize: 12,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginBottom: 12,
    width: '100%',
  },
  outfitItemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  outfitItemTag: {
    backgroundColor: '#FDFF8D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  outfitItemText: {
    fontSize: 10,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
  },
  bookContainer: {
    paddingRight: 20,
  },
  // Collection Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  collectionModalContent: {
    backgroundColor: '#FFFCF1',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
    overflow: 'visible', // Allow scaled cards to be visible
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  collectionRow: {
    marginBottom: 32,
    height: SCREEN_HEIGHT * 0.3,
    overflow: 'visible', // Allow scaled cards to be visible without clipping
  },
  collectionRowHorizontal: {
    marginBottom: 32,
    height: CATEGORY_CARD_HORIZONTAL_HEIGHT + 40, // Card height + title + padding
  },
  collectionRowTitle: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  categoryScrollContainer: {
    paddingVertical: 38,
    alignItems: 'center',
  },
  categoryVerticalContainer: {
    paddingVertical: 0,
    paddingHorizontal: 8, // Add horizontal padding to prevent edge clipping when cards scale
  },
  categoryHorizontalContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  categoryCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding:6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: 12,
    margin:40,
  },
  categoryCardVertical: {
    width: '100%',
    height: CATEGORY_CARD_HEIGHT,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: CATEGORY_CARD_VERTICAL_SPACING,
    justifyContent: 'center',
    overflow: 'hidden', // Keep overflow hidden for card content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryCardGradientHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    zIndex: 0,
  },
  categoryCardHorizontal: {
    width: CATEGORY_CARD_HORIZONTAL_WIDTH,
    height: CATEGORY_CARD_HORIZONTAL_HEIGHT,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryCardGradientHeaderHorizontal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    zIndex: 0,
  },
  categoryHeaderHorizontal: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  categoryIconContainerHorizontal: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'visible',
  },
  categoryAddButtonHorizontal: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    zIndex: 10,
  },
  categoryTextContainerHorizontal: {
    alignItems: 'center',
    width: '100%',
  },
  categoryNameHorizontal: {
    fontSize: 14,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
    textAlign: 'center',
  },
  categoryCountHorizontal: {
    fontSize: 11,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    textAlign: 'center',
  },
  collectionModalGlass: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  categoryHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryHeaderVertical: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  categoryIconContainerVertical: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'visible', // Allow add button to extend outside without clipping
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryNameVertical: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  categoryCountVertical: {
    fontSize: 12,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  categoryAddButton: {
    position: 'absolute',
    bottom: -6, // Slightly adjusted to reduce clipping risk
    right: -6, // Slightly adjusted to reduce clipping risk
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    zIndex: 10, // Ensure button stays on top when card scales
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 10,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    textAlign: 'center',
  },
  categoryItemsContainer: {
    paddingRight: 8,
  },
  categoryItemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  categoryItemImage: {
    width: '100%',
    height: '100%',
  },
  // Calendar Modal Styles
  calendarModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
    flex: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarBackButton: {
    padding: 4,
  },
  calendarMonthYear: {
    flex: 1,
    alignItems: 'center',
  },
  calendarMonthYearText: {
    fontSize: 20,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
  },
  calendarHeaderIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  calendarHeaderIcon: {
    padding: 4,
  },
  selectedOutfitBanner: {
    backgroundColor: '#FDFF8D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#000000',
  },
  selectedOutfitBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedOutfitBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
  },
  selectedOutfitBannerClose: {
    padding: 4,
  },
  calendarNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarNavButton: {
    padding: 8,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontFamily: 'GTMaruMedium',
    color: '#666666',
  },
  calendarGridContainer: {
    maxHeight: 400,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  calendarDayCellOtherMonth: {
    backgroundColor: '#F5F5F5',
  },
  calendarDayCellToday: {
    backgroundColor: '#FDFF8D',
  },
  calendarDayNumber: {
    fontSize: 14,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
    marginBottom: 4,
  },
  calendarDayNumberOtherMonth: {
    color: '#999999',
  },
  calendarDayNumberToday: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
  },
  calendarDayOutfits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
    width: '100%',
  },
  calendarOutfitThumbnail: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarOutfitMore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarOutfitMoreText: {
    fontSize: 8,
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  calendarOutfitCardsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  calendarOutfitCardsTitle: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  calendarOutfitCardsContainer: {
    paddingRight: 20,
  },
  calendarOutfitCard: {
    width: 80,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarOutfitCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarOutfitCardIcon: {
    position: 'relative',
    marginBottom: 8,
  },
  calendarOutfitCardPlus: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FDFF8D',
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarOutfitCardDate: {
    fontSize: 12,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
  },
  // Add to Calendar Modal Styles
  addToCalendarModalContent: {
    backgroundColor: '#FFFCF1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  outfitSelectionContainer: {
    paddingBottom: 20,
  },
  outfitSelectionCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  outfitSelectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  outfitSelectionName: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
  outfitSelectionDate: {
    fontSize: 12,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginBottom: 12,
  },
  outfitSelectionItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  outfitSelectionItemTag: {
    backgroundColor: '#FDFF8D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  outfitSelectionItemText: {
    fontSize: 10,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
  },
  createNewOutfitCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  createNewOutfitCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  createNewOutfitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  createNewOutfitCardText: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  // View All Modal Styles
  viewAllModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  outfitPreviewModalContent: {
    backgroundColor: '#FFFCF1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '70%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  outfitPreviewContent: {
    paddingTop: 20,
  },
  outfitPreviewHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  outfitPreviewIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  outfitPreviewName: {
    fontSize: 24,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  outfitPreviewDate: {
    fontSize: 14,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    textAlign: 'center',
  },
  outfitPreviewItemsContainer: {
    marginTop: 8,
  },
  outfitPreviewItemsTitle: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  outfitPreviewItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  outfitPreviewItemTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  outfitPreviewItemText: {
    fontSize: 12,
    fontFamily: 'GTMaruRegular',
    color: '#000000',
  },
  viewAllOutfitsContainer: {
    paddingBottom: 20,
  },
  viewAllOutfitCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  // Date-Based Outfit Modal Styles
  dateOutfitModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  dateOutfitsSection: {
    marginTop: 16,
  },
  dateOutfitsTitle: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: 12,
  },
  dateOutfitsList: {
    paddingBottom: 20,
  },
  dateOutfitsEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  dateOutfitsEmptyText: {
    fontSize: 14,
    fontFamily: 'GTMaruMedium',
    color: '#666666',
    marginTop: 12,
  },
  dateOutfitActions: {
    marginTop: 24,
    gap: 12,
  },
  dateOutfitActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  dateOutfitActionButtonPrimary: {
    backgroundColor: '#FDFF8D',
  },
  dateOutfitActionText: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  // Chatbot Trigger Button Styles
  chatbotTriggerButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chatbotTriggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  chatbotTriggerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    marginRight: 12,
  },
  chatbotTriggerText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
  },
  // Chatbot Modal Styles
  chatbotModalContent: {
    backgroundColor: '#FFFCF1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  chatMessagesContainerModal: {
    maxHeight: 350,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  // Chatbot Styles (kept for backward compatibility)
  chatbotSection: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  chatbotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  chatbotHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatbotIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    marginRight: 10,
  },
  chatbotTitle: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
  },
  chatMessagesContainer: {
    maxHeight: 200,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatMessagesContent: {
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    minWidth: 120,
  },
  userMessageBubble: {
    backgroundColor: '#FDFF8D',
    borderWidth: 2,
    borderColor: '#000000',
    borderBottomRightRadius: 4,
  },
  botMessageBubble: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'GTMaruRegular',
    lineHeight: 20,
  },
  messageTextWithImage: {
    marginTop: 8,
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 4,
  },
  collectionGroupContainer: {
    marginBottom: 16,
    marginHorizontal: -4,
  },
  collectionItemsScrollView: {
    marginHorizontal: 4,
  },
  collectionItemsScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
  },
  collectionItemCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  collectionItemCardFirst: {
    marginLeft: 0,
  },
  collectionItemCardLast: {
    marginRight: 12,
  },
  collectionImageContainer: {
    width: '100%',
    position: 'relative',
  },
  collectionItemImage: {
    width: '100%',
    height: 200,
    borderRadius: 14,
  },
  collectionItemLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  collectionItemName: {
    fontSize: 13,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    textAlign: 'center',
  },
  userMessageText: {
    color: '#000000',
  },
  botMessageText: {
    color: '#000000',
  },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
    minWidth: 120,
  },
  thinkingSpinner: {
    marginRight: 10,
  },
  thinkingText: {
    fontSize: 14,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    fontStyle: 'italic',
  },
  quickSuggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quickSuggestionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  quickSuggestionText: {
    fontSize: 12,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  chatInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    maxHeight: 80,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDFF8E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
});

export default AIScreen;
