// ==============================
// IMPORTS
// ==============================

import { useSSO } from '@clerk/clerk-expo';
// SSO = Single Sign-On (Google, GitHub login)

import { useState } from 'react';

import { Alert } from 'react-native';
// Alert → shows popup messages in mobile apps

// ==============================
// CUSTOM AUTH HOOK
// ==============================

const useAuth = () => {
  // ---------------------------------
  // STATE: Track which login is loading
  // ---------------------------------

  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);

  // Example values:
  // "oauth_google"
  // "oauth_github"
  // null (no login running)

  // ---------------------------------
  // CLERK SSO FUNCTION
  // ---------------------------------

  const { startSSOFlow } = useSSO();
  // startSSOFlow → starts Google/GitHub authentication

  // =================================
  // SOCIAL LOGIN FUNCTION
  // =================================

  const handleSocialAuth = async (
    strategy: 'oauth_google' | 'oauth_github',
  ) => {
    // Prevent multiple login requests
    if (loadingStrategy) return;

    // Set which provider is loading
    setLoadingStrategy(strategy);

    try {
      // ---------------------------------
      // Start OAuth login process
      // ---------------------------------

      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      // ---------------------------------
      // If login did NOT complete
      // ---------------------------------

      if (!createdSessionId || !setActive) {
        // Determine provider name
        const provider = strategy === 'oauth_google' ? 'Google' : 'Github';

        // Show error popup
        Alert.alert(
          'Sign-in incomplete',
          `${provider} sign-in did not complete. Please try again`,
        );

        return;
      }

      // ---------------------------------
      // Activate user session
      // ---------------------------------

      await setActive({ session: createdSessionId });
    } catch (error) {
      // ---------------------------------
      // Handle unexpected errors
      // ---------------------------------

      console.log('Error in social auth:', error);

      const provider = strategy === 'oauth_google' ? 'Google' : 'Github';

      Alert.alert(
        'Sign-in incomplete',
        `${provider} sign-in did not complete. Please try again`,
      );
    } finally {
      // ---------------------------------
      // Reset loading state
      // ---------------------------------

      setLoadingStrategy(null);
    }
  };

  // =================================
  // RETURN VALUES FROM HOOK
  // =================================

  return {
    handleSocialAuth,
    loadingStrategy,
  };
};

// ==============================
// EXPORT HOOK
// ==============================

export default useAuth;
