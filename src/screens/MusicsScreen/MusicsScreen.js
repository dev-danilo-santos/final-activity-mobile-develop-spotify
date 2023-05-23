import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import { buscarMusicasAlbum } from '../../component/api/spotifyApi';
import AppTheme from '../../component/themes/themes';
import ThemeContext from '../../context/context';

const MusicsScreen = ({ route }) => {
  const [musicas, setMusicas] = useState([]);
  const { album } = route.params;
  const theme = useContext(ThemeContext)[0];

  useEffect(() => {
    const fetchMusicasAlbum = async () => {
      try {
        const response = await buscarMusicasAlbum(album.id);
        setMusicas(response.items);
      } catch (error) {
        console.log('Erro ao buscar músicas do álbum:', error);
      }
    };

    fetchMusicasAlbum();
  }, []);

  const handleMusicPress = (uri) => {
    Linking.openURL(uri);
  };

  const renderMusicaItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMusicPress(item.external_urls.spotify)}>
      <Text style={[styles.musicaItem, AppTheme[theme]]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, AppTheme[theme + 'Container']]}>
      <Text style={[styles.title, AppTheme[theme]]}>Músicas do Álbum:</Text>
      <FlatList
        data={musicas}
        keyExtractor={(item) => item.id}
        renderItem={renderMusicaItem}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  musicaItem: {
    fontSize: 16,
    marginBottom: 8,
  },
};

export default MusicsScreen;
