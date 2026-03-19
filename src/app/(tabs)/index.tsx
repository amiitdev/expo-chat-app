/**
 * 📱 CHAT SCREEN - Main messaging hub
 *
 * Displays user's chat channels with search functionality
 * Shows greeting, search bar, and filterable channel list
 */

import { useAppContext } from '@/contexts/AppProvider';
import { COLORS } from '@/lib/theme';
import { getGreetingForHour } from '@/lib/utils';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Channel } from 'stream-chat';
import { ChannelList } from 'stream-chat-expo';

const ChatScreen = () => {
  // 🧭 Navigation
  const router = useRouter();

  // 👤 Current user from Clerk
  const { user } = useUser();

  // 🌐 Global app state (to store selected channel)
  const { setChannel } = useAppContext();

  // 🔍 Local search state
  const [search, setSearch] = useState('');

  /**
   * 🎯 STREAM CHANNEL FILTERS
   *
   * filters: What channels to fetch
   * - $in: Array of user IDs that must be members
   * - type: 'messaging' = 1-on-1 or group chats (not channels/teams)
   *
   * This fetches ALL channels where current user is a member
   */
  const filters = {
    members: { $in: [user?.id!] },
    type: 'messaging',
  };

  /**
   * 👋 Personalize greeting with user's first name
   * Fallback to 'there' if no name available
   */
  const firstName = user?.firstName || 'there';

  /**
   * 🔎 CLIENT-SIDE SEARCH FILTER
   *
   * Runs on the client AFTER channels are fetched
   * Filters channels by name or ID based on search query
   *
   * Why client-side? Because Stream's server-side search
   * might not be as flexible or might cost extra
   */
  const channelRenderFilterFn = (channels: Channel[]) => {
    // If search is empty, show all channels
    if (!search.trim()) return channels;

    const q = search.toLowerCase();

    return channels.filter((channel) => {
      // Try to get channel name from data, fallback to empty string
      const name =
        (channel.data?.name as string | undefined)?.toLowerCase() ?? '';
      const cid = channel.cid.toLowerCase();

      // Search in both name AND channel ID
      return name.includes(q) || cid.includes(q);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* ================= HEADER SECTION ================= */}
      {/* Personalized greeting based on time of day */}
      <View className="px-5 pt-3 pb-2">
        <Text className="text-2xl font-bold text-foreground">
          {getGreetingForHour()}, {firstName}
        </Text>
      </View>

      {/* ================= SEARCH SECTION ================= */}
      {/* Styled search bar with icon and custom colors */}
      <View className="flex-row items-center bg-surface mx-5 mb-3 px-3.5 py-3 rounded-[14px] gap-2.5 border border-border">
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          className="flex-1 text-[15px] text-foreground"
          placeholder="Search chat rooms..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* ================= SECTION LABEL ================= */}
      {/* Visual separator with icon to indicate channel list */}
      <View className="flex-row items-center gap-2 px-5 mb-2">
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={18}
          color={COLORS.primary}
        />
        <Text className="text-base font-semibold text-foreground">
          Chat Sessions
        </Text>
      </View>

      {/* ================= CHANNEL LIST ================= */}
      {/* Main Stream Chat component that renders all channels */}
      <ChannelList
        // 📡 Data fetching config
        filters={filters}
        options={{
          state: true, // Include channel state (unread counts, etc.)
          watch: true, // Listen to real-time updates
        }}
        sort={{
          last_updated: -1, // Sort by most recent activity (descending)
        }}
        // 🔍 Client-side filtering
        channelRenderFilterFn={channelRenderFilterFn}
        // 👆 Channel selection handler
        onSelect={(channel) => {
          setChannel(channel); // Store in global state
          router.push(`/channel/${channel.id}`); // Navigate (commented for now)
        }}
        // 📦 Extra props passed to the underlying FlatList
        additionalFlatListProps={{
          contentContainerStyle: { flexGrow: 1 }, // Ensures scroll works with flex
        }}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

/**
 * 📚 COMPONENT FLOW REVISION:
 *
 * ┌─────────────────────────────────────────────────────┐
 * │                      RENDER                          │
 * └─────────────────────────────────────────────────────┘
 *                            │
 *                            ▼
 * ┌─────────────────────────────────────────────────────┐
 * │                 SafeAreaView (wrapper)               │
 * ├───────────────────────────────────────────────────────┤
 * │  ┌─────────────────────────────────────────────────┐ │
 * │  │            HEADER (greeting + name)             │ │
 * │  └─────────────────────────────────────────────────┘ │
 * │  ┌─────────────────────────────────────────────────┐ │
 * │  │            SEARCH BAR (with state)              │ │
 * │  └─────────────────────────────────────────────────┘ │
 * │  ┌─────────────────────────────────────────────────┐ │
 * │  │            SECTION LABEL ("Chat Sessions")      │ │
 * │  └─────────────────────────────────────────────────┘ │
 * │  ┌─────────────────────────────────────────────────┐ │
 * │  │           CHANNEL LIST (Stream component)       │ │
 * │  │  ┌───────────────────────────────────────────┐  │ │
 * │  │  │  ┌─────────────────────────────────────┐  │  │ │
 * │  │  │  │  Channel 1                           │  │  │ │
 * │  │  │  └─────────────────────────────────────┘  │  │ │
 * │  │  │  ┌─────────────────────────────────────┐  │  │ │
 * │  │  │  │  Channel 2 (filtered if not match)  │  │  │ │
 * │  │  │  └─────────────────────────────────────┘  │  │ │
 * │  │  └───────────────────────────────────────────┘  │ │
 * │  └─────────────────────────────────────────────────┘ │
 * └─────────────────────────────────────────────────────┘
 *
 * 🔑 KEY CONCEPTS:
 *
 * 1. 🎯 Stream Filters:
 *    - `members: { $in: [userId] }` = Get all channels where user is member
 *    - `type: 'messaging'` = Get only chat channels (not announcements)
 *
 * 2. 🔍 Two-Tier Filtering:
 *    - Server-side: `filters` prop (limits what's fetched)
 *    - Client-side: `channelRenderFilterFn` (filters displayed list)
 *
 * 3. ⚡ Real-time Updates:
 *    - `watch: true` = Listen for new messages, typing indicators
 *    - `state: true` = Include unread counts, read states
 *
 * 4. 🎨 Custom Styling:
 *    - Tailwind classes for structure
 *    - COLORS constants for theme consistency
 *    - Ionicons for icons
 *
 * 5. 📱 Search Implementation:
 *    - Local state with useState
 *    - Real-time filtering as user types
 *    - Searches both name AND channel ID
 *
 * 🚀 OPTIMIZATION TIPS:
 *
 * • Debounce search if it becomes slow:
 *   ```ts
 *   import { useDebounce } from 'use-debounce';
 *   const [debouncedSearch] = useDebounce(search, 300);
 *   ```
 *
 * • Add empty state when no channels match:
 *   ```tsx
 *   if (filteredChannels.length === 0) {
 *     return <EmptyState message="No chats found" />;
 *   }
 *   ```
 *
 * • Pull-to-refresh for manual updates:
 *   ```tsx
 *   <ChannelList
 *     ...
 *     additionalFlatListProps={{
 *       refreshing: isRefreshing,
 *       onRefresh: handleRefresh
 *     }}
 *   />
 *   ```
 */
