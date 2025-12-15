import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Platform,
  Modal,
  TextInput,
  Alert,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WardrobeStackParamList } from './WardrobeFeature';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

// Safely import LiquidGlassView with fallback
let LiquidGlassView: any = null;
let isLiquidGlassSupported = false;
try {
  const liquidGlass = require('@callstack/liquid-glass');
  if (liquidGlass && liquidGlass.LiquidGlassView) {
    LiquidGlassView = liquidGlass.LiquidGlassView;
    isLiquidGlassSupported = liquidGlass.isLiquidGlassSupported === true;
  }
} catch {
  // LiquidGlassView not available, use fallback
  isLiquidGlassSupported = false;
  LiquidGlassView = null;
}

type StudioScreenProps = {
  navigation?: NativeStackNavigationProp<WardrobeStackParamList, 'Studio'>;
};

// Helper function to safely render BlurView
const SafeBlurView = ({ children, style, blurType = 'dark', blurAmount = 20, fallbackColor }: any) => {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        blurType={blurType}
        blurAmount={blurAmount}
        style={style}
        reducedTransparencyFallbackColor={fallbackColor}
      >
        {children}
      </BlurView>
    );
  }
  return (
    <View style={[style, { backgroundColor: fallbackColor || 'rgba(0, 0, 0, 0.8)' }]}>
      {children}
    </View>
  );
};

