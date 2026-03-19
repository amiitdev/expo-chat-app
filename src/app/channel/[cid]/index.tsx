// UI component shown when there are no messages in the chat
// Example: When you open a new WhatsApp chat and it shows "Send a message to start conversation"
import { EmptyState } from '@/components/EmptyState';

// Loader used while the chat channel is being fetched
// Example: When you click a chat and WhatsApp briefly shows a loading spinner
import FullScreenLoader from '@/components/FullScreenLoader';

// Global context where current chat channel and thread state are stored
// Think of it like a global store telling the app "which chat room user opened"
import { useAppContext } from '@/contexts/AppProvider';

// Theme colors used across the app (dark/light consistency)
import { COLORS } from '@/lib/theme';

// Icon library used for UI icons like back arrow or video call
import { Ionicons } from '@expo/vector-icons';

// Hook that gives the navigation header height
// Needed so the keyboard does not cover the message input field
import { useHeaderHeight } from '@react-navigation/elements';

// Optimized image component (better performance than default Image)
import { Image } from 'expo-image';

// Router used for navigation between screens
// Example: opening call screen or going back
import { useNavigation, useRouter } from 'expo-router';

// Hook that runs before the screen is painted (no UI flicker)
import { useLayoutEffect } from 'react';

// Core React Native components
import { Text, TouchableOpacity, View } from 'react-native';

// Stream Chat components
// Channel → main chat container
// MessageList → list of messages
// MessageInput → typing input box
// useChatContext → gives access to logged-in user and chat client
import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from 'stream-chat-expo';

const ChannelScreen = () => {
  // channel = currently opened chat room
  // setThread = used when user opens message replies (thread)
  const { channel, setThread } = useAppContext();

  // client contains logged in user information
  // Example: user id of the current user
  const { client } = useChatContext();

  // Router used to navigate between pages
  const router = useRouter();

  // Navigation object used to customize header UI
  const navigation = useNavigation();

  // Height of navigation header (used for keyboard offset)
  const headerHeight = useHeaderHeight();

  // These variables will store the other user's name and avatar
  // Example: if Amit chats with Rahul, displayName = Rahul
  let displayName = '';
  let avatarUrl = '';

  // If channel exists, find the other user in the chat
  // because channel.members contains BOTH users
  if (channel) {
    // Convert members object to array
    const members = Object.values(channel.state.members);

    // Find the user who is NOT the logged-in user
    // Example:
    // members = [Amit, Rahul]
    // client.userID = Amit
    // otherMember = Rahul
    const otherMember = members.find(
      (member) => member.user_id !== client.userID,
    );

    // Get the other user's name
    displayName = otherMember?.user?.name!;

    // Get the other user's avatar image
    avatarUrl = otherMember?.user?.image || '';
  }

  // 🔹 useLayoutEffect vs useEffect
  // useLayoutEffect runs BEFORE UI is painted
  // useEffect runs AFTER UI is painted
  //
  // Real Example:
  // If we used useEffect here,
  // header would briefly show default title then update → flicker.
  //
  // useLayoutEffect prevents that flicker.
  useLayoutEffect(() => {
    navigation.setOptions({
      // show header for this screen
      headerShown: true,

      // set header background color
      headerStyle: {
        backgroundColor: COLORS.surface,
      },

      // color of header icons/text
      headerTintColor: COLORS.text,

      // LEFT SIDE OF HEADER (Back Button)
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          className="ml-2 flex-row items-center"
        >
          {/* Back arrow icon */}
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      ),

      // CENTER HEADER TITLE
      // Shows avatar + username
      // Example: WhatsApp chat header
      headerTitle: () => (
        <View className="flex-row items-center">
          {avatarUrl ? (
            // If user has profile photo show it
            <Image
              source={avatarUrl}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginRight: 10,
              }}
            />
          ) : (
            // If no avatar → show first letter of name
            // Example: "R" for Rahul
            <View
              className="mr-2.5 h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Text className="text-base font-semibold text-foreground">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {/* Display user name */}
          <Text className="font-semibold text-foreground">{displayName}</Text>
        </View>
      ),

      // RIGHT SIDE HEADER (Video Call Button)
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Navigate to video call screen
            // Example: WhatsApp video call button
            // router.push({
            //   pathname: '/call/[callId]',
            //   params: { callId: channel?.id! },
            // });
          }}
        >
          <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, displayName, avatarUrl, channel?.cid, channel?.id, router]);

  // If channel is not loaded yet show loader
  if (!channel) return <FullScreenLoader message="Loading study room..." />;

  return (
    // Main container
    <View className="flex-1 bg-border">
      {/* Stream Chat Channel wrapper */}
      <Channel
        channel={channel}
        // Prevent keyboard from covering input field
        keyboardVerticalOffset={headerHeight}
        // UI shown when no messages exist
        EmptyStateIndicator={() => (
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No messages yet"
            subtitle="Send a message to start conversation"
          />
        )}
      >
        {/* List of chat messages */}
        <MessageList
          onThreadSelect={(thread) => {
            // When user taps "reply thread"
            // Example: replying to a specific message like Slack

            setThread(thread);

            router.push(`/channel/${channel.cid}/thread/${thread?.cid}`);
          }}
        />

        {/* Message input container */}
        <View className="pb-5 bg-surface">
          {/* Text input + voice message support */}
          <MessageInput audioRecordingEnabled />
        </View>
      </Channel>
    </View>
  );
};

export default ChannelScreen;
