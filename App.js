import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import PreferenciasScreen from './src/screens/PreferenciasScreen/PreferenciasScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import ArtistScreen from './src/screens/ArtistScreen/ArtistScreen';
import MusicsScreen from './src/screens/MusicsScreen/MusicsScreen';
import PerfilScreen from './src/screens/PerfilScreen/PerfilScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeContext from './src/context/context';
import ThemeToogler from './src/component/themeToogler/themeToogler';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export default function App() {
  const [themeHook, setThemeHook] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then((value) => {
      if (value !== null) {
        setThemeHook(value);
      } else {
        setThemeHook('light');
      }
    });
  }, []);

  if (themeHook === null) {
    return null;
  }

  const headerStyle = {
    light: {
      backgroundColor: '#FFFFFF', 
      textColor: '#000000', 
    },
    dark: {
      backgroundColor: '#000000', 
      textColor: '#FFFFFF', 
    },
  };

  return (
    <ThemeContext.Provider value={[themeHook, setThemeHook]}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Preferencias"
          screenOptions={({ navigation }) => ({
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={headerStyle[themeHook].textColor}
                  style={styles.profileIcon}
                  onPress={() => navigation.navigate('Perfil')}
                />
                <ThemeToogler />
              </View>
            ),
            headerStyle: headerStyle[themeHook],
            headerTintColor: headerStyle[themeHook].textColor,
          })}
        >
          <Stack.Screen name="Preferencias" component={PreferenciasScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Artist" component={ArtistScreen} />
          <Stack.Screen name="Musics" component={MusicsScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 10,
  },
});
