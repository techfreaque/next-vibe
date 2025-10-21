import { View, Text } from 'react-native';

export default function HomePage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#0066CC', marginBottom: 16 }}>
        Welcome to Next Vibe!
      </Text>
      <Text style={{ fontSize: 18, color: '#666' }}>
        React Native is running successfully!
      </Text>
    </View>
  );
}
