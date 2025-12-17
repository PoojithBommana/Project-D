import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigation';
import styles from '../../styles/HeightScreenStyles';
import { rs } from '../../utils/responsive';

type Props = {
  navigation?: NativeStackNavigationProp<OnboardingStackParamList, 'HeightScreen'>;
  route?: {
    params: {
      firstName: string;
      lastName: string;
      username?: string;
      gender: string;
      age: number;
      showOnlyFirstLetter: boolean;
      height?: number;
    };
  };
};

const ITEM_HEIGHT = rs(48);
const VISIBLE_ITEMS = 5;

export default function HeightScreen({ navigation, route }: Props) {
  const initialHeight = route?.params?.height ?? 157;
  const heightOptions = useMemo(
    () => Array.from({ length: 81 }, (_, index) => 140 + index),
    []
  );
  const initialIndex = Math.max(
    0,
    Math.min(heightOptions.length - 1, heightOptions.indexOf(initialHeight) || 0)
  );

  const listRef = useRef<FlatList<number>>(null);
  const [selectedHeight, setSelectedHeight] = useState<number>(
    heightOptions[initialIndex]
  );

  useEffect(() => {
    if (listRef.current) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      });
    }
  }, [initialIndex]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const nextValue = heightOptions[index] ?? selectedHeight;
    setSelectedHeight(nextValue);
  };

  const handleSelect = (item: number, index: number) => {
    setSelectedHeight(item);
    listRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const handleContinue = () => {
    navigation?.navigate('LifestyleHabitsScreen', {
      firstName: route?.params?.firstName || '',
      lastName: route?.params?.lastName || '',
      username: route?.params?.username || '',
      gender: route?.params?.gender || '',
      age: route?.params?.age || 0,
      showOnlyFirstLetter: route?.params?.showOnlyFirstLetter || false,
      height: selectedHeight,
      music_artist_ids: route?.params?.music_artist_ids,
      music_genres: route?.params?.music_genres,
    });
  };

  const progress = 75;
  const selectorHeight = ITEM_HEIGHT * VISIBLE_ITEMS;
  const sidePadding = ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>Now, let’s talk about you</Text>
          <Text style={styles.subheading}>
            Let’s get the small talk out of the way. We’ll get into the deep and meaningful
            later.
          </Text>

          <View style={styles.labelRow}>
            <Text style={styles.label}>Your height</Text>
          </View>

          <View style={[styles.selectorContainer, { height: selectorHeight }]}>
            <FlatList
              ref={listRef}
              data={heightOptions}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              bounces={false}
              contentContainerStyle={{
                paddingTop: sidePadding,
                paddingBottom: sidePadding,
              }}
              onMomentumScrollEnd={handleScrollEnd}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              renderItem={({ item, index }) => {
                const isSelected = item === selectedHeight;
                return (
                  <TouchableOpacity
                    style={[styles.itemContainer, { height: ITEM_HEIGHT }]}
                    onPress={() => handleSelect(item, index)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                      {item} cm
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <View style={[styles.selectionOverlay, { height: ITEM_HEIGHT }]} />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

