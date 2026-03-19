import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import type { Channel, StreamChat } from 'stream-chat';

/*
-------------------------------------------------------
TYPE: Parameters required by this custom hook
-------------------------------------------------------

client      → Stream chat client instance
userId      → logged in user's id (Clerk user id)
setChannel  → function to store selected channel in global context
setCreating → function to track loading state while chat is being created
*/
type UseStartChatParams = {
  client: StreamChat;
  userId: string;
  setChannel: (channel: Channel) => void;
  setCreating: (value: string | null) => void;
};

/*
-------------------------------------------------------
CUSTOM HOOK: useStartChat
-------------------------------------------------------

Purpose:
Creates a new chat channel between two users.

Example:

Amit → clicks chat on "Rahul"

members = ["amit_id", "rahul_id"]

Stream creates a channel for them.
*/
const useStartChat = ({
  client,
  userId,
  setChannel,
  setCreating,
}: UseStartChatParams) => {
  /*
  -------------------------------------------------------
  Router from Expo
  -------------------------------------------------------

  Used to navigate to chat screen after channel creation.

  Example:
  router.push("/channel/123")
  */
  const router = useRouter();

  /*
  -------------------------------------------------------
  FUNCTION: handleStartChat
  -------------------------------------------------------

  targetId → the user we want to chat with

  Example:
  Amit wants to chat with Rahul

  targetId = "rahul_id"
  */
  const handleStartChat = async (targetId: string) => {
    /*
    Show loading state

    Example:
    show spinner on Rahul's user card
    */
    setCreating(targetId);

    try {
      /*
      -------------------------------------------------------
      Create or get channel
      -------------------------------------------------------

      Stream checks:

      If channel exists → return it
      If not → create new channel

      members = current user + target user
      */
      const channel = client.channel('messaging', {
        members: [userId, targetId],
      });

      /*
      -------------------------------------------------------
      watch()

      Connects to the channel
      Loads messages
      Subscribes to realtime updates
      */
      await channel.watch();

      /*
      -------------------------------------------------------
      Save channel in global context
      -------------------------------------------------------

      This allows other screens to access the current channel.
      */
      setChannel(channel);

      /*
      -------------------------------------------------------
      Navigate to chat screen
      -------------------------------------------------------

      Example route:

      /channel/messaging:12345
      */

      //   todo:later
      //   router.push(`/channel/${channel.cid}`);
    } catch (error) {
      /*
      -------------------------------------------------------
      Error handling
      -------------------------------------------------------
      */

      console.log('Error creating chat:', error);

      Alert.alert('Error', 'Could not create chat. Please try again.');
    } finally {
      /*
      -------------------------------------------------------
      Stop loading state
      -------------------------------------------------------
      */

      setCreating(null);
    }
  };

  /*
  -------------------------------------------------------
  Return function so component can use it
  -------------------------------------------------------
  */
  return { handleStartChat };
};

export default useStartChat;
