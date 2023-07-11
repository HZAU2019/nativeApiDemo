import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraDemo from './src/camera';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LocationDemo from './src/location';


export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <RootSiblingParent>
        <Tab.Navigator>
          <Tab.Screen name='CameraDemo' component={CameraDemo} />
          <Tab.Screen name='LocationDemo' component={LocationDemo} />
        </Tab.Navigator>
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
