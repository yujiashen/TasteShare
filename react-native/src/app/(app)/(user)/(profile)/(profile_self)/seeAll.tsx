import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SeeAll from '@/components/seeAll';

const App: React.FC = () => {
  const { likes } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container}>
      <SeeAll likes={JSON.parse(likes)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  export default App;


