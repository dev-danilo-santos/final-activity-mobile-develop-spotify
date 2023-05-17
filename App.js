import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import PreferenciasScreen from './src/screens/PreferenciasScreen/PreferenciasScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeContext from './src/context/context';
import ThemeToogler from './src/component/themeToogler/themeToogler';

const Stack = createNativeStackNavigator();

export default function App() {
const themeHook = useState('light');

  return (
      <ThemeContext.Provider value={themeHook}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='Preferencias' screenOptions={{headerRight: () => (<ThemeToogler/>)}}>
              <Stack.Screen name="Preferencias" component={PreferenciasScreen}/>
              <Stack.Screen name="Home" component={HomeScreen}/>

            </Stack.Navigator>
          </NavigationContainer>
      </ThemeContext.Provider>
  )
}
