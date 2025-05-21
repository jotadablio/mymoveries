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

type Series = {
  id: string;
  name: string;
  favorite: boolean;
  watched: boolean;
};

type SortOption = 'name' | 'favorite' | 'watched';

const SeriesListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [series, setSeries] = useState<Series[]>([
    { id: '1', name: 'Breaking Bad', favorite: false, watched: false },
    { id: '2', name: 'Game of Thrones', favorite: false, watched: false },
    { id: '3', name: 'Stranger Things', favorite: false, watched: false },
    { id: '4', name: 'The Office', favorite: false, watched: false },
    { id: '5', name: 'Friends', favorite: false, watched: false },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('name');
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const toggleFavorite = (id: string) => {
    setSeries(
      series.map(item =>
        item.id === id ? { ...item, favorite: !item.favorite } : item,
      ),
    );
  };

  const toggleWatched = (id: string) => {
    setSeries(
      series.map(item =>
        item.id === id ? { ...item, watched: !item.watched } : item,
      ),
    );
  };

  const addSeries = () => {
    if (newSeriesName.trim() === '') return;
    
    // Verificar se o nome já existe
    if (series.some(item => item.name.toLowerCase() === newSeriesName.toLowerCase())) {
      Alert.alert('Erro', 'Esta série já existe na lista!');
      return;
    }
    
    const newItem: Series = {
      id: Date.now().toString(),
      name: newSeriesName,
      favorite: false,
      watched: false,
    };
    setSeries([...series, newItem]);
    setNewSeriesName('');
    setModalVisible(false);
  };

  const renameSeries = (id: string, newName: string) => {
    setSeries(
      series.map(item =>
        item.id === id ? { ...item, name: newName } : item,
      ),
    );
  };

  const deleteSeries = (id: string) => {
    setSeries(series.filter(item => item.id !== id));
  };

  const sortSeries = (option: SortOption) => {
    setCurrentSort(option);
    
    let sortedSeries = [...series];
    
    switch (option) {
      case 'name':
        sortedSeries.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'favorite':
        sortedSeries.sort((a, b) => {
          if (a.favorite === b.favorite) {
            return a.name.localeCompare(b.name);
          }
          return a.favorite ? -1 : 1;
        });
        break;
      case 'watched':
        sortedSeries.sort((a, b) => {
          if (a.watched === b.watched) {
            return a.name.localeCompare(b.name);
          }
          return a.watched ? -1 : 1;
        });
        break;
    }
    
    setSeries(sortedSeries);
  };

  const renderItem = ({ item }: { item: Series }) => (
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
    ShareService.showShareOptions(series, 'Lista de Séries');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Séries</Text>
        <TouchableOpacity>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={series}
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

      {/* Modal para adicionar nova série */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Série</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da série"
              value={newSeriesName}
              onChangeText={setNewSeriesName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewSeriesName('');
                }}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addSeries}>
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
        items={series.map(item => ({ id: item.id, name: item.name }))}
        onRename={renameSeries}
        onDelete={deleteSeries}
        type="series"
      />

      {/* Modal para ordenação */}
      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        onSort={sortSeries}
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

export default SeriesListScreen;
