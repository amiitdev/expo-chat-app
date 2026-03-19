import { studyBuddyTheme } from '@/lib/theme';
import { useUser } from '@clerk/clerk-expo'; // Clerk hook -> gives currently logged-in user
import React, { useEffect, useRef } from 'react';
import { Chat, OverlayProvider, useCreateChatClient } from 'stream-chat-expo';
import FullScreenLoader from './FullScreenLoader';

// 🔐 Stream API key from environment variables
const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY as string;

/**
 * 📤 SYNC USER TO STREAM
 * Step 1: When user logs in, create them in Stream's database
 * This ensures Stream knows about our user before they start chatting
 */
const syncUserToStream = async (user: any) => {
  try {
    await fetch('/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        // 👇 Fallback chain: fullName -> username -> email username -> 'User'
        name:
          user.fullName ??
          user.username ??
          user.emailAddresses?.[0]?.emailAddress?.split('@')[0],
        image: user.imageUrl,
      }),
    });
  } catch (error) {
    console.error('❌ Error syncing user to Stream:', error);
  }
};

/**
 * 🎯 MAIN CHAT CLIENT COMPONENT
 * Handles the actual Stream Chat connection and UI
 * Only rendered when we have a logged-in user
 */
const ChatClient = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) => {
  // 🚦 Prevents multiple sync attempts (React StrictMode safe)
  const syncedRef = useRef(false);

  // 🔄 SYNC PHASE: Create user in Stream DB (only once)
  useEffect(() => {
    if (!syncedRef.current) {
      syncedRef.current = true;
      syncUserToStream(user);
    }
  }, [user]); // Re-run if user changes (rare, but safe)

  /**
   * 🎫 TOKEN GENERATOR
   * Stream needs a JWT token to authenticate our user
   * We ask our backend to create one using our secret key
   */
  const tokenProvider = async () => {
    const response = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await response.json();
    return data.token; // Return the JWT token to Stream
  };

  /**
   * 🔌 CONNECTION PHASE
   * useCreateChatClient is a Stream hook that:
   * 1. Initializes the client with our API key
   * 2. Authenticates our user
   * 3. Establishes WebSocket connection
   * Returns null while connecting, client object when ready
   */
  const chatClient = useCreateChatClient({
    apiKey: STREAM_API_KEY,
    userData: {
      id: user.id,
      // 👇 Same fallback chain as sync (consistency is key!)
      name:
        user.fullName ??
        user.username ??
        user.emailAddresses?.[0]?.emailAddress?.split('@')[0],
      image: user.imageUrl,
    },
    tokenOrProvider: tokenProvider, // Can be token string OR provider function
  });

  // ⏳ Show loader while connecting to Stream
  if (!chatClient) {
    return <FullScreenLoader message="Connecting to chat..." />;
  }

  /**
   * ✅ READY PHASE
   * OverlayProvider: Handles UI overlays (modals, popups)
   * Chat: The main Stream Chat provider
   * Both receive our custom theme for consistent styling
   */
  return (
    <OverlayProvider value={{ style: studyBuddyTheme }}>
      <Chat client={chatClient} style={studyBuddyTheme}>
        {children}
      </Chat>
    </OverlayProvider>
  );
};

/**
 * 🏠 MAIN WRAPPER COMPONENT
 * This is what we export and use in our app layout
 * Handles loading states and conditional rendering
 */
const ChatWrapper = ({ children }: { children: React.ReactNode }) => {
  // 📱 Get user from Clerk + loading state
  const { user, isLoaded } = useUser();

  // ⏳ Clerk is still loading user data
  if (!isLoaded) return <FullScreenLoader message="Loading chat..." />;

  // 🚪 No user logged in -> render children without chat
  // This allows public/non-chat parts of the app to work
  if (!user) return <>{children}</>;

  // 🎉 User logged in -> initialize chat and wrap children
  return <ChatClient user={user}>{children}</ChatClient>;
};

export default ChatWrapper;

/**
 * 📚 FLOW REVISION:
 *
 * User opens app
 *       ↓
 * Clerk loads user (isLoaded becomes true)
 *       ↓
 * ┌─────────────────────────────────────┐
 * │  ChatWrapper sees user state         │
 * ├─────────────────────────────────────┤
 * │  if (!isLoaded) → Show loader        │
 * │  if (!user) → Render children only   │
 * │  if (user) → Render ChatClient       │
 * └─────────────────────────────────────┘
 *       ↓
 * ChatClient initializes
 *       ↓
 * ┌─────────────────────────────────────┐
 * │  PHASE 1: SYNC (useEffect)          │
 * │  syncUserToStream()                  │
 * │  → Creates user in Stream DB         │
 * └─────────────────────────────────────┘
 *       ↓
 * ┌─────────────────────────────────────┐
 * │  PHASE 2: TOKEN (tokenProvider)      │
 * │  fetch('/api/token')                  │
 * │  → Backend generates JWT              │
 * └─────────────────────────────────────┘
 *       ↓
 * ┌─────────────────────────────────────┐
 * │  PHASE 3: CONNECT (useCreateChatClient)│
 * │  → Establishes WebSocket             │
 * │  → Authenticates user                │
 * │  → Returns chatClient or null        │
 * └─────────────────────────────────────┘
 *       ↓
 * if (!chatClient) → Show loader
 *       ↓
 * if (chatClient) → Render Chat providers
 *       ↓
 * ┌─────────────────────────────────────┐
 * │  OverlayProvider (themes + overlays) │
 * │         ↓                            │
 * │    Chat (main provider)              │
 * │         ↓                            │
 * │    children (app screens)            │
 * └─────────────────────────────────────┘
 *
 * 🔑 KEY CONCEPTS:
 * • useRef prevents double sync in StrictMode
 * • TokenProvider = server-side JWT generation
 * • Consistent name fallback = no missing user data
 * • Layered providers = separation of concerns
 */
