import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraDemo from './src/camera';


export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <RootSiblingParent>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={CameraDemo} />
        </Stack.Navigator>
      </RootSiblingParent>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
