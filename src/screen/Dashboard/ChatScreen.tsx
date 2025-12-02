import { View, Text } from 'react-native';
import React, { useEffect } from 'react';

import {
  CometChatUIKit,
  UIKitSettings,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

export default function ChatScreen() {
  useEffect(() => {
    initializeCommetChatSdk();
  }, []);

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
        console.log('CometChatUiKit successfully initialized');
      })
      .catch(error => {
        console.log('Initialization failed with exception:', error);
      });
  };

  return (
    <View>
      <Text>ChatScreen</Text>
    </View>
  );
}
