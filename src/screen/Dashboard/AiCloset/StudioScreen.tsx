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

type StudioScreenProps = {
  navigation?: NativeStackNavigationProp<WardrobeStackParamList, 'Studio'>;
};

const StudioScreen: React.FC<StudioScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedCollectionType, setSelectedCollectionType] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: { id: string; name: string; image: string; icon: string } | null }>({});
  const [currentSlot, setCurrentSlot] = useState<string | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const CARD_WIDTH = 220;
  const CARD_SPACING = 16;
  const CARD_FULL_WIDTH = CARD_WIDTH + CARD_SPACING;
  const windowWidth = Dimensions.get('window').width;
  const horizontalInset = Math.max((windowWidth - CARD_WIDTH) / 2, 0);
  const fallbackTintPalette = ['#d8d6df', '#e3b04b', '#23b4c3'];
  
  const placeholderIcons = {
    hat: 'hat-fedora',
    coat: 'hanger',
    tee: 'tshirt-crew',
    accessory: 'necklace',
    shoes: 'shoe-formal',
    bag: 'bag-checked',
    socks: 'sock',
    pants: 'human-male-height',
  };

  const categoryNames: { [key: string]: string } = {
    hat: 'Hats',
    coat: 'Jackets',
    tee: 'Tops',
    accessory: 'Accessories',
    shoes: 'Shoes',
    bag: 'Bags',
    socks: 'Socks',
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
    socks: [
      { id: '1', name: 'Ankle Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      { id: '2', name: 'Crew Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      { id: '3', name: 'No-Show Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      { id: '4', name: 'Knee-High Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      { id: '5', name: 'Athletic Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      { id: '6', name: 'Dress Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      { id: '7', name: 'Compression Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      { id: '8', name: 'Toe Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      { id: '9', name: 'Calf Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
      { id: '10', name: 'Patterned Socks', icon: 'sock', image: 'https://images.unsplash.com/photo-1586350977772-b3b7e690c8e2?w=400&h=400&fit=crop' },
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
    const inputRange = [
      (index - 1) * CARD_FULL_WIDTH,
      index * CARD_FULL_WIDTH,
      (index + 1) * CARD_FULL_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const rotateY = scrollX.interpolate({
      inputRange,
      outputRange: ['12deg', '0deg', '-12deg'],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [12, 0, 12],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.55, 1, 0.55],
      extrapolate: 'clamp',
    });

    const overlayOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.45, 0.12, 0.45],
      extrapolate: 'clamp',
    });

    const tintColor = fallbackTintPalette[index % fallbackTintPalette.length];

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
          <View style={styles.collectionImageContainer}>
            {item.image ? (
              <Image 
                source={{ uri: item.image }} 
                style={styles.collectionItemImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.collectionItemIconFallback, { backgroundColor: tintColor }]}>
                <Icon 
                  name={item.icon || placeholderIcons[selectedCollectionType as keyof typeof placeholderIcons]} 
                  size={32} 
                  color="#4A4A4A" 
                />
              </View>
            )}
            <Animated.View 
              pointerEvents="none"
              style={[styles.collectionTintOverlay, { backgroundColor: tintColor, opacity: overlayOpacity }]} 
            />
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
    console.log('Saving outfit:', outfitName);
    
    // Show success message
    Alert.alert('Success', `Outfit "${outfitName}" saved successfully!`, [
      {
        text: 'OK',
        onPress: () => {
          setShowSaveModal(false);
          setOutfitName('');
          navigation?.goBack();
        },
      },
    ]);
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
    setOutfitName('');
  };

  // Mock data for tops category
  const topsItems = [
    { id: '1', empty: true },
    { id: '2', image: null, name: 'Striped Shirt' }, // The selected shirt
  ];

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity 
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
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
                <Icon name="close" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.hat} size={50} color="#B0B0B0" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('hat')}
              >
                <Icon name="plus" size={16} color="#000000" />
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
                <Icon name="close" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.accessory} size={40} color="#B0B0B0" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('accessory')}
              >
                <Icon name="plus" size={16} color="#000000" />
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
                <Icon name="close" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.coat} size={70} color="#B0B0B0" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('coat')}
              >
                <Icon name="plus" size={16} color="#000000" />
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
                <Icon name={placeholderIcons.tee} size={100} color="#4A4A4A" style={styles.selectedIcon} />
              )}
            </View>
            <View style={styles.pinIcon}>
              <Icon name="pin" size={14} color="#000000" />
            </View>
            {selectedItems.tee ? (
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('tee')}
              >
                <Icon name="close" size={16} color="#000000" />
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
                <Icon name="close" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.tee} size={70} color="#B0B0B0" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('tee', 'tee-right')}
              >
                <Icon name="plus" size={16} color="#000000" />
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
                <Icon name="close" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.pants} size={85} color="#B0B0B0" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('pants')}
              >
                <Icon name="plus" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Socks placeholder - Bottom Left */}
        <View style={[styles.itemPlaceholder, styles.socksPlaceholder]}>
          {selectedItems.socks ? (
            <>
              <Image 
                source={{ uri: selectedItems.socks.image }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveItem('socks')}
              >
                <Icon name="close" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.socks} size={50} color="#B0B0B0" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('socks')}
              >
                <Icon name="plus" size={16} color="#000000" />
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
                <Icon name="close" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.shoes} size={65} color="#B0B0B0" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('shoes')}
              >
                <Icon name="plus" size={16} color="#000000" />
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
                <Icon name="close" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={placeholderIcons.bag} size={60} color="#B0B0B0" style={styles.placeholderIcon} />
              <TouchableOpacity 
                style={styles.plusButton}
                onPress={() => handlePlusButtonPress('bag')}
              >
                <Icon name="plus" size={16} color="#000000" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Bottom Section - Tops Category */}
      <View style={[styles.categorySection, { paddingBottom: (Platform.OS === 'ios' ? 120 : 100) + insets.bottom }]}>
        <Text style={styles.categoryTitle}>Tops</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {topsItems.map((item) => (
            <View key={item.id} style={styles.categoryItem}>
              {item.empty ? (
                <View style={styles.emptyItemSlot}>
                  <View style={styles.emptyLine} />
                </View>
              ) : (
                <View style={styles.categoryItemImage}>
                  <Icon name={placeholderIcons.tee} size={40} color="#4A4A4A" />
                </View>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addMoreButton}>
            <Icon name="plus" size={20} color="#000000" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Collection Modal */}
      <Modal
        visible={showCollectionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCollectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowCollectionModal(false)}
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
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.collectionCarouselSurface}>
              <Animated.FlatList
                data={selectedCollectionType ? collectionItems[selectedCollectionType] : []}
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
              />
            </View>
        </View>
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
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCancelSave}
          />
          <View style={[styles.saveModalContent, { paddingBottom: 40 + insets.bottom }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Save Outfit</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCancelSave}
              >
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.saveModalBody}>
              <Text style={styles.saveModalLabel}>Outfit Name</Text>
              <TextInput
                style={styles.saveModalInput}
                placeholder="Enter outfit name"
                placeholderTextColor="#999999"
                value={outfitName}
                onChangeText={setOutfitName}
                autoFocus={true}
              />

              <View style={styles.saveModalButtons}>
                <TouchableOpacity 
                  style={[styles.saveModalButton, styles.cancelButton]}
                  onPress={handleCancelSave}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.saveModalButton, styles.saveButton]}
                  onPress={handleSaveOutfit}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFCF1',
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
    color: '#000000',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FDFF8D',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  socksPlaceholder: {
    bottom: '20%',
    left: '4%',
    width: 85,
    height: 60,
    borderRadius: 30,
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
    backgroundColor: '#FDFF8D',
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  removeButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  categorySection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FFFCF1',
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLine: {
    width: 40,
    height: 2,
    backgroundColor: '#666666',
  },
  categoryItemImage: {
    width: 60,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreButton: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FDFF8D',
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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
  collectionModalContent: {
    backgroundColor: '#FFFCF1',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingHorizontal: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  modalTitle: {
    fontSize: 26,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDFF8D',
  },
  collectionItemsScrollView: {
    marginHorizontal: 4,
  },
  collectionItemsContainer: {
    paddingVertical: 8,
    alignItems: 'center',
    paddingBottom: 24,
  },
  collectionCarouselSurface: {
    backgroundColor: '#1f2026',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  collectionItemCard: {
    width: 220,
    marginRight: 16,
    marginBottom: 20,
    backgroundColor: '#e3b04b',
    borderWidth: 0,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  collectionItemPressable: {
    flex: 1,
  },
  collectionImageContainer: {
    width: '100%',
    position: 'relative',
  },
  collectionItemImage: {
    width: '100%',
    height: 240,
    borderRadius: 18,
  },
  collectionItemIconFallback: {
    width: '100%',
    height: 240,
    backgroundColor: '#e3b04b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  collectionTintOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  collectionItemLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
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
  saveModalContent: {
    backgroundColor: '#FFFCF1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  saveModalBody: {
    paddingTop: 8,
  },
  saveModalLabel: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginBottom: 12,
  },
  saveModalInput: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FDFF8D',
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'GTMaruMedium',
    color: '#000000',
    marginBottom: 24,
  },
  saveModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  saveModalButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
  },
  saveButton: {
    backgroundColor: '#FDFF8D',
    borderColor: '#000000',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'GTMaruBold',
    color: '#000000',
  },
});

export default StudioScreen;
