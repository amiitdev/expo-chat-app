import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait until Clerk loads
  if (!isLoaded) return null;

  // If user not signed in → redirect to auth
  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <NativeTabs>
      {/* Chats tab */}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Chats</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="message"
          md="chat"
          selectedColor={'#007AFF'}
        />
      </NativeTabs.Trigger>

      {/* Explore tab */}
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="safari"
          md="explore"
          selectedColor={'#007AFF'}
        />
      </NativeTabs.Trigger>

      {/* Profile tab */}
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="person.fill"
          md="person"
          selectedColor={'#007AFF'}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
