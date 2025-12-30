import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../../navigation/SettingsStackNavigator';
import styles from '../../../styles/AccountManagementScreenStyles';

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'AccountManagementScreen'>;
}

export default function AccountManagementScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFCF1" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* Profiles and Personal Details Section */}
            <View style={styles.section}>
            <Text style={styles.sectionHeader}>Profiles and personal details</Text>
            <Text style={styles.sectionDescription}>
              Manage your profile information and personal details.
            </Text>

            <TouchableOpacity
              style={styles.listItem}
              onPress={() => navigation?.navigate('ProfileDetailsScreen')}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../../assets/user.png')}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>Profiles and personal details</Text>
                <Text style={styles.listItemSubtitle}>yours.tej</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#666666" style={styles.listItemArrow} />
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

