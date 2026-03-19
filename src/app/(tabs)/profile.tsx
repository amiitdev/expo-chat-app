import { useAppContext } from '@/contexts/AppProvider';
import { COLORS } from '@/lib/theme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import { Image } from 'expo-image';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const MENU_ITEMS = [
  { label: 'Edit Profile', icon: 'person-outline', color: '#4F8EF7' },
  { label: 'Notifications', icon: 'notifications-outline', color: '#F39C12' },
  {
    label: 'Privacy & Security',
    icon: 'lock-closed-outline',
    color: '#9B59B6',
  },
  { label: 'Blocked Users', icon: 'remove-circle-outline', color: '#E74C3C' },
  { label: 'Appearance', icon: 'color-palette-outline', color: '#2ECC71' },
];

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const { channel } = useAppContext();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* PROFILE HEADER */}
        <View className="items-center px-5 py-6">
          <View className="relative mb-3">
            <Image
              source={user?.imageUrl}
              style={{ width: 90, height: 90, borderRadius: 45 }}
              contentFit="cover"
            />

            {/* online indicator */}
            <View className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
          </View>

          <Text className="text-xl font-bold text-foreground">
            {user?.fullName || user?.username || 'User'}
          </Text>

          <Text className="text-sm text-foreground-muted mt-1">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>

          {/* badge */}
          <View className="mt-3 flex-row items-center gap-1.5 rounded-full bg-[#FDCB6E1E] px-3 py-1">
            <Ionicons name="flame" size={14} color="#e37712" />
            <Text className="text-xs font-semibold text-[#e37712]">
              Top Chatter
            </Text>
          </View>
        </View>

        {/* CHAT STATS */}
        <View className="flex-row px-5 gap-3 mb-6">
          <View className="flex-1 items-center rounded-xl border border-border bg-surface py-4">
            <Text className="text-xl font-bold text-primary">324</Text>
            <Text className="text-xs text-foreground-muted mt-1">Messages</Text>
          </View>

          <View className="flex-1 items-center rounded-xl border border-border bg-surface py-4">
            <Text className="text-xl font-bold text-primary">18</Text>
            <Text className="text-xs text-foreground-muted mt-1">Friends</Text>
          </View>

          <View className="flex-1 items-center rounded-xl border border-border bg-surface py-4">
            <Text className="text-xl font-bold text-primary">7</Text>
            <Text className="text-xs text-foreground-muted mt-1">
              Active Days
            </Text>
          </View>
        </View>

        {/* SETTINGS TITLE */}
        <Text className="text-xs text-foreground-muted px-5 mb-2">
          SETTINGS
        </Text>

        {/* MENU ITEMS */}
        <View className="px-5">
          {MENU_ITEMS.map((item, i) => (
            <Pressable
              key={i}
              className="mb-2 flex-row items-center gap-3 rounded-xl border border-border bg-surface px-4 py-4"
            >
              <View
                className="h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.color}
                />
              </View>

              <Text className="flex-1 text-base font-medium text-foreground">
                {item.label}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textSubtle}
              />
            </Pressable>
          ))}
        </View>

        {/* LOGOUT BUTTON */}
        <Pressable
          onPress={async () => {
            try {
              await signOut();
              Sentry.logger.info('User signed out suucessfully', {
                userId: user?.id,
              });
            } catch (error) {
              Sentry.logger.error('Error logging out', {
                error,
                userId: user?.id,
              });
              Sentry.captureException(error);
              Alert.alert(
                'Error',
                'An error ocurred while signing out .Please try again',
              );
            }
          }}
          className="mx-5 mt-6 flex-row items-center justify-center rounded-xl bg-surface py-4"
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text className="ml-2 font-semibold text-red-800">Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
