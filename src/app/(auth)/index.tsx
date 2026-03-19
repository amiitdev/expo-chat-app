import useAuth from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useAuth();
  const isLoading = loadingStrategy !== null;

  const chips = [
    {
      icon: 'videocam' as const,
      label: 'Video Calls',
      color: '#A29BFE',
      bg: 'bg-primary/12 border-primary/20',
    },
    {
      icon: 'chatbubbles' as const,
      label: 'Study Rooms',
      color: '#FF6B6B',
      bg: 'bg-accent/12 border-accent/20',
    },
    {
      icon: 'people' as const,
      label: 'Find Partners',
      color: '#00B894',
      bg: 'bg-accent-secondary/12 border-accent-secondary/20',
    },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Gradient background */}
      <View className="absolute inset-0">
        <LinearGradient
          colors={['#0f0c29', '#302b63', '#24243e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <SafeAreaView className="flex-1 justify-between">
        {/* ================= TOP SECTION ================= */}
        <View>
          {/* Logo + Title */}
          <View className="items-center pt-10 pb-2">
            <View className="w-16 h-16 rounded-[20px] bg-primary/15 items-center justify-center border border-primary/20">
              <Ionicons name="chatbubbles" size={30} color="#A29BFE" />
            </View>

            <Text className="text-3xl font-extrabold text-foreground tracking-tight mt-4 font-mono">
              Chatify
            </Text>

            <Text className="text-foreground-muted text-[15px] mt-1.5 tracking-wide">
              Real Chat App
            </Text>
          </View>

          {/* Hero Image */}
          <View className="items-center px-6 mt-4">
            <Image
              source={require('@/assets/images/auth1.png')}
              style={{ width: 200, height: 210 }}
              contentFit="cover"
            />
          </View>

          {/* Feature Chips */}
          <View className="flex-row flex-wrap justify-center gap-3 px-6 mt-5">
            {chips.map((chip) => (
              <View
                key={chip.label}
                className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border ${chip.bg}`}
              >
                <Ionicons name={chip.icon} size={14} color={chip.color} />

                <Text className="text-foreground-muted text-xs font-semibold tracking-wide">
                  {chip.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ================= BOTTOM SECTION ================= */}
        <View className="px-8 pb-6">
          <View className="flex-row items-center gap-3">
            {/* left divider */}
            <View className="flex-1 h-px bg-border" />

            {/* text */}
            <Text className="text-foreground-subtle text-xs font-medium tracking-widest uppercase">
              Continue with
            </Text>

            {/* right divider */}
            <View className="flex-1 h-px bg-border" />
          </View>
          <View className="flex-row justify-center items-center gap-4 mb-5 mt-3">
            {/* Google btn */}
            <Pressable
              className="size-20 rounded-2xl bg-white items-center justify-center active:scale-95 shadow-lg shadow-white/10"
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              disabled={isLoading}
              onPress={() => !isLoading && handleSocialAuth('oauth_google')}
            >
              {loadingStrategy === 'oauth_google' ? (
                <ActivityIndicator size={'small'} color={'#6C5CE7'} />
              ) : (
                <Image
                  source={require('../../../assets/images/google.png')}
                  style={{ width: 28, height: 28 }}
                  contentFit="contain"
                />
              )}
            </Pressable>

            {/* Github button */}
            <Pressable
              className="size-20 rounded-2xl bg-white items-center justify-center active:scale-95 shadow-lg shadow-white/10"
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              disabled={isLoading}
              onPress={() => !isLoading && handleSocialAuth('oauth_github')}
            >
              {loadingStrategy === 'oauth_github' ? (
                <ActivityIndicator size={'small'} color={'#6C5CE7'} />
              ) : (
                <Ionicons name="logo-github" size={28} color="black" />
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
