import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StatusBar,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../../navigation/SettingsStackNavigator';
import { wp, hp, rf, rs } from '../../../utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiCall, patchApiCall } from '../../../config/apiCall';

interface Props {
  navigation?: NativeStackNavigationProp<SettingsStackParamList, 'ProfileDetailsScreen'>;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  dateOfBirth: string;
  profilePhoto?: string;
}

export default function ProfileDetailsScreen({ navigation }: Props) {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    dateOfBirth: '',
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingField, setPendingField] = useState<string>('');
  const [pendingCurrentValue, setPendingCurrentValue] = useState<string>('');
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const profileResponse = await getApiCall('AUTH', 'GET_PROFILE', accessToken);
      if (!profileResponse?.error && profileResponse?.response) {
        const profile = profileResponse.response.profile || profileResponse.response;
        setProfileData({
          firstName: profile.first_name || profile.firstName || '',
          lastName: profile.last_name || profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || profile.phone_number || '',
          username: profile.username || '',
          dateOfBirth: profile.date_of_birth || profile.birthdate || profile.dateOfBirth || '',
          profilePhoto: profile.profile_photo || profile.profilePhoto,
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditField = (field: string, currentValue: string) => {
    console.log('handleEditField called:', field, currentValue);
    setPendingField(field);
    setPendingCurrentValue(currentValue);
    setShowConfirmModal(true);
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleModalNo = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmModal(false);
      setPendingField('');
      setPendingCurrentValue('');
    });
  };

  const handleModalYes = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmModal(false);
      setEditingField(pendingField);
      setEditValue(pendingCurrentValue);
      setPendingField('');
      setPendingCurrentValue('');
    });
  };

  const getFieldLabel = (field: string): string => {
    switch (field) {
      case 'firstName':
        return 'First Name';
      case 'lastName':
        return 'Last Name';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      case 'username':
        return 'Username';
      case 'dateOfBirth':
        return 'Date of Birth';
      default:
        return field;
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveField = async (field: string) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('Error', 'Please log in again.');
        return;
      }

      const updateData: any = {};
      switch (field) {
        case 'firstName':
          updateData.first_name = editValue;
          break;
        case 'lastName':
          updateData.last_name = editValue;
          break;
        case 'email':
          updateData.email = editValue;
          break;
        case 'phone':
          updateData.phone = editValue;
          break;
        case 'username':
          updateData.username = editValue;
          break;
        case 'dateOfBirth':
          updateData.date_of_birth = editValue;
          break;
      }

      const response = await patchApiCall('AUTH', 'UPDATE_PROFILE', updateData, accessToken);
      if (!response?.error) {
        setProfileData(prev => ({
          ...prev,
          [field]: editValue,
        }));
        setEditingField(null);
        setEditValue('');
        Alert.alert('Success', 'Profile updated successfully.');
      } else {
        Alert.alert('Error', response.response?.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    // Simple formatting - can be enhanced
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };
  const styles = {
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFCF1',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFCF1',
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'flex-end' as const,
      paddingHorizontal: wp(20),
      paddingTop: hp(60),
      paddingBottom: hp(16),
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    backButton: {
      width: wp(40),
      height: hp(40),
      justifyContent: 'flex-end' as const,
      alignItems: 'flex-start' as const,
    },
    headerTitle: {
      fontSize: rf(22),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      textAlign: 'left' as const,
      marginLeft: wp(12),
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: hp(24),
      paddingBottom: hp(40),
      paddingHorizontal: wp(20),
    },
    cardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: rs(16),
      paddingVertical: hp(20),
      paddingHorizontal: wp(20),
      marginBottom: hp(32),
    },
    profileSection: {
      alignItems: 'center' as const,
      marginBottom: hp(32),
    },
    profileImage: {
      width: wp(80),
      height: wp(80),
      borderRadius: wp(40),
      marginBottom: hp(16),
    },
    profileName: {
      fontSize: rf(20),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      marginBottom: hp(8),
    },
    username: {
      fontSize: rf(16),
      fontFamily: 'GTMaruRegular',
      color: '#666666',
    },
    section: {
      marginBottom: hp(8),
    },
    sectionHeader: {
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      marginBottom: hp(12),
    },
    profileFieldRow: {
      paddingVertical: hp(16),
    },
    profileFieldRowInner: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      position: 'relative' as const,
    },
    profileFieldContent: {
      flex: 1,
      marginRight: wp(12),
    },
    profileFieldLabel: {
      fontSize: rf(14),
      fontFamily: 'GTMaruBold',
      color: '#666666',
      marginBottom: hp(4),
    },
    profileFieldValue: {
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#000000',
    },
    profileFieldInput: {
      width: '100%',
      height: hp(56),
      backgroundColor: '#FFFFFF',
      borderRadius: rs(12),
      borderWidth: 2,
      borderColor: '#E5E5E5',
      paddingHorizontal: wp(16),
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      marginTop: hp(8),
    },
    profileFieldInputFocused: {
      borderColor: '#FEFFAF',
    },
    editIconButton: {
      padding: wp(8),
      width: 44,
      height: 44,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      zIndex: 10,
      elevation: 10,
      backgroundColor: 'transparent',
    },
    saveCancelRow: {
      flexDirection: 'row' as const,
      justifyContent: 'flex-end' as const,
      marginTop: hp(12),
      gap: wp(12),
    },
    saveButton: {
      paddingHorizontal: wp(20),
      paddingVertical: hp(10),
      borderRadius: rs(8),
      backgroundColor: '#FDDA0D',
    },
    saveButtonText: {
      fontSize: rf(14),
      fontFamily: 'GTMaruBold',
      color: '#FFFFFF',
    },
    cancelButton: {
      paddingHorizontal: wp(20),
      paddingVertical: hp(10),
      borderRadius: rs(8),
      backgroundColor: '#F5F5F5',
    },
    cancelButtonText: {
      fontSize: rf(14),
      fontFamily: 'GTMaruBold',
      color: '#666666',
    },
    fieldDivider: {
      height: 1,
      backgroundColor: '#E5E5E5',
      marginVertical: hp(16),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: wp(24),
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: rs(20),
      paddingHorizontal: wp(32),
      paddingVertical: hp(32),
      width: '100%',
      maxWidth: wp(320),
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 12,
    },
    modalIconContainer: {
      marginBottom: hp(20),
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: rf(22),
      fontFamily: 'GTMaruBold',
      color: '#000000',
      textAlign: 'center',
      marginBottom: hp(12),
      lineHeight: rf(30),
    },
    modalSubtext: {
      fontSize: rf(14),
      fontFamily: 'GTMaruRegular',
      color: '#666666',
      textAlign: 'center',
      lineHeight: rf(20),
      marginBottom: hp(32),
    },
    modalButtonContainer: {
      flexDirection: 'row' as const,
      width: '100%',
      justifyContent: 'space-between' as const,
      gap: wp(12),
    },
    modalButton: {
      flex: 1,
      height: hp(48),
      borderRadius: rs(12),
      borderWidth: 2,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    modalButtonNo: {
      borderColor: '#E0E0E0',
      backgroundColor: '#FFFFFF',
    },
    modalButtonYes: {
      borderColor: '#FDFF8D',
      backgroundColor: '#FDFF8D',
    },
    modalButtonText: {
      fontSize: rf(16),
      fontFamily: 'GTMaruBold',
      color: '#666666',
    },
    modalButtonTextYes: {
      color: '#000000',
    },
  };

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
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* White Card Container */}
          <View style={styles.cardContainer}>
            {/* Profile Photo Section */}
            <View style={styles.profileSection}>
              {profileData.profilePhoto ? (
                <Image
                  source={{ uri: profileData.profilePhoto }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../../../assets/user.png')}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.profileName}>
                {profileData.firstName || profileData.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`.trim()
                  : 'Your Profile'}
              </Text>
              {profileData.username && (
                <Text style={styles.username}>@{profileData.username}</Text>
              )}
            </View>

            {/* Edit Profile Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Edit Profile Details</Text>
              
              {/* First Name Field */}
              {editingField === 'firstName' ? (
                <View style={styles.profileFieldRow}>
                  <View style={styles.profileFieldContent}>
                    <Text style={styles.profileFieldLabel}>First Name</Text>
                    <TextInput
                      style={styles.profileFieldInput}
                      value={editValue}
                      onChangeText={setEditValue}
                      placeholder="First name"
                      placeholderTextColor="#999999"
                      autoFocus
                    />
                    <View style={styles.saveCancelRow}>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit} activeOpacity={0.7}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveField('firstName')} activeOpacity={0.7}>
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.profileFieldRow,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => {
                    console.log('Edit row pressed for firstName');
                    handleEditField('firstName', profileData.firstName);
                  }}
                >
                  <View style={styles.profileFieldRowInner}>
                    <View style={styles.profileFieldContent}>
                      <Text style={styles.profileFieldLabel}>First Name</Text>
                      <Text style={styles.profileFieldValue}>
                        {profileData.firstName || 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.editIconButton}>
                      <Icon name="create-outline" size={20} color="#666666" />
                    </View>
                  </View>
                </Pressable>
              )}
              <View style={styles.fieldDivider} />

              {/* Last Name Field */}
              {editingField === 'lastName' ? (
                <View style={styles.profileFieldRow}>
                  <View style={styles.profileFieldContent}>
                    <Text style={styles.profileFieldLabel}>Last Name</Text>
                    <TextInput
                      style={styles.profileFieldInput}
                      value={editValue}
                      onChangeText={setEditValue}
                      placeholder="Last name"
                      placeholderTextColor="#999999"
                      autoFocus
                    />
                    <View style={styles.saveCancelRow}>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit} activeOpacity={0.7}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveField('lastName')} activeOpacity={0.7}>
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.profileFieldRow,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => handleEditField('lastName', profileData.lastName)}
                >
                  <View style={styles.profileFieldRowInner}>
                    <View style={styles.profileFieldContent}>
                      <Text style={styles.profileFieldLabel}>Last Name</Text>
                      <Text style={styles.profileFieldValue}>
                        {profileData.lastName || 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.editIconButton}>
                      <Icon name="create-outline" size={20} color="#666666" />
                    </View>
                  </View>
                </Pressable>
              )}
              <View style={styles.fieldDivider} />

              {/* Email Field */}
              {editingField === 'email' ? (
                <View style={styles.profileFieldRow}>
                  <View style={styles.profileFieldContent}>
                    <Text style={styles.profileFieldLabel}>Email</Text>
                    <TextInput
                      style={styles.profileFieldInput}
                      value={editValue}
                      onChangeText={setEditValue}
                      placeholder="Email address"
                      placeholderTextColor="#999999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoFocus
                    />
                    <View style={styles.saveCancelRow}>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit} activeOpacity={0.7}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveField('email')} activeOpacity={0.7}>
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.profileFieldRow,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => handleEditField('email', profileData.email)}
                >
                  <View style={styles.profileFieldRowInner}>
                    <View style={styles.profileFieldContent}>
                      <Text style={styles.profileFieldLabel}>Email</Text>
                      <Text style={styles.profileFieldValue}>{profileData.email || 'Not set'}</Text>
                    </View>
                    <View style={styles.editIconButton}>
                      <Icon name="create-outline" size={20} color="#666666" />
                    </View>
                  </View>
                </Pressable>
              )}
              <View style={styles.fieldDivider} />

              {/* Phone Field */}
              {editingField === 'phone' ? (
                <View style={styles.profileFieldRow}>
                  <View style={styles.profileFieldContent}>
                    <Text style={styles.profileFieldLabel}>Phone</Text>
                    <TextInput
                      style={styles.profileFieldInput}
                      value={editValue}
                      onChangeText={setEditValue}
                      placeholder="Phone number"
                      placeholderTextColor="#999999"
                      keyboardType="phone-pad"
                      autoFocus
                    />
                    <View style={styles.saveCancelRow}>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit} activeOpacity={0.7}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveField('phone')} activeOpacity={0.7}>
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.profileFieldRow,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => handleEditField('phone', profileData.phone)}
                >
                  <View style={styles.profileFieldRowInner}>
                    <View style={styles.profileFieldContent}>
                      <Text style={styles.profileFieldLabel}>Phone</Text>
                      <Text style={styles.profileFieldValue}>
                        {profileData.phone ? formatPhone(profileData.phone) : 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.editIconButton}>
                      <Icon name="create-outline" size={20} color="#666666" />
                    </View>
                  </View>
                </Pressable>
              )}
              <View style={styles.fieldDivider} />

              {/* Username Field */}
              {editingField === 'username' ? (
                <View style={styles.profileFieldRow}>
                  <View style={styles.profileFieldContent}>
                    <Text style={styles.profileFieldLabel}>Username</Text>
                    <TextInput
                      style={styles.profileFieldInput}
                      value={editValue}
                      onChangeText={setEditValue}
                      placeholder="Username"
                      placeholderTextColor="#999999"
                      autoCapitalize="none"
                      autoFocus
                    />
                    <View style={styles.saveCancelRow}>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit} activeOpacity={0.7}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveField('username')} activeOpacity={0.7}>
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.profileFieldRow,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => handleEditField('username', profileData.username)}
                >
                  <View style={styles.profileFieldRowInner}>
                    <View style={styles.profileFieldContent}>
                      <Text style={styles.profileFieldLabel}>Username</Text>
                      <Text style={styles.profileFieldValue}>
                        {profileData.username ? `@${profileData.username}` : 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.editIconButton}>
                      <Icon name="create-outline" size={20} color="#666666" />
                    </View>
                  </View>
                </Pressable>
              )}
              <View style={styles.fieldDivider} />

              {/* Date of Birth Field */}
              {editingField === 'dateOfBirth' ? (
                <View style={styles.profileFieldRow}>
                  <View style={styles.profileFieldContent}>
                    <Text style={styles.profileFieldLabel}>Date of Birth</Text>
                    <TextInput
                      style={styles.profileFieldInput}
                      value={editValue}
                      onChangeText={setEditValue}
                      placeholder="MM/DD/YYYY"
                      placeholderTextColor="#999999"
                      autoFocus
                    />
                    <View style={styles.saveCancelRow}>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit} activeOpacity={0.7}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveField('dateOfBirth')} activeOpacity={0.7}>
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.profileFieldRow,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => handleEditField('dateOfBirth', profileData.dateOfBirth)}
                >
                  <View style={styles.profileFieldRowInner}>
                    <View style={styles.profileFieldContent}>
                      <Text style={styles.profileFieldLabel}>Date of Birth</Text>
                      <Text style={styles.profileFieldValue}>
                        {profileData.dateOfBirth ? formatDate(profileData.dateOfBirth) : 'Not set'}
                      </Text>
                    </View>
                    <View style={styles.editIconButton}>
                      <Icon name="create-outline" size={20} color="#666666" />
                    </View>
                  </View>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirmModal}
          transparent={true}
          animationType="none"
          onRequestClose={handleModalNo}
        >
          <Animated.View
            style={[
              styles.modalOverlay,
              {
                opacity: modalOpacity,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              <View style={styles.modalIconContainer}>
                <Icon name="create-outline" size={rs(48)} color="#FDDA0D" />
              </View>
              
              <Text style={styles.modalTitle}>
                Do you want to change{'\n'}
                <Text style={{ color: '#FDDA0D' }}>{getFieldLabel(pendingField)}?</Text>
              </Text>
              
              <Text style={styles.modalSubtext}>
                You can edit this information later if needed.
              </Text>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonNo]}
                  onPress={handleModalNo}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonYes]}
                  onPress={handleModalYes}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextYes]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

