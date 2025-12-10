import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { WardrobeStackParamList, CategoryData } from './WardrobeFeature';

interface ClosetScreenProps {
  navigation?: NativeStackNavigationProp<WardrobeStackParamList, 'Closet'>;
  route?: RouteProp<WardrobeStackParamList, 'Closet'>;
}

interface ClosetItem {
  id: string;
  imageUri: string;
  title: string;
  category: string;
}

const ClosetScreen = ({ navigation, route }: ClosetScreenProps) => {
  const categoryData = route?.params?.categoryData;
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // If categoryData is provided, convert it to ClosetItem format
    if (categoryData && categoryData.items) {
      const categoryItems: ClosetItem[] = categoryData.items.map((item) => ({
        id: item.id,
        imageUri: item.image,
        title: item.name,
        category: categoryData.name,
      }));
      setItems(categoryItems);
    } else {
      // Default items if no category data
      setItems([
        { id: '1', imageUri: 'https://via.placeholder.com/150', title: 'Item #1', category: 'Category' },
        { id: '2', imageUri: 'https://via.placeholder.com/150', title: 'Item #2', category: 'Category' },
        { id: '3', imageUri: 'https://via.placeholder.com/150', title: 'Item #3', category: 'Category' },
      ]);
    }
  }, [categoryData]);

  useEffect(() => {
    // Check if a new item image was passed from Camera screen
    const newItemImage = route?.params?.newItemImage;
    if (newItemImage) {
      setItems(prevItems => {
        const newItem: ClosetItem = {
          id: Date.now().toString(),
          imageUri: newItemImage,
          title: `Item #${prevItems.length + 1}`,
          category: categoryData?.name || 'New',
        };
        return [newItem, ...prevItems];
      });
      navigation?.setParams({ newItemImage: undefined });
    }
  }, [route?.params?.newItemImage, navigation, categoryData]);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{categoryData?.name || 'Closet'}</Text>
          {categoryData && (
            <Text style={styles.headerSubtitle}>{categoryData.itemCount} items</Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666666" style={styles.searchIcon} />
        <TextInput 
          placeholder="Search items..." 
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#999999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name={categoryData ? "hanger" : "hanger"} size={80} color="#FDFF8D" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'No items found' : 'No items yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery 
              ? 'Try a different search term' 
              : 'Tap the + button to add your first item'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.itemCard} 
              activeOpacity={0.8}
              onPress={() => {
                // Could navigate to item details screen in the future
              }}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item.imageUri }} 
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <TouchableOpacity style={styles.favoriteButton}>
                    <Icon name="heart-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                {!categoryData && (
                  <Text style={styles.itemCategory} numberOfLines={1}>{item.category}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation?.navigate('Camera')}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={28} color="#000000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FDFF8D',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDFF8D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 110,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FDFF8D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  itemInfo: {
    padding: 14,
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: 'GTMaruBold',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  itemCategory: {
    fontSize: 12,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 108 : 90,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FDFF8D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 22,
    fontFamily: 'GTMaruBold',
    color: '#000000',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    fontFamily: 'GTMaruRegular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ClosetScreen;
