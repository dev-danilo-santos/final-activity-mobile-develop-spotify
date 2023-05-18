import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { buscarArtistasPorId } from '../../component/api/spotifyApi';

const ArtistScreen = ({ route }) => {
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      const { artistId } = route.params;
      const response = await buscarArtistasPorId(artistId);
      setArtist(response);
    };

    fetchArtist();
  }, []);

  if (!artist) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image style={styles.artistImage} source={{ uri: artist.images[0].url }} />
      <Text style={styles.artistName}>{artist.name}</Text>
      <Text style={styles.artistFollowers}>{artist.followers.total} seguidores</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  artistImage: {
    height: 200,
    width: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artistFollowers: {
    fontSize: 18,
    color: '#666',
  },
});

export default ArtistScreen;
