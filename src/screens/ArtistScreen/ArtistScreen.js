import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppTheme from '../../component/themes/themes';
import ThemeContext from '../../context/context';
import { buscarAlbunsArtista } from '../../component/api/spotifyApi';

const ArtistScreen = ({ route, navigation }) => {
  const { artist } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [albums, setAlbums] = useState([]);
  const theme = useContext(ThemeContext)[0];
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    checkIfFavorite();
    buscarAlbuns();
  }, []);

  const openSpotifyLink = () => {
    Linking.openURL(artist.external_urls.spotify);
  };

  const toggleFavorite = async () => {
    const favoriteArtistsString = await AsyncStorage.getItem('favoriteArtists');
    if (favoriteArtistsString) {
      const favoriteArtistsArray = JSON.parse(favoriteArtistsString);
      if (favoriteArtistsArray.includes(artist.id)) {
        const updatedFavorites = favoriteArtistsArray.filter(
          (id) => id !== artist.id
        );
        await AsyncStorage.setItem(
          'favoriteArtists',
          JSON.stringify(updatedFavorites)
        );
        setIsFavorite(false);
      } else {
        favoriteArtistsArray.push(artist.id);
        await AsyncStorage.setItem(
          'favoriteArtists',
          JSON.stringify(favoriteArtistsArray)
        );
        setIsFavorite(true);
      }
    } else {
      const favoriteArtistsArray = [artist.id];
      await AsyncStorage.setItem(
        'favoriteArtists',
        JSON.stringify(favoriteArtistsArray)
      );
      setIsFavorite(true);
    }
  };

  const checkIfFavorite = async () => {
    const favoriteArtistsString = await AsyncStorage.getItem('favoriteArtists');
    if (favoriteArtistsString) {
      const favoriteArtistsArray = JSON.parse(favoriteArtistsString);
      setIsFavorite(favoriteArtistsArray.includes(artist.id));
    }
  };

  const buscarAlbuns = async () => {
    try {
      const response = await buscarAlbunsArtista(artist.id);
      setAlbums(response.items);
    } catch (error) {
      console.log('Erro ao buscar álbuns:', error);
    }
  };

  const renderAlbumCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.albumCard, AppTheme[theme + 'Container']]}
      onPress={() => navigation.navigate('Musics', { album: item })}
    >
      <Image style={styles.albumImage} source={{ uri: item.images[0].url }} />
      <Text style={[styles.albumName, AppTheme[theme]]}>{item.name}</Text>
      <Text style={[styles.albumReleaseDate, AppTheme[theme]]}>
        Lançamento: {item.release_date}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, AppTheme[theme + 'Container']]}>
      <TouchableOpacity onPress={openSpotifyLink}>
        <Image style={styles.artistImage} source={{ uri: artist.images[0].url }} />
      </TouchableOpacity>
      <View style={styles.artistInfo}>
        <Text style={[styles.artistName, AppTheme[theme]]}>{artist.name}</Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Text style={[styles.favoriteButtonText, isFavorite && styles.favoriteButtonTextSelected]}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.artistGenres, AppTheme[theme]]}>Gêneros: {artist.genres.join(', ')}</Text>
      <Text style={[styles.artistFollowers, AppTheme[theme]]}>
        Seguidores: {artist.followers.total}
      </Text>
      <Text style={[styles.artistPopularity, AppTheme[theme]]}>
        Popularidade: {artist.popularity}
      </Text>

      <Text style={[styles.sectionTitle, AppTheme[theme]]}>Álbuns:</Text>
      <View style={styles.albumsContainer}>
        {albums.map((item) => (
          <View key={item.id} style={styles.albumCardContainer}>
            {renderAlbumCard({ item })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  artistImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
    alignSelf: 'center',
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  artistGenres: {
    fontSize: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  artistFollowers: {
    fontSize: 14,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  artistPopularity: {
    fontSize: 14,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  favoriteButton: {
    padding: 5,
    marginLeft: 5,
  },
  favoriteButtonText: {
    fontSize: 20,
  },
  favoriteButtonTextSelected: {
    color: 'red',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  albumsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  albumCardContainer: {
    width: '50%', // Exibe dois cards por linha
    paddingHorizontal: 5,
    marginBottom: 16,
  },
  albumCard: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumImage: {
    width: 160,
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
  },
  albumName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  albumReleaseDate: {
    fontSize: 14,
    textAlign: 'center',
  },
};

export default ArtistScreen;
