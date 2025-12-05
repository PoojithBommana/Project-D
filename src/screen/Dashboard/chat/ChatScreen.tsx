import { View, Text, SafeAreaView, StyleSheet, Alert, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';

import {
  CometChatConversations,
  CometChatUIKit,
  CometChatUiKitConstants,
  UIKitSettings,
  CometChatThemeProvider,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postApiCall } from '../../../config/apiCall';

const APP_ID = '16725997cf6bd98ab';
const REGION = 'in';
const API_KEY = '607d98a69434ec1c8874b048466634d1f4370a60';
export default function ChatScreen({ route, navigation }: any) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [messageUser, setMessageUser] = useState<CometChat.User>();
  const [messageGroup, setMessageGroup] = useState<CometChat.Group>();

  // useEffect(() => {
  //   initializeCommetChatSdk();
  // }, []);
  useEffect(() => {
    const init = async () => {
      // 1️⃣  Configure the UI Kit.
      const uiKitSettings: UIKitSettings = {
        appId: APP_ID,
        authKey: 'fd5561f7ff5fcdb8077204f03d206666d0e12a04',
        region: REGION,
        subscriptionType: CometChat.AppSettings
          .SUBSCRIPTION_TYPE_ALL_USERS as UIKitSettings['subscriptionType'],
      };

      try {
        await CometChatUIKit.init(uiKitSettings);
        console.log('[CometChatUIKit] initialized');

        // 2️⃣  Login.
        await CometChatUIKit.login({ uid: 'cometchat-uid-2' });
        setLoggedIn(true);
      } catch (err) {
        console.error('[CometChatUIKit] init/login error', err);
      }
    };

    init();
  }, []);

  const apiCalls = async (method: string, endpoints: string, body?: any) => {
    const baseUrl = `https://${APP_ID}.api-${REGION}.cometchat.io/v3/${endpoints}`;
    console.log(baseUrl, '----baseurl');
    try {
      const fetchApiCall = await fetch(baseUrl, {
        method: method,
        headers: {
          apikey: API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const parseJson = await fetchApiCall.json();
      return parseJson;
    } catch (error) {
      return error;
    }
  };

  const initializeCommetChatSdk = async () => {
    let uikitSettings: UIKitSettings = {
      appId: '16725997cf6bd98ab',
      authKey: 'fd5561f7ff5fcdb8077204f03d206666d0e12a04',
      region: 'in',
      subscriptionType: CometChat.AppSettings
        .SUBSCRIPTION_TYPE_ALL_USERS as UIKitSettings['subscriptionType'],
    };

    await CometChatUIKit?.init(uikitSettings)
      .then(() => {
        // createRoles("Manager","Raju","raju@gmail.com","8383838384","Test@123")
        console.log('CometChatUiKit successfully initialized');
        setLoggedIn(true);
      })
      .catch(error => {
        console.log('Initialization failed with exception:', error);
      });
  };

  const loginUser = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (uid) {
        const userDetails = await CometChatUIKit.login({ uid: uid });
        await AsyncStorage.setItem('profileData', JSON.stringify(userDetails));
        console.log(userDetails, '=====>>>details');
        setLoggedIn(true);
      }
    } catch (err) {
      console.error('[CometChatUIKit] init/login error', err);
    }
  };

  const openMessagesFor = (item: CometChat.Conversation) => {
    console.log(item, '----loggedIn');
    const isUser = item.getConversationType() === 'user';
    const isGroup = item.getConversationType() === 'group';

    navigation.navigate('Messages', {
      user: isUser ? (item.getConversationWith() as CometChat.User) : undefined,
      group: isGroup
        ? (item.getConversationWith() as CometChat.Group)
        : undefined,
    });
  };

  const createUsers = async (
    fullName: string,
    role: string,
    email: string,
    phoneNum: string,
    password: string,
  ) => {
    const params = {
      uid: 'user-' + Math.random().toString(36).substring(2, 15),
      name: fullName,
      avatar:
        'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png',
      link: 'https://placeHolder.com',
      role: role,
      statusMessage: 'Success',
      metadata: {
        '@private': {
          email: email,
          contactNumber: phoneNum,
          password: password,
        },
      },
      tags: [],
      withAuthToken: true,
    };

    const responseData = await apiCalls('POST', 'users', params);
    console.log(responseData, '-----22222222');
    if (responseData?.data) {
      const { uid } = responseData?.data || {};
      await AsyncStorage.setItem('uid', uid);
      await AsyncStorage.setItem(
        'userDetails',
        JSON.stringify(responseData?.data),
      );
      setLoggedIn(true);
      // navigation?.navigate("BottomTabNavigator")
    } else if (responseData?.error) {
      Alert.alert('', responseData?.error?.message);
    }
  };

  const createRoles = async (
    role: string,
    fullName: string,
    email: string,
    phoneNum: string,
    password: string,
  ) => {
    const params = {
      role: role,
      name: fullName,
      description: 'cool',
      metadata: {
        '@private': {
          email: email,
          contactNumber: phoneNum,
          password: password,
        },
      },
      settings: {},
    };

    const responseData = await apiCalls('POST', 'roles', params);
    console.log(responseData, '-----responseData1111');
    if (responseData?.data) {
      const { role, name, metadata } = responseData?.data || {};
      console.log(metadata.metadata?.email, '---shshshs');
      createUsers(name, role, 'raju@gmail.com', '8383838384', 'Test@123');
    } else if (responseData?.error) {
      Alert.alert('', responseData?.error?.message);
    }
  };
  return (
    <View style={{flex:1}}>
      <StatusBar hidden/>
      <CometChatThemeProvider>
        {loggedIn && (
          <>
            <CometChatConversations
              onItemPress={openMessagesFor}
              selectionMode="none"
            />
          </>
        )}
      </CometChatThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  text: {
    fontSize: 26,
    color: 'white',
    fontFamily: 'Lato-Italic',
  },
  subTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Lato-Regular',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Lato-Bold',
  },
});
