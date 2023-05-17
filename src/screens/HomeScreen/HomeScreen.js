import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Button } from 'react-native';
import { buscarArtistasPorGenero, buscarArtistasPorNome } from '../../component/api/spotifyApi';
import ThemeContext from '../../context/context';
import AppTheme from '../../component/themes/themes';

const HomeScreen = ({ navigation, route }) => {
  const { selectedGenres } = route.params;
  const [artists, setArtists] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useContext(ThemeContext)[0];

  const handleGenrePress = async (genre) => {
    const response = await buscarArtistasPorGenero(genre);
    setArtists(response.artists);
  }

  const handleSearchQueryChange = (text) => {
    setSearchQuery(text);
  }

  const handleSearchSubmit = async () => {
    if (searchQuery !== "") {
      const response = await buscarArtistasPorNome(searchQuery);
      setArtists(response.artists);
    }
  }

  const renderArtist = (artist) => {
    if (!artist || !artist.images || !artist.images[0]) {
      return null;
    }

    return (
      <View style={styles.artistCard} key={artist.id}>
        <TouchableOpacity onPress={() => navigation.navigate('Artist', { artist })}>
          <Image style={styles.artistImage} source={{ uri: artist.images[0].url }} />
          <Text style={styles.artistName}>{artist.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, AppTheme[theme + "Container"]]}>
      <View style={[styles.container]}>

        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, AppTheme[theme]]}
            placeholder="Busque qualquer artista"
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
          />
          <Text style={styles.button} onPress={handleSearchSubmit}>Procurar</Text>
        </View>
        <Text style={[{ fontSize: 24 }, { display: 'flex' }, { justifyContent: 'center' }, AppTheme[theme]]}>Ou busque por gênero</Text>
        <View style={styles.genresContainer}>
          {selectedGenres.map(genre => (
            <TouchableOpacity
              key={genre}
              style={[styles.genreCard, { backgroundColor: '#1DB954', }]}
              onPress={() => handleGenrePress(genre)}
            >
              <Text style={styles.genreName}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.resultsContainer}>
          {artists.items ? (
            artists.items.map(artist => renderArtist(artist))
          ) : (
            <Text ></Text>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#1DB954',
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontWeight: 'bold',
    color: 'white'
  },
  genresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  genreCard: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 50
  },
  genreName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistCard: {
    width: '48%',
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginVertical: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  artistImage: {
    height: 150,
    width: '100%',
    resizeMode: 'cover',
  },
  artistName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 10,
  },
  resultsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