const StudioScreen: React.FC<StudioScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedCollectionType, setSelectedCollectionType] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: { id: string; name: string; image: string; icon: string } | null }>({});
  const [currentSlot, setCurrentSlot] = useState<string | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const CARD_WIDTH = 220;
  const CARD_SPACING = 16;
  const CARD_FULL_WIDTH = CARD_WIDTH + CARD_SPACING;
  const windowWidth = Dimensions.get('window').width;
  const horizontalInset = Math.max((windowWidth - CARD_WIDTH) / 2, 0);
  const fallbackTintPalette = ['#d8d6df', '#e3b04b', '#23b4c3'];
  
  // Gradient palettes for collection item cards
  const gradientPalettes = [
    ['#4A90E2', '#87CEEB'], // Blue to sky-blue
    ['#FF6B6B', '#FFB88C'], // Orange to pink
    ['#9B59B6', '#E8D5FF'], // Purple to lavender
    ['#FF8A80', '#FFB74D'], // Warm gradient
  ];

  // Icon library with ~50 icons for outfit categorization
  const outfitIcons = [
    // Fitness/Gym
    { id: '1', name: 'dumbbell', type: 'icon', category: 'Fitness' },
    { id: '2', name: 'weight-lifter', type: 'icon', category: 'Fitness' },
    { id: '3', name: 'yoga', type: 'icon', category: 'Fitness' },
    { id: '4', name: 'run', type: 'icon', category: 'Fitness' },
    { id: '5', name: 'bicycle', type: 'icon', category: 'Fitness' },
    { id: '6', name: 'basketball', type: 'icon', category: 'Fitness' },
    { id: '7', name: 'soccer', type: 'icon', category: 'Fitness' },
    
    // Weather
    { id: '8', name: 'weather-snowy', type: 'icon', category: 'Weather' },
    { id: '9', name: 'weather-rainy', type: 'icon', category: 'Weather' },
    { id: '10', name: 'weather-cloudy', type: 'icon', category: 'Weather' },
    { id: '11', name: 'weather-sunny', type: 'icon', category: 'Weather' },
    { id: '12', name: 'weather-lightning', type: 'icon', category: 'Weather' },
    { id: '13', name: 'weather-partly-cloudy', type: 'icon', category: 'Weather' },
    { id: '14', name: 'weather-windy', type: 'icon', category: 'Weather' },
    { id: '15', name: 'weather-fog', type: 'icon', category: 'Weather' },
    
    // Seasons
    { id: '16', name: 'snowflake', type: 'icon', category: 'Seasons' },
    { id: '17', name: 'snowflake-melt', type: 'icon', category: 'Seasons' },
    { id: '18', name: 'leaf', type: 'icon', category: 'Seasons' },
    { id: '19', name: 'flower', type: 'icon', category: 'Seasons' },
    { id: '20', name: 'umbrella', type: 'icon', category: 'Seasons' },
    
    // Activities
    { id: '21', name: 'beach', type: 'icon', category: 'Activities' },
    { id: '22', name: 'hiking', type: 'icon', category: 'Activities' },
    { id: '23', name: 'party-popper', type: 'icon', category: 'Activities' },
    { id: '24', name: 'music', type: 'icon', category: 'Activities' },
    { id: '25', name: 'camera', type: 'icon', category: 'Activities' },
    { id: '26', name: 'airplane', type: 'icon', category: 'Activities' },
    { id: '27', name: 'car', type: 'icon', category: 'Activities' },
    { id: '28', name: 'coffee', type: 'icon', category: 'Activities' },
    { id: '29', name: 'food', type: 'icon', category: 'Activities' },
    { id: '30', name: 'movie', type: 'icon', category: 'Activities' },
    
    // Moods/Styles
    { id: '31', name: 'heart', type: 'icon', category: 'Moods' },
    { id: '32', name: 'star', type: 'icon', category: 'Moods' },
    { id: '33', name: 'fire', type: 'icon', category: 'Moods' },
    { id: '34', name: 'lightning-bolt', type: 'icon', category: 'Moods' },
    { id: '35', name: 'sparkles', type: 'icon', category: 'Moods' },
    { id: '36', name: 'emoticon-happy', type: 'icon', category: 'Moods' },
    { id: '37', name: 'emoticon-cool', type: 'icon', category: 'Moods' },
    { id: '38', name: 'palette', type: 'icon', category: 'Moods' },
    
    // Formal/Casual
    { id: '39', name: 'tie', type: 'icon', category: 'Style' },
    { id: '40', name: 'bow-tie', type: 'icon', category: 'Style' },
    { id: '41', name: 'tshirt-crew', type: 'icon', category: 'Style' },
    { id: '42', name: 'shoe-formal', type: 'icon', category: 'Style' },
    { id: '43', name: 'shoe-sneaker', type: 'icon', category: 'Style' },
    
    // Other
    { id: '44', name: 'crown', type: 'icon', category: 'Other' },
    { id: '45', name: 'diamond-stone', type: 'icon', category: 'Other' },
    { id: '46', name: 'rocket', type: 'icon', category: 'Other' },
    { id: '47', name: 'trending-up', type: 'icon', category: 'Other' },
    { id: '48', name: 'flash', type: 'icon', category: 'Other' },
    { id: '49', name: 'shield', type: 'icon', category: 'Other' },
    { id: '50', name: 'trophy', type: 'icon', category: 'Other' },
  ];
  
  const placeholderIcons = {
    hat: 'hat-fedora',
    coat: 'hanger',
    tee: 'tshirt-crew',
    accessory: 'necklace',
    shoes: 'shoe-formal',
    bag: 'bag-checked',
    pants: 'human-male-height',
  };

  const categoryNames: { [key: string]: string } = {
    hat: 'Hats',
    coat: 'Jackets',
    tee: 'Tops',
    accessory: 'Accessories',
    shoes: 'Shoes',
    bag: 'Bags',
    pants: 'Pants',
  };

  // Mock collection items for each category with icons and images
  const collectionItems: { [key: string]: Array<{ id: string; name: string; icon: string; image: string }> } = {
    hat: [
      { id: '1', name: 'Baseball Cap', icon: 'baseball', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop' },
      { id: '2', name: 'Fedora', icon: 'hat-fedora', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop' },
      { id: '3', name: 'Beanie', icon: 'winter-hat', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop' },
      { id: '4', name: 'Bucket Hat', icon: 'hat-fedora', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop' },
      { id: '5', name: 'Snapback', icon: 'baseball', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop' },
      { id: '6', name: 'Beret', icon: 'hat-fedora', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop' },
      { id: '7', name: 'Trucker Hat', icon: 'baseball', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop' },
      { id: '8', name: 'Visor', icon: 'baseball', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop' },
      { id: '9', name: 'Newsboy Cap', icon: 'hat-fedora', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop' },
      { id: '10', name: 'Panama Hat', icon: 'hat-fedora', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop' },
    ],
    coat: [
      { id: '1', name: 'Bomber Jacket', icon: 'jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
      { id: '2', name: 'Denim Jacket', icon: 'jacket', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop' },
      { id: '3', name: 'Leather Jacket', icon: 'jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
      { id: '4', name: 'Blazer', icon: 'hanger', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
      { id: '5', name: 'Trench Coat', icon: 'jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
      { id: '6', name: 'Windbreaker', icon: 'jacket', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop' },
      { id: '7', name: 'Wool Coat', icon: 'jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
      { id: '8', name: 'Puffer Jacket', icon: 'jacket', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop' },
      { id: '9', name: 'Cardigan', icon: 'hanger', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
      { id: '10', name: 'Hooded Jacket', icon: 'jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
      { id: '11', name: 'Peacoat', icon: 'jacket', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop' },
      { id: '12', name: 'Varsity Jacket', icon: 'jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
    ],
    tee: [
      { id: '1', name: 'Striped Shirt', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { id: '2', name: 'White T-Shirt', icon: 'tshirt-v', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { id: '3', name: 'Polo Shirt', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { id: '4', name: 'Button-Up Shirt', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
      { id: '5', name: 'Tank Top', icon: 'tshirt-v', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { id: '6', name: 'Long Sleeve Tee', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { id: '7', name: 'Hoodie', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop' },
      { id: '8', name: 'Sweater', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop' },
      { id: '9', name: 'Henley Shirt', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { id: '10', name: 'Flannel Shirt', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
      { id: '11', name: 'Turtleneck', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop' },
      { id: '12', name: 'Crop Top', icon: 'tshirt-v', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { id: '13', name: 'Blouse', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69d?w=400&h=400&fit=crop' },
      { id: '14', name: 'Tunic', icon: 'tshirt-crew', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
    ],
    accessory: [
      { id: '1', name: 'Silver Necklace', icon: 'necklace', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
      { id: '2', name: 'Gold Chain', icon: 'necklace', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
      { id: '3', name: 'Pearl Necklace', icon: 'necklace', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
      { id: '4', name: 'Choker', icon: 'necklace', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
      { id: '5', name: 'Pendant Necklace', icon: 'necklace', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
      { id: '6', name: 'Layered Necklace', icon: 'necklace', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
      { id: '7', name: 'Statement Necklace', icon: 'necklace', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
      { id: '8', name: 'Beaded Necklace', icon: 'necklace', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
      { id: '9', name: 'Collar Necklace', icon: 'necklace', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
      { id: '10', name: 'Y-Necklace', icon: 'necklace', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop' },
    ],
    shoes: [
      { id: '1', name: 'Sneakers', icon: 'shoe-sneaker', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
      { id: '2', name: 'Loafers', icon: 'shoe-formal', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
      { id: '3', name: 'Boots', icon: 'shoe-boot', image: 'https://images.unsplash.com/photo-1608256246200-53bd35f3f44e?w=400&h=400&fit=crop' },
      { id: '4', name: 'Oxfords', icon: 'shoe-formal', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
      { id: '5', name: 'Sandals', icon: 'shoe-sneaker', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
      { id: '6', name: 'High Tops', icon: 'shoe-sneaker', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
      { id: '7', name: 'Ankle Boots', icon: 'shoe-boot', image: 'https://images.unsplash.com/photo-1608256246200-53bd35f3f44e?w=400&h=400&fit=crop' },
      { id: '8', name: 'Running Shoes', icon: 'shoe-sneaker', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
      { id: '9', name: 'Chelsea Boots', icon: 'shoe-boot', image: 'https://images.unsplash.com/photo-1608256246200-53bd35f3f44e?w=400&h=400&fit=crop' },
      { id: '10', name: 'Moccasins', icon: 'shoe-formal', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
      { id: '11', name: 'Espadrilles', icon: 'shoe-sneaker', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
      { id: '12', name: 'Heels', icon: 'shoe-formal', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
      { id: '13', name: 'Flats', icon: 'shoe-formal', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
      { id: '14', name: 'Platform Shoes', icon: 'shoe-sneaker', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
    ],
    bag: [
      { id: '1', name: 'Tote Bag', icon: 'bag-checked', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { id: '2', name: 'Backpack', icon: 'backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { id: '3', name: 'Handbag', icon: 'handbag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
      { id: '4', name: 'Crossbody Bag', icon: 'handbag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
      { id: '5', name: 'Clutch', icon: 'handbag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
      { id: '6', name: 'Messenger Bag', icon: 'backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { id: '7', name: 'Duffel Bag', icon: 'backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { id: '8', name: 'Satchel', icon: 'handbag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
      { id: '9', name: 'Hobo Bag', icon: 'handbag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
      { id: '10', name: 'Bucket Bag', icon: 'handbag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
      { id: '11', name: 'Shoulder Bag', icon: 'handbag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop' },
      { id: '12', name: 'Waist Bag', icon: 'bag-checked', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
    ],
    pants: [
      { id: '1', name: 'Wide-Leg Trousers', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
      { id: '2', name: 'Jeans', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
      { id: '3', name: 'Chinos', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
      { id: '4', name: 'Cargo Pants', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
      { id: '5', name: 'Sweatpants', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop' },
      { id: '6', name: 'Leggings', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
      { id: '7', name: 'Shorts', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
      { id: '8', name: 'Tailored Pants', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
      { id: '9', name: 'Skinny Jeans', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
      { id: '10', name: 'Straight Leg Pants', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
      { id: '11', name: 'Joggers', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop' },
      { id: '12', name: 'Palazzo Pants', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
      { id: '13', name: 'Culottes', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
      { id: '14', name: 'Track Pants', icon: 'human-male-height', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop' },
    ],
  };

  const renderCollectionItem = ({ item, index }: { item: { id: string; name: string; image: string; icon: string }; index: number }) => {
    if (!item) return null;
    
    const inputRange = [
      (index - 1) * CARD_FULL_WIDTH,
      index * CARD_FULL_WIDTH,
      (index + 1) * CARD_FULL_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.95, 1, 0.95],
      extrapolate: 'clamp',
    });

    const rotateY = scrollX.interpolate({
      inputRange,
      outputRange: ['8deg', '0deg', '-8deg'],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [8, 0, 8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const overlayOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.1, 0.03, 0.1],
      extrapolate: 'clamp',
    });

    const tintColor = fallbackTintPalette[index % fallbackTintPalette.length];
    const gradientColors = gradientPalettes[index % gradientPalettes.length];

    return (
      <Animated.View
        style={[
          styles.collectionItemCard,
          {
            transform: [
              { perspective: 1000 },
              { translateY },
              { scale },
              { rotateY },
            ],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.collectionItemPressable}
          activeOpacity={0.8}
          onPress={() => handleItemSelect(item)}
        >
          {/* Gradient Header - Top 30% */}
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.collectionItemGradientHeader}
          />
          
          <View style={styles.collectionImageContainer}>
            {item.image ? (
              <>
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.collectionItemImage}
                  resizeMode="cover"
                />
                <Animated.View 
                  pointerEvents="none"
                  style={[styles.collectionTintOverlay, { backgroundColor: tintColor, opacity: overlayOpacity }]} 
                />
              </>
            ) : (
              <View style={[styles.collectionItemIconFallback, { backgroundColor: tintColor }]}>
                <Icon 
                  name={item.icon || placeholderIcons[selectedCollectionType as keyof typeof placeholderIcons]} 
                  size={48} 
                  color="#FFFFFF" 
                />
              </View>
            )}
          </View>
          {item.name && (
            <View style={styles.collectionItemLabel}>
              <Text style={styles.collectionItemName}>{item.name}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handlePlusButtonPress = (type: string, slot?: string) => {
    setSelectedCollectionType(type);
    setCurrentSlot(slot || type);
    setShowCollectionModal(true);
  };

  const handleItemSelect = (item: { id: string; name: string; image: string; icon: string }) => {
    if (currentSlot) {
      setSelectedItems(prev => ({
        ...prev,
        [currentSlot]: item
      }));
    }
    setShowCollectionModal(false);
    setSelectedCollectionType(null);
    setCurrentSlot(null);
  };

  const handleRemoveItem = (category: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const handleNextPress = () => {
    setShowSaveModal(true);
  };

  const handleSaveOutfit = () => {
    if (!outfitName.trim()) {
      Alert.alert('Error', 'Please enter an outfit name');
      return;
    }
    
    // Save outfit logic here
    console.log('Saving outfit:', outfitName, 'with icon:', selectedIcon);
    
    // Show success message
    Alert.alert('Success', `Outfit "${outfitName}" saved successfully!`, [
      {
        text: 'OK',
        onPress: () => {
          setShowSaveModal(false);
          setOutfitName('');
          setSelectedIcon(null);
          navigation?.goBack();
        },
      },
    ]);
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
    setOutfitName('');
    setSelectedIcon(null);
    setShowIconPicker(false);
  };

  // Mock data for tops category
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0a0a0a', '#1a1a1a', '#2a2a2a', '#3a3a3a']}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.backgroundGradient}
      />
      
      <SafeAreaView style={styles.safeAreaContent}>
        {/* Top Navigation Bar with Glassmorphism */}
        <View style={styles.topNavContainer}>
        {isLiquidGlassSupported && LiquidGlassView ? (
          <LiquidGlassView
            style={styles.topNavGlass}
            effect="regular"
            tintColor="rgba(255, 255, 255, 0.15)"
            colorScheme="dark"
            interactive={true}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.topNavGradientOverlay}
            />
            <View style={styles.topNav}>
              <TouchableOpacity 
                onPress={() => navigation?.goBack()}
                style={styles.backButton}
              >
                <Icon name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </LiquidGlassView>
        ) : (
          <View style={styles.topNavFallback}>
            <SafeBlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={20}
              fallbackColor="rgba(26, 26, 26, 0.8)"
            />
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topNav}>
              <TouchableOpacity 
                onPress={() => navigation?.goBack()}
                style={styles.backButton}
              >
                <Icon name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>


      {/* Main Outfit Builder Area */}
      <View style={styles.outfitBuilder}>
        {/* Hat placeholder - Top Center */}
        <View style={[styles.itemPlaceholder, styles.hatPlaceholder]}>
          {selectedItems.hat ? (
            <>
              <Image 
                source={{ uri: selectedItems.hat.image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('hat')}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.hat} size={50} color="rgba(255, 255, 255, 0.5)" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('hat')}
              >
                <Icon name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Accessory placeholder - Below Hat, Center */}
        <View style={[styles.itemPlaceholder, styles.accessoryPlaceholder]}>
          {selectedItems.accessory ? (
            <>
              <Image 
                source={{ uri: selectedItems.accessory.image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('accessory')}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.accessory} size={40} color="rgba(255, 255, 255, 0.5)" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('accessory')}
              >
                <Icon name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Coat placeholder - Left Side */}
        <View style={[styles.itemPlaceholder, styles.coatPlaceholder]}>
          {selectedItems.coat ? (
            <>
              <Image 
                source={{ uri: selectedItems.coat.image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('coat')}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.coat} size={70} color="rgba(255, 255, 255, 0.5)" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('coat')}
              >
                <Icon name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Selected Shirt - Center (Main Item) */}
        <View style={styles.selectedItem}>
          <View style={styles.shirtContainer}>
            <View style={styles.shirtBackground}>
              {selectedItems.tee ? (
                <Image 
                  source={{ uri: selectedItems.tee.image }} 
                  style={styles.selectedItemImage}
                  resizeMode="cover"
                />
              ) : (
                <Icon name={placeholderIcons.tee} size={100} color="rgba(255, 255, 255, 0.6)" style={styles.selectedIcon} />
              )}
            </View>
            <View style={styles.pinIcon}>
              <Icon name="pin" size={14} color="#FFFFFF" />
            </View>
            {selectedItems.tee ? (
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('tee')}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('tee', 'tee')}
              >
                <Icon name="plus" size={16} color="#000000" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* T-shirt placeholder - Right Side */}
        <View style={[styles.itemPlaceholder, styles.tshirtPlaceholder]}>
          {selectedItems['tee-right'] ? (
            <>
              <Image 
                source={{ uri: selectedItems['tee-right'].image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('tee-right')}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.tee} size={70} color="rgba(255, 255, 255, 0.5)" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('tee', 'tee-right')}
              >
                <Icon name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Pants placeholder - Center Bottom */}
        <View style={[styles.itemPlaceholder, styles.pantsPlaceholder]}>
          {selectedItems.pants ? (
            <>
              <Image 
                source={{ uri: selectedItems.pants.image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('pants')}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.pants} size={85} color="rgba(255, 255, 255, 0.5)" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('pants')}
              >
                <Icon name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Shoes placeholder - Bottom Center */}
        <View style={[styles.itemPlaceholder, styles.shoesPlaceholder]}>
          {selectedItems.shoes ? (
            <>
              <Image 
                source={{ uri: selectedItems.shoes.image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('shoes')}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.shoes} size={65} color="rgba(255, 255, 255, 0.5)" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('shoes')}
              >
                <Icon name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Bag placeholder - Bottom Right */}
        <View style={[styles.itemPlaceholder, styles.bagPlaceholder]}>
          {selectedItems.bag ? (
            <>
              <Image 
                source={{ uri: selectedItems.bag.image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('bag')}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.bag} size={60} color="rgba(255, 255, 255, 0.5)" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('bag')}
              >
                <Icon name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Collection Modal */}
      <Modal
        visible={showCollectionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCollectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeBlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
            fallbackColor="rgba(0, 0, 0, 0.8)"
          />
          <View style={styles.modalBackdropDark} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowCollectionModal(false)}
          />
          {isLiquidGlassSupported && LiquidGlassView ? (
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
              <View style={[styles.collectionModalContent, { paddingBottom: 40 + insets.bottom }]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedCollectionType ? categoryNames[selectedCollectionType] : 'Collection'}
                  </Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowCollectionModal(false)}
                  >
                    <Icon name="close" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.collectionCarouselSurface}>
                  <LinearGradient
                    colors={['rgba(74, 144, 226, 0.1)', 'rgba(159, 89, 182, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.carouselGradientOverlay}
                  />
                  {selectedCollectionType && collectionItems[selectedCollectionType] && collectionItems[selectedCollectionType].length > 0 ? (
                    <Animated.FlatList
                      data={collectionItems[selectedCollectionType]}
                      keyExtractor={(item) => item.id}
                      renderItem={renderCollectionItem}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      snapToInterval={CARD_FULL_WIDTH}
                      decelerationRate="fast"
                      bounces={false}
                      contentContainerStyle={[
                        styles.collectionItemsContainer,
                        { paddingHorizontal: horizontalInset },
                      ]}
                      style={styles.collectionItemsScrollView}
                      onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: true }
                      )}
                      scrollEventThrottle={16}
                      getItemLayout={(data, index) => ({
                        length: CARD_FULL_WIDTH,
                        offset: CARD_FULL_WIDTH * index,
                        index,
                      })}
                    />
                  ) : (
                    <View style={styles.emptyCollectionContainer}>
                      <Text style={styles.emptyCollectionText}>
                        {selectedCollectionType ? `No ${categoryNames[selectedCollectionType]} in collection` : 'No items in collection'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </LiquidGlassView>
          ) : (
            <View style={styles.collectionModalFallback}>
              <SafeBlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={20}
                fallbackColor="rgba(26, 26, 26, 0.95)"
              />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.05)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={[styles.collectionModalContent, { paddingBottom: 40 + insets.bottom }]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedCollectionType ? categoryNames[selectedCollectionType] : 'Collection'}
                  </Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowCollectionModal(false)}
                  >
                    <Icon name="close" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.collectionCarouselSurface}>
                  <LinearGradient
                    colors={['rgba(74, 144, 226, 0.1)', 'rgba(159, 89, 182, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.carouselGradientOverlay}
                  />
                  {selectedCollectionType && collectionItems[selectedCollectionType] && collectionItems[selectedCollectionType].length > 0 ? (
                    <Animated.FlatList
                      data={collectionItems[selectedCollectionType]}
                      keyExtractor={(item) => item.id}
                      renderItem={renderCollectionItem}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      snapToInterval={CARD_FULL_WIDTH}
                      decelerationRate="fast"
                      bounces={false}
                      contentContainerStyle={[
                        styles.collectionItemsContainer,
                        { paddingHorizontal: horizontalInset },
                      ]}
                      style={styles.collectionItemsScrollView}
                      onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: true }
                      )}
                      scrollEventThrottle={16}
                      getItemLayout={(data, index) => ({
                        length: CARD_FULL_WIDTH,
                        offset: CARD_FULL_WIDTH * index,
                        index,
                      })}
                    />
                  ) : (
                    <View style={styles.emptyCollectionContainer}>
                      <Text style={styles.emptyCollectionText}>
                        {selectedCollectionType ? `No ${categoryNames[selectedCollectionType]} in collection` : 'No items in collection'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Save Outfit Modal */}
      <Modal
        visible={showSaveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelSave}
      >
        <View style={styles.modalOverlay}>
          <SafeBlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
            fallbackColor="rgba(0, 0, 0, 0.8)"
          />
          <View style={styles.modalBackdropDark} />
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleCancelSave}
          />
          {isLiquidGlassSupported && LiquidGlassView ? (
            <LiquidGlassView
              style={styles.saveModalGlass}
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
              <View style={[styles.saveModalContent, { paddingBottom: 20 + insets.bottom }]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Save Outfit</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={handleCancelSave}
                  >
                    <Icon name="close" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.saveModalBodyContent}>
                  <Text style={styles.saveModalLabel}>Outfit Name</Text>
                  <View style={styles.inputContainer}>
                    <SafeBlurView
                      style={styles.inputBlur}
                      blurType="dark"
                      blurAmount={10}
                      fallbackColor="rgba(26, 26, 26, 0.8)"
                    />
                    <TextInput
                      style={styles.saveModalInput}
                      placeholder="Enter outfit name"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={outfitName}
                      onChangeText={setOutfitName}
                      autoFocus={true}
                    />
                  </View>

                  <Text style={styles.saveModalLabel}>Choose Icon</Text>
                  <TouchableOpacity 
                    style={styles.iconPickerButton}
                    onPress={() => setShowIconPicker(!showIconPicker)}
                    activeOpacity={0.8}
                  >
                    <SafeBlurView
                      style={styles.iconPickerButtonBlur}
                      blurType="dark"
                      blurAmount={10}
                      fallbackColor="rgba(26, 26, 26, 0.8)"
                    />
                    {selectedIcon ? (
                      <View style={styles.selectedIconDisplay}>
                        <Icon name={selectedIcon} size={24} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={styles.iconPickerPlaceholder}>
                        <Icon name="emoticon-outline" size={24} color="rgba(255, 255, 255, 0.5)" />
                        <Text style={styles.iconPickerPlaceholderText}>Tap to select icon</Text>
                      </View>
                    )}
                    <Icon name={showIconPicker ? "chevron-up" : "chevron-down"} size={20} color="rgba(255, 255, 255, 0.7)" />
                  </TouchableOpacity>

                  {showIconPicker && (
                    <View style={styles.iconPickerGrid}>
                      <ScrollView 
                        style={styles.iconPickerScroll}
                        contentContainerStyle={styles.iconPickerScrollContent}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                      >
                        <View style={styles.iconGrid}>
                          {outfitIcons.map((icon) => (
                            <TouchableOpacity
                              key={icon.id}
                              style={[
                                styles.iconCard,
                                selectedIcon === icon.name && styles.iconCardSelected
                              ]}
                              onPress={() => {
                                setSelectedIcon(icon.name);
                                setShowIconPicker(false);
                              }}
                              activeOpacity={0.7}
                            >
                              <View style={styles.iconCardBackground}>
                                <SafeBlurView
                                  style={styles.iconCardBlur}
                                  blurType="dark"
                                  blurAmount={selectedIcon === icon.name ? 15 : 5}
                                  fallbackColor={selectedIcon === icon.name ? "rgba(74, 144, 226, 0.3)" : "rgba(26, 26, 26, 0.6)"}
                                />
                                {selectedIcon === icon.name && (
                                  <LinearGradient
                                    colors={['rgba(74, 144, 226, 0.4)', 'rgba(159, 89, 182, 0.4)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFill}
                                  />
                                )}
                              </View>
                              <View style={styles.iconCardIconContainer}>
                                <Icon 
                                  name={icon.name} 
                                  size={24} 
                                  color="#FFFFFF"
                                />
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={styles.saveModalButtons}>
                  <TouchableOpacity 
                    style={[styles.saveModalButton, styles.cancelButton]}
                    onPress={handleCancelSave}
                  >
                    <SafeBlurView
                      style={StyleSheet.absoluteFill}
                      blurType="light"
                      blurAmount={10}
                      fallbackColor="rgba(255, 255, 255, 0.2)"
                    />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.saveModalButton, styles.saveButton]}
                    onPress={handleSaveOutfit}
                    activeOpacity={0.8}
                  >
                    <SafeBlurView
                      style={styles.saveButtonBlur}
                      blurType="light"
                      blurAmount={25}
                      fallbackColor="rgba(255, 255, 255, 0.15)"
                    />
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.saveButtonGloss}
                    />
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LiquidGlassView>
          ) : (
            <View style={styles.saveModalFallback}>
              <SafeBlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={20}
                fallbackColor="rgba(26, 26, 26, 0.95)"
              />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.05)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={[styles.saveModalContent, { paddingBottom: 20 + insets.bottom }]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Save Outfit</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={handleCancelSave}
                  >
                    <Icon name="close" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.saveModalBodyContent}>
                  <Text style={styles.saveModalLabel}>Outfit Name</Text>
                  <View style={styles.inputContainer}>
                    <SafeBlurView
                      style={styles.inputBlur}
                      blurType="dark"
                      blurAmount={10}
                      fallbackColor="rgba(26, 26, 26, 0.8)"
                    />
                    <TextInput
                      style={styles.saveModalInput}
                      placeholder="Enter outfit name"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={outfitName}
                      onChangeText={setOutfitName}
                      autoFocus={true}
                    />
                  </View>

                  <Text style={styles.saveModalLabel}>Choose Icon</Text>
                  <TouchableOpacity 
                    style={styles.iconPickerButton}
                    onPress={() => setShowIconPicker(!showIconPicker)}
                    activeOpacity={0.8}
                  >
                    <SafeBlurView
                      style={styles.iconPickerButtonBlur}
                      blurType="dark"
                      blurAmount={10}
                      fallbackColor="rgba(26, 26, 26, 0.8)"
                    />
                    {selectedIcon ? (
                      <View style={styles.selectedIconDisplay}>
                        <Icon name={selectedIcon} size={24} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={styles.iconPickerPlaceholder}>
                        <Icon name="emoticon-outline" size={24} color="rgba(255, 255, 255, 0.5)" />
                        <Text style={styles.iconPickerPlaceholderText}>Tap to select icon</Text>
                      </View>
                    )}
                    <Icon name={showIconPicker ? "chevron-up" : "chevron-down"} size={20} color="rgba(255, 255, 255, 0.7)" />
                  </TouchableOpacity>

                  {showIconPicker && (
                    <View style={styles.iconPickerGrid}>
                      <ScrollView 
                        style={styles.iconPickerScroll}
                        contentContainerStyle={styles.iconPickerScrollContent}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                      >
                        <View style={styles.iconGrid}>
                          {outfitIcons.map((icon) => (
                            <TouchableOpacity
                              key={icon.id}
                              style={[
                                styles.iconCard,
                                selectedIcon === icon.name && styles.iconCardSelected
                              ]}
                              onPress={() => {
                                setSelectedIcon(icon.name);
                                setShowIconPicker(false);
                              }}
                              activeOpacity={0.7}
                            >
                              <View style={styles.iconCardBackground}>
                                <SafeBlurView
                                  style={styles.iconCardBlur}
                                  blurType="dark"
                                  blurAmount={selectedIcon === icon.name ? 15 : 5}
                                  fallbackColor={selectedIcon === icon.name ? "rgba(74, 144, 226, 0.3)" : "rgba(26, 26, 26, 0.6)"}
                                />
                                {selectedIcon === icon.name && (
                                  <LinearGradient
                                    colors={['rgba(74, 144, 226, 0.4)', 'rgba(159, 89, 182, 0.4)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFill}
                                  />
                                )}
                              </View>
                              <View style={styles.iconCardIconContainer}>
                                <Icon 
                                  name={icon.name} 
                                  size={24} 
                                  color="#FFFFFF"
                                />
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={styles.saveModalButtons}>
                    <TouchableOpacity 
                      style={[styles.saveModalButton, styles.cancelButton]}
                      onPress={handleCancelSave}
                    >
                      <SafeBlurView
                        style={StyleSheet.absoluteFill}
                        blurType="light"
                        blurAmount={10}
                        fallbackColor="rgba(255, 255, 255, 0.2)"
                      />
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.saveModalButton, styles.saveButton]}
                      onPress={handleSaveOutfit}
                    >
                      <LinearGradient
                        colors={['#FFB74D', '#FF8A80']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <SafeBlurView
                        style={StyleSheet.absoluteFill}
                        blurType="light"
                        blurAmount={5}
                        fallbackColor="transparent"
                      />
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  safeAreaContent: {
    flex: 1,
    zIndex: 1,
  },
  topNavContainer: {
    zIndex: 10,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  topNavGlass: {
    borderRadius: 0,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  topNavFallback: {
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  topNavGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 4,
  },
  nextButton: {
    padding: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#FFFCF1',
  },
  shuffleButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FDFF8D',
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    gap: 6,
  },
  filterButtonLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FDFF8D',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
  },
  activeFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FDFF8D',
    borderWidth: 2,
    borderColor: '#000000',
    gap: 6,
  },
  activeFilterText: {
    fontSize: 14,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
  },
  outfitBuilder: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 600,
  },
  itemPlaceholder: {
    position: 'absolute',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  hatPlaceholder: {
    top: '2%',
    left: '50%',
    marginLeft: -55,
    width: 110,
    height: 80,
    borderRadius: 55,
  },
  accessoryPlaceholder: {
    top: '13%',
    left: '50%',
    marginLeft: -45,
    width: 90,
    height: 75,
    borderRadius: 45,
  },
  coatPlaceholder: {
    left: '1%',
    top: '20%',
    height: 200,
    width: 120,
    borderRadius: 18,
  },
  tshirtPlaceholder: {
    right: '1%',
    top: '22%',
    width: 120,
    height: 160,
    borderRadius: 18,
  },
  pantsPlaceholder: {
    top: '50%',
    left: '50%',
    marginLeft: -65,
    width: 130,
    height: 200,
    borderRadius: 18,
  },
  shoesPlaceholder: {
    bottom: '8%',
    left: '50%',
    marginLeft: -75,
    width: 150,
    height: 65,
    borderRadius: 18,
  },
  bagPlaceholder: {
    bottom: '18%',
    right: '4%',
    width: 100,
    height: 120,
    borderRadius: 18,
  },
  placeholderIcon: {
    opacity: 0.5,
  },
  plusButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  removeButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  selectedItem: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: -65,
    zIndex: 10,
  },
  shirtContainer: {
    width: 130,
    height: 150,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shirtBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  selectedIcon: {
    opacity: 0.8,
  },
  selectedItemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  pinIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  categorySection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  categoryScroll: {
    paddingRight: 20,
  },
  categoryItem: {
    marginRight: 12,
  },
  emptyItemSlot: {
    width: 60,
    height: 80,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryItemImage: {
    width: 60,
    height: 80,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreButton: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    overflow: 'hidden',
  },
  // Collection Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdropDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  collectionModalGlass: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  collectionModalFallback: {
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
  collectionModalContent: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 28,
    paddingHorizontal: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalTitle: {
    fontSize: 26,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  collectionItemsScrollView: {
    marginHorizontal: 4,
    flexGrow: 0,
  },
  collectionItemsContainer: {
    paddingVertical: 8,
    alignItems: 'center',
    paddingBottom: 24,
    paddingLeft: 20,
    paddingRight: 20,
  },
  emptyCollectionContainer: {
    width: Dimensions.get('window').width - 80,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCollectionText: {
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  collectionCarouselSurface: {
    backgroundColor: 'rgba(31, 32, 38, 0.9)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 4,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    minHeight: 320,
    maxHeight: 400,
  },
  carouselGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    borderRadius: 20,
  },
  collectionItemCard: {
    width: 220,
    marginRight: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1,
  },
  collectionItemGradientHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    zIndex: 1,
  },
  collectionItemPressable: {
    flex: 1,
  },
  collectionImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
  },
  collectionItemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    zIndex: 1,
  },
  collectionItemIconFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  collectionTintOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    zIndex: 2,
  },
  collectionItemLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  collectionItemName: {
    fontSize: 14,
    fontFamily: 'GTMaruBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Save Modal Styles
  saveModalGlass: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  saveModalFallback: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  saveModalContent: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
    flexDirection: 'column',
  },
  saveModalBody: {
    paddingTop: 8,
  },
  saveModalBodyScroll: {
    flexShrink: 1,
    flexGrow: 0,
  },
  saveModalBodyContent: {
    paddingBottom: 0,
  },
  saveModalLabel: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: 56,
  },
  inputBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  saveModalInput: {
    width: '100%',
    minHeight: 56,
    height: 56,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
    color: '#FFFFFF',
    zIndex: 1,
  },
  saveModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 1,
    flexShrink: 0,
  },
  saveModalButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  cancelButton: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButton: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  saveButtonBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  saveButtonGloss: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#FFFFFF',
    zIndex: 1,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#FFFFFF',
    zIndex: 1,
  },
  // Icon Picker Styles
  iconPickerButton: {
    width: '100%',
    minHeight: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  iconPickerButtonBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  selectedIconDisplay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconPickerPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconPickerPlaceholderText: {
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  iconPickerGrid: {
    height: 240,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 0,
    marginTop: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 100,
  },
  iconPickerScroll: {
    flex: 1,
  },
  iconPickerScrollContent: {
    paddingBottom: 8,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
    justifyContent: 'flex-start',
    minHeight: 260,
  },
  iconCard: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'visible',
    position: 'relative',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
  },
  iconCardSelected: {
    borderColor: 'rgba(74, 144, 226, 0.8)',
    borderWidth: 2,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
  },
  iconCardBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    zIndex: 1,
  },
  iconCardBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  iconCardIconContainer: {
    zIndex: 10,
    elevation: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StudioScreen;
