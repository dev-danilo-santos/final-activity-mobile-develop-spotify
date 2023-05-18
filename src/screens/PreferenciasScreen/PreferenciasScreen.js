import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGeneros } from '../../component/api/spotifyApi';
import ThemeContext from '../../context/context';
import AppTheme from '../../component/themes/themes';
import { useContext } from 'react';

const PreferenciasScreen = ({ navigation }) => {
    const [fetchResult, setFetchResult] = useState({ genres: [] });
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const theme = useContext(ThemeContext)[0];
    
    useEffect(() => {
        async function loadPreferences() {
          const selectedGenres = await AsyncStorage.getItem('selectedGenres');
          if (selectedGenres) {
            setSelectedGenres(JSON.parse(selectedGenres));
          }
        }
        loadPreferences();
      }, []);
      

    useEffect(() => {
        async function checkSelectedGenres() {
          try {
            const selectedGenres = await AsyncStorage.getItem('selectedGenres');
            if (selectedGenres !== null) {
              navigation.navigate('Home', { selectedGenres: JSON.parse(selectedGenres) });
            }
          } catch (error) {
            console.error(error);
          }
        }
      
        checkSelectedGenres();
      }, []);
      
    useEffect(() => {
        fetchPreferences();
    }, []);

    async function fetchPreferences() {
        try {
            const { data: { genres } } = await getGeneros();
            setFetchResult({ genres });
        } catch (error) {
            setFetchResult({ genres: [] });
            console.error(error);
        }
    }

    function handleGenreSelect(genre) {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((selectedGenre) => selectedGenre !== genre));
        } else if (selectedGenres.length < 10) {
            setSelectedGenres([...selectedGenres, genre]);
        }
    }

    async function handleSavePreferences() {
        if (selectedGenres.length === 0) {
          Alert.alert('Erro', 'Selecione pelo menos um gênero.');
          return;
        }
      
        try {
          await AsyncStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
          Alert.alert('Sucesso', 'Preferências salvas com sucesso!');
          navigation.navigate('Home', { selectedGenres });
        } catch (error) {
          console.error(error);
          Alert.alert('Erro', 'Ocorreu um erro ao salvar as preferências.');
        }
      }
      

    async function handleClearSelectedGenres() {
        try {
            await AsyncStorage.removeItem('selectedGenres');
            setSelectedGenres([]);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Ocorreu um erro ao limpar as preferências.');
        }
    }

    function filterGenres() {
        return fetchResult.genres.filter((genre) => genre.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return (
        <View style={[styles.container, AppTheme[theme + "Container"]]}>
            <View style={styles.topRow}>
                <TouchableOpacity style={styles.button} onPress={handleSavePreferences}>
                    <Text style={styles.buttonText}>Pronto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleClearSelectedGenres}>
                    <Text style={styles.buttonText}>Limpar seleção</Text>
                </TouchableOpacity>
            </View>
            <TextInput style={styles.searchInput} placeholder="Buscar gênero" onChangeText={setSearchQuery} />
            <View style={styles.bottomRow}>
                {filterGenres().map((genre) => (
                    <TouchableOpacity
                        key={genre}
                        style={[styles.genreCard, selectedGenres.includes(genre) && styles.selectedGenreCard]}
                        onPress={() => handleGenreSelect(genre)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.genreText, selectedGenres.includes(genre) && styles.selectedGenreText]}>{genre}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        height: '100%',
        overflow: 'scroll'
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1DB954',
        borderRadius: 50,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomRow: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genreCard: {
        backgroundColor: '#EAEAEA',
        borderRadius: 20,
        padding: 10,
        marginVertical: 10,
        width: '48%',
    },
    selectedGenreCard: {
        backgroundColor: '#1DB954',
    },
    genreText: {
        color: '#000',
        fontSize: 14,
        textAlign: 'center',
    },
    selectedGenreText: {
        color: '#fff',
    },
    searchInput: {
        backgroundColor: '#EAEAEA',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
});


export default PreferenciasScreen;

