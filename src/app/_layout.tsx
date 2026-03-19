import ChatWrapper from '@/components/ChatWrapper';
import { AppProvider } from '@/contexts/AppProvider';
// @ts-ignore
import { ClerkProvider } from '@clerk/clerk-expo';
// @ts-ignore
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../global.css';

Sentry.init({
  dsn: 'https://fd1fc26f493b6e3ee73801df712eef05@o4510986540023808.ingest.us.sentry.io/4510992613900288',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllImages: false,
      maskAllVectors: false,
      maskAllText: false,
    }),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key');
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={publishableKey as string}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView className="felx-1">
        <ChatWrapper>
          <AppProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </AppProvider>
        </ChatWrapper>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
