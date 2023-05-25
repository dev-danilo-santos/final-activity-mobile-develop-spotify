import React, { useEffect, useState, useContext } from 'react';
import { View, Button, StyleSheet, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { buscarArtistasPorId } from '../../component/api/spotifyApi';
import ThemeContext from '../../context/context';
import AppTheme from '../../component/themes/themes';

const PerfilScreen = () => {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [artistsData, setArtistsData] = useState([]);
  const theme = useContext(ThemeContext)[0];
  const navigation = useNavigation();

  useEffect(() => {
    getFavoriteArtists();
  }, []);

  const getFavoriteArtists = async () => {
    try {
      const favoriteArtistsString = await AsyncStorage.getItem('favoriteArtists');
      if (favoriteArtistsString) {
        const favoriteArtistsArray = JSON.parse(favoriteArtistsString);
        setFavoriteArtists(favoriteArtistsArray);
        fetchArtistsData(favoriteArtistsArray);
      }
    } catch (error) {
      console.log('Error getting favorite artists:', error);
    }
  };

  const fetchArtistsData = async (artistsArray) => {
    try {
      const artistsDataArray = [];
      for (const artistId of artistsArray) {
        const response = await buscarArtistasPorId(artistId);
        artistsDataArray.push(response);
      }
      setArtistsData(artistsDataArray);
      console.log('Artists data:', artistsDataArray);
    } catch (error) {
      console.log('Error fetching artists data:', error);
    }
  };

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.removeItem('themeMode');
      await AsyncStorage.removeItem('favoriteArtists');
      await AsyncStorage.removeItem('selectedGenres');
    } catch (error) {
        console.error(error)
    }
  };

  const handleArtistPress = (artist) => {
    // Navegar para a tela ArtistScreen e passar o artista selecionado
    navigation.navigate('Artist', { artist });
  };

  return (
    <View style={[styles.container, AppTheme[theme+'Container']]}>
      <Text style={[styles.title, AppTheme[theme]]}>Lista de Favoritos</Text>
      <ScrollView style={styles.artistsContainer}>
        {artistsData.map((artist, index) => (
          <TouchableOpacity key={index} style={styles.artistItem} onPress={() => handleArtistPress(artist)}>
            <Image style={styles.artistImage} source={{ uri: artist.images[0].url }} />
            <Text style={[styles.artistName, AppTheme[theme]]}>{artist.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Limpar Cache" onPress={handleClearStorage} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  artistsContainer: {
    width: '100%',
  },
  artistItem: {
    alignItems: 'center',
    marginBottom: 10,
  },
  artistImage: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
    borderRadius: 10
  },
  artistName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PerfilScreen;
