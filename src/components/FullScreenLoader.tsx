import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type Props = {
  message?: string;
};

const FullScreenLoader = ({ message }: Props) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />

      {message && (
        <Text className="mt-3 text-base text-foreground-muted">{message}</Text>
      )}
    </View>
  );
};

export default FullScreenLoader;
