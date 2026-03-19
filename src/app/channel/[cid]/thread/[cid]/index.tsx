// Empty UI shown when there are no messages in a thread
// Example: If nobody replied to a message yet
import { EmptyState } from '@/components/EmptyState';

// Loader displayed while the thread data is loading
// Example: when opening a reply thread and data is still being fetched
import FullScreenLoader from '@/components/FullScreenLoader';

// Global context storing the current channel and active thread
// Example: which chat room and which message thread the user opened
import { useAppContext } from '@/contexts/AppProvider';

// Hook that returns the height of the navigation header
// Used to avoid keyboard overlapping the message input
import { useHeaderHeight } from '@react-navigation/elements';

// Basic React Native container
import { View } from 'react-native';

// SafeAreaView prevents UI from overlapping phone notch / status bar
// Especially important for iPhone devices
import { SafeAreaView } from 'react-native-safe-area-context';

// Stream Chat components
// Channel → main chat context
// Thread → shows replies to a specific message
import { Channel, Thread } from 'stream-chat-expo';

const ThreadScreen = () => {
  // channel = current chat room
  // thread = selected message thread
  // setThread = used to clear thread when user exits
  const { channel, thread, setThread } = useAppContext();

  // Height of navigation header
  // Used so keyboard doesn't cover message input
  const headerHeight = useHeaderHeight();

  // If channel hasn't loaded yet show loader
  if (channel === null) return <FullScreenLoader message="Loading thread..." />;

  return (
    // Safe container for entire screen
    <SafeAreaView className="flex-1 bg-surface">
      {/* Stream Chat Channel wrapper */}
      <Channel
        channel={channel}
        // Prevent keyboard overlap
        keyboardVerticalOffset={headerHeight}
        // Pass selected thread
        // This tells Stream Chat which message thread to show
        thread={thread}
        // Enables thread list UI
        // Without this Stream Chat will behave like normal chat
        threadList
        // UI when thread has no replies yet
        EmptyStateIndicator={() => (
          <EmptyState
            icon="book-outline"
            title="No messages yet"
            subtitle="Start a study conversation!"
          />
        )}
      >
        {/* Container for thread messages */}
        <View className="flex-1 justify-start">
          {/* Thread component */}
          {/* Shows parent message + replies */}

          <Thread
            // Runs when user closes thread screen
            // Important to reset thread state
            onThreadDismount={() => setThread(null)}
          />
        </View>
      </Channel>
    </SafeAreaView>
  );
};

export default ThreadScreen;
