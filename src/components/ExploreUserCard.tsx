import { COLORS } from '@/lib/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { UserResponse } from 'stream-chat';

/*
========================================================
TYPE: ExploreUserCardProps
========================================================

Defines the props this component receives.

item
→ A user object returned from Stream API.

Example:
{
  id: "rahul",
  name: "Rahul Sharma",
  image: "https://...",
  online: true
}

creating
→ Holds the ID of the user whose chat is currently
being created.

Example:
creating = "rahul"

This allows us to show a loading spinner only for that user.

onStartChat
→ Function that creates a chat channel with the user.
*/
type ExploreUserCardProps = {
  item: UserResponse;
  creating: string | null;
  onStartChat: (targetId: string) => void;
};

export default function ExploreUserCard({
  item,
  creating,
  onStartChat,
}: ExploreUserCardProps) {
  /*
  ========================================================
  COMPONENT UI
  ========================================================

  This card represents a single user in the Explore screen.

  Example UI:

  [Avatar]   Rahul Sharma     💬
             Online
  */

  return (
    <Pressable
      /*
      Layout:
      - horizontal row
      - avatar + user info + chat button
      */
      className="flex-row items-center bg-surface rounded-2xl p-3.5 mb-2.5 border border-border gap-3.5"
      /*
      When user taps the card
      → start chat with this user
      */
      onPress={() => onStartChat(item.id)}
      /*
      Disable pressing if another chat is currently
      being created.

      This prevents multiple channel creation requests.
      */
      disabled={creating !== null}
    >
      {/* ==================================================
          USER AVATAR
         ================================================== */}

      <Image
        source={item.image}
        style={{ width: 48, height: 48, borderRadius: 24 }}
        contentFit="cover"
      />

      {/* ==================================================
          ONLINE STATUS DOT
         ==================================================

         If user is online, show green dot on avatar
      */}

      {item.online && (
        <View className="w-3 h-3 rounded-full bg-accent-secondary absolute left-[50px] top-[46px] border-2 border-surface" />
      )}

      {/* ==================================================
          USER INFO SECTION
         ================================================== */}

      <View className="flex-1">
        {/* USER NAME */}
        <Text
          className="text-base font-semibold text-foreground"
          numberOfLines={1}
        >
          {/* fallback to ID if name missing */}
          {item.name || item.id}
        </Text>

        {/* ONLINE / OFFLINE STATUS */}
        <Text className="text-xs text-foreground-muted mt-0.5">
          {item.online ? 'Online' : 'Offline'}
        </Text>
      </View>

      {/* ==================================================
          CHAT BUTTON / LOADING STATE
         ================================================== */}

      {creating === item.id ? (
        /*
        If chat with this user is being created
        show loading spinner
        */
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        /*
        Otherwise show chat icon button
        */
        <View className="w-9 h-9 rounded-xl bg-primary/20 justify-center items-center">
          <Ionicons name="chatbubble" size={16} color={COLORS.primary} />
        </View>
      )}
    </Pressable>
  );
}
