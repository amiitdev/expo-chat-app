import ExploreUserCard from '@/components/ExploreUserCard';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useAppContext } from '@/contexts/AppProvider';
import useStartChat from '@/hooks/useStartChat';
import useStreamUsers from '@/hooks/useStreamUsers';
import { COLORS } from '@/lib/theme';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { UserResponse } from 'stream-chat';
import { useChatContext } from 'stream-chat-expo';

const ExploreScreen = () => {
  /*
  ======================================================
  GLOBAL CHAT CONTEXT
  ======================================================

  This context stores the currently selected chat channel.

  Example:
  User taps "Rahul"
  → we create a channel
  → we store it using setChannel()
  → Chat screen reads it and shows messages
  */
  const { setChannel } = useAppContext();

  /*
  ======================================================
  CLERK AUTH USER
  ======================================================

  Gets the logged-in user from Clerk.

  Example returned user:
  {
    id: "user_123",
    firstName: "Amit",
    imageUrl: "https://..."
  }
  */
  const { user } = useUser();

  /*
  ======================================================
  STREAM CHAT CLIENT
  ======================================================

  This client connects the app to Stream servers.

  It allows:
  - creating channels
  - sending messages
  - fetching users
  */
  const { client } = useChatContext();

  /*
  Current logged-in user ID
  (fallback to empty string if not loaded yet)
  */
  const userId = user?.id ?? '';

  /*
  ======================================================
  STATE: CHAT CREATION LOADING
  ======================================================

  This tracks which user we are currently starting
  a chat with.

  Example:
  User taps Rahul

  creating = "rahul_id"

  This allows us to show a spinner beside Rahul
  while the chat channel is being created.
  */
  const [creating, setCreating] = useState<string | null>(null);

  /*
  ======================================================
  STATE: SEARCH TEXT
  ======================================================

  Stores what the user types in the search box.

  Example:
  search = "ra"
  */
  const [search, setSearch] = useState('');

  /*
  ======================================================
  FETCH STREAM USERS
  ======================================================

  Custom hook that loads users from Stream.

  It automatically excludes the current user.

  Example returned data:

  users = [
    { id: "rahul", name: "Rahul" },
    { id: "priya", name: "Priya" }
  ]

  loading = true/false
  */
  const { users, loading } = useStreamUsers(client, userId);

  /*
  ======================================================
  CHAT CREATION HOOK
  ======================================================

  This hook handles creating a new chat channel.

  Flow:

  User taps Rahul
      ↓
  handleStartChat("rahul_id")
      ↓
  Stream creates messaging channel
      ↓
  setChannel(channel)
      ↓
  Navigate to chat screen
  */
  const { handleStartChat } = useStartChat({
    client,
    userId,
    setChannel,
    setCreating,
  });

  /*
  ======================================================
  SEARCH FILTER
  ======================================================

  Filters the user list locally based on search text.

  Example:

  users = ["Rahul", "Priya", "Dev"]

  search = "ra"

  result = ["Rahul"]
  */
  const filteredUsers = users.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()),
  );

  /*
  ======================================================
  FLATLIST ITEM RENDERER
  ======================================================

  This function renders each user row.

  Example UI row:

  Rahul                      💬

  If chat is being created:

  Rahul                      ⏳
  */
  const renderUserItem = ({ item }: { item: UserResponse }) => {
    return (
      <ExploreUserCard
        item={item}
        creating={creating}
        onStartChat={handleStartChat}
      />
    );
  };

  /*
  ======================================================
  SCREEN UI
  ======================================================
  */
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* ==================================================
          HEADER SECTION
          ==================================================

          Shows page title and description
      */}
      <View className="px-5 pt-3 pb-1">
        <Text className="text-[28px] font-bold text-foreground">Explore</Text>

        <Text className="text-sm text-foreground-muted mt-1">
          Find people and start chatting
        </Text>
      </View>

      {/* ==================================================
          SEARCH BAR
          ==================================================

          Allows user to search other users
      */}
      <View className="flex-row items-center bg-surface mx-5 my-4 px-3.5 py-3 rounded-[14px] gap-2.5 border border-border">
        {/* SEARCH ICON */}
        <Ionicons name="search" size={18} color={COLORS.textMuted} />

        {/* SEARCH INPUT */}
        <TextInput
          className="flex-1 text-[15px] text-foreground"
          placeholder="Search people..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* CLEAR SEARCH BUTTON */}
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {/* ==================================================
          USER LIST OR LOADING STATE
          ==================================================
      */}

      {loading ? (
        /*
        Show spinner while loading users
        */
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        /*
        Show list of users
        */
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          /*
          Show empty component if no users match search
          */
          ListEmptyComponent={<ListEmptyComponent />}
        />
      )}
    </SafeAreaView>
  );
};

export default ExploreScreen;
