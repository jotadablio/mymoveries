import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EditItemsModal from '../components/EditItemsModal';
import SortModal from '../components/SortModal';
import ShareService from '../services/ShareService';

type Movie = {
  id: string;
  name: string;
  favorite: boolean;
  watched: boolean;
};

type SortOption = 'name' | 'favorite' | 'watched';

const MoviesListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [movies, setMovies] = useState<Movie[]>([
    { id: '1', name: 'Iron Man 3', favorite: false, watched: false },
    { id: '2', name: 'Interstellar', favorite: false, watched: false },
    { id: '3', name: '3:10 to Yuma', favorite: false, watched: false },
    { id: '4', name: 'Rango', favorite: false, watched: false },
    { id: '5', name: 'Toy Story', favorite: false, watched: false },
    { id: '6', name: 'Inside Out', favorite: false, watched: false },
    { id: '7', name: 'Django Unchained', favorite: false, watched: false },
    { id: '8', name: 'Scarface', favorite: false, watched: false },
    { id: '9', name: 'Up', favorite: false, watched: false },
    { id: '10', name: 'Doctor Zhivago', favorite: false, watched: false },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMovieName, setNewMovieName] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('name');
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const toggleFavorite = (id: string) => {
    setMovies(
      movies.map(movie =>
        movie.id === id ? { ...movie, favorite: !movie.favorite } : movie,
      ),
    );
  };

  const toggleWatched = (id: string) => {
    setMovies(
      movies.map(movie =>
        movie.id === id ? { ...movie, watched: !movie.watched } : movie,
      ),
    );
  };

  const addMovie = () => {
    if (newMovieName.trim() === '') return;
    
    // Verificar se o nome já existe
    if (movies.some(movie => movie.name.toLowerCase() === newMovieName.toLowerCase())) {
      Alert.alert('Erro', 'Este filme já existe na lista!');
      return;
    }
    
    const newMovie: Movie = {
      id: Date.now().toString(),
      name: newMovieName,
      favorite: false,
      watched: false,
    };
    setMovies([...movies, newMovie]);
    setNewMovieName('');
    setModalVisible(false);
  };

  const renameMovie = (id: string, newName: string) => {
    setMovies(
      movies.map(movie =>
        movie.id === id ? { ...movie, name: newName } : movie,
      ),
    );
  };

  const deleteMovie = (id: string) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  const sortMovies = (option: SortOption) => {
    setCurrentSort(option);
    
    let sortedMovies = [...movies];
    
    switch (option) {
      case 'name':
        sortedMovies.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'favorite':
        sortedMovies.sort((a, b) => {
          if (a.favorite === b.favorite) {
            return a.name.localeCompare(b.name);
          }
          return a.favorite ? -1 : 1;
        });
        break;
      case 'watched':
        sortedMovies.sort((a, b) => {
          if (a.watched === b.watched) {
            return a.name.localeCompare(b.name);
          }
          return a.watched ? -1 : 1;
        });
        break;
    }
    
    setMovies(sortedMovies);
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.starButton}
        onPress={() => toggleFavorite(item.id)}>
        <Text style={item.favorite ? styles.starFilled : styles.star}>★</Text>
      </TouchableOpacity>
      <Text style={styles.itemText}>{item.name}</Text>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleWatched(item.id)}>
        <View
          style={[
            styles.checkboxInner,
            item.watched && styles.checkboxChecked,
          ]}
        />
      </TouchableOpacity>
    </View>
  );

  const shareList = () => {
    ShareService.showShareOptions(movies, 'Lista de Filmes');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Filmes</Text>
        <TouchableOpacity>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={shareList}>
          <Text style={styles.footerButtonText}>🔗</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => setSettingsVisible(!settingsVisible)}>
          <Text style={styles.footerButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {settingsVisible && (
        <View style={styles.settingsMenu}>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => {
              setSettingsVisible(false);
              setEditModalVisible(true);
            }}>
            <Text style={styles.settingsText}>✂️ Editar Itens</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => {
              setSettingsVisible(false);
              setSortModalVisible(true);
            }}>
            <Text style={styles.settingsText}>📊 Ordenar Por</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => {
              setSettingsVisible(false);
              setAboutModalVisible(true);
            }}>
            <Text style={styles.settingsText}>ℹ️ Sobre o App</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para adicionar novo filme */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Filme</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do filme"
              value={newMovieName}
              onChangeText={setNewMovieName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewMovieName('');
                }}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addMovie}>
                <Text style={[styles.modalButtonText, {color: '#FFFFFF'}]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar itens */}
      <EditItemsModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        items={movies.map(movie => ({ id: movie.id, name: movie.name }))}
        onRename={renameMovie}
        onDelete={deleteMovie}
        type="movies"
      />

      {/* Modal para ordenação */}
      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        onSort={sortMovies}
        currentSort={currentSort}
      />

      {/* Modal Sobre o App */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={aboutModalVisible}
        onRequestClose={() => setAboutModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sobre o App</Text>
            <Text style={styles.aboutText}>
              MyMoveries é um aplicativo para organizar suas listas de filmes e séries favoritos.
            </Text>
            <Text style={styles.aboutText}>
              Versão 1.0.0
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton, {width: '100%', marginTop: 20}]}
              onPress={() => setAboutModalVisible(false)}>
              <Text style={[styles.modalButtonText, {color: '#FFFFFF'}]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  searchIcon: {
    fontSize: 20,
  },
  listContent: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  starButton: {
    marginRight: 10,
  },
  star: {
    fontSize: 24,
    color: '#CCCCCC',
  },
  starFilled: {
    fontSize: 24,
    color: '#FFD700',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 10,
  },
  footerButton: {
    padding: 10,
  },
  footerButtonText: {
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#000000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#000000',
  },
  modalButtonText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  settingsMenu: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  settingsText: {
    fontSize: 16,
  },
});

export default MoviesListScreen;
