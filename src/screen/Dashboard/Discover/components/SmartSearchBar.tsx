import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { wp, hp, rf } from '../../../../utils/responsive';

interface SmartSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  showFilter?: boolean;
}

export default function SmartSearchBar({
  onSearch,
  placeholder = 'Search people, vibes, or interests',
  showFilter = true,
}: SmartSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleFilterPress = () => {
    // TODO: Open filter modal
    console.log('Filter pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#666666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {showFilter && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <Icon name="options" size={20} color="#000000" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(20),
    paddingVertical: hp(12),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: rf(12),
    paddingHorizontal: wp(16),
    paddingVertical: hp(12),
    borderWidth: 2,
    borderColor: '#FEFFAF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: wp(12),
  },
  input: {
    flex: 1,
    fontSize: rf(15),
    fontFamily: 'GTMaruRegular',
    color: '#000000',
    padding: 0,
    includeFontPadding: false,
  },
  filterButton: {
    padding: wp(4),
    marginLeft: wp(8),
  },
});

