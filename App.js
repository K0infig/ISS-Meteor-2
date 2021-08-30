import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from "./screens/HomeScreen";
import ISSLocation from "./screens/ISSLocation";
import MeteorScreen from "./screens/MeteorScreen";


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ISSLocation" component={ISSLocation} />
        <Stack.Screen name="Meteors" component={MeteorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;