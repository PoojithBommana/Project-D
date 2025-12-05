import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatGroupMembers,
  CometChatUIEventHandler, // ← correct composer,
} from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CommonUtils } from '@cometchat/chat-uikit-react-native/src/shared/utils/CommonUtils';
const Messages = ({ route, navigation }: any) => {
  const { user, group, fromMention = false } = route.params;
  const [groups, setGroups] = useState<CometChat.Group | undefined>(undefined);
  const [localUser, setLocalUser] = useState<CometChat.User | undefined>(user);

  const userListenerId = 'app_messages' + new Date().getTime();
  const openmessageListenerId = 'message_' + new Date().getTime();

  const handleccUserUnBlocked = ({ user }: { user: CometChat.User }) => {
    setLocalUser(CommonUtils.clone(user));
  };
  const handleccUserBlocked = ({ user }: { user: CometChat.User }) => {
    setLocalUser(CommonUtils.clone(user));
  };

  useEffect(() => {
    CometChatUIEventHandler.addUserListener(userListenerId, {
      ccUserBlocked: (item: { user: CometChat.User }) =>
        handleccUserBlocked(item),
      ccUserUnBlocked: (item: { user: CometChat.User }) =>
        handleccUserUnBlocked(item),
    });

    CometChatUIEventHandler.addUIListener(openmessageListenerId, {
      openChat: ({ user }) => {
        if (user != undefined) {
          navigation.push('Messages', {
            user,
          });
        }
      },
    });

    return () => {
      CometChatUIEventHandler.removeUserListener(userListenerId);
      CometChatUIEventHandler.removeUIListener(openmessageListenerId);
    };
  }, [localUser]);
  return (
    <View style={styles.root}>
      <CometChatMessageHeader
        user={user}
        group={group}
        onBack={() => navigation?.goBack()}
        showBackButton ={true}
        hideVoiceCallButton = {true}
        hideVideoCallButton = {true}
        usersStatusVisibility = {true}
        AuxiliaryButtonView={({
          user,
          group,
        }: {
          user?: CometChat.User;
          group?: CometChat.Group;
        }) => {
          return (
            <View style={styles.rightActionsBox}>
               <TouchableOpacity>
                <Image source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWGxYbugmc9bUZzaJAh2TOqgrLtcGOrY_qpg&s"}} style={{height:28,width:28}} resizeMode='contain'/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqvIH0qQEwp_XV51RMqRW30rtrLvU0EI9wTg&s"}} style={{height:20,width:20}} resizeMode='contain'/>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <CometChatMessageList user={user} group={group} />

      <CometChatMessageComposer user={user} group={group} />
      {groups && <CometChatGroupMembers group={groups} />}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    marginTop:30,
    marginBottom:25
  },
  rightActionsBox:{justifyContent:"space-between",flexDirection:"row",alignItems:"center",width:60}
});

export default Messages;
