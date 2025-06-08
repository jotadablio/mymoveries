import React, { useState, useEffect, useRef } from 'react';
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
  Share,
  Platform,
  Animated,
  Keyboard,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditItemsModal from '../components/EditItemsModal';
import SortModal from '../components/SortModal';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { colors } from '../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const SERIES_STORAGE_KEY = '@MyMoveries:series';

const SeriesListScreen = ({ navigation }) => {
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSeriesName, setNewSeriesName] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [shareMenuVisible, setShareMenuVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState('name');
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const inputTranslateY = useRef(new Animated.Value(100)).current;
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // --- AsyncStorage Logic ---
  useEffect(() => {
    const loadSeries = async () => {
      try {
        const storedSeries = await AsyncStorage.getItem(SERIES_STORAGE_KEY);
        if (storedSeries !== null) {
          setSeries(JSON.parse(storedSeries));
        } else {
          setSeries([
            { id: '1', name: 'Breaking Bad', favorite: false, watched: false },
            { id: '2', name: 'Game of Thrones', favorite: false, watched: false },
            { id: '3', name: 'Stranger Things', favorite: false, watched: false },
          ]);
        }
      } catch (error) {
        console.error('Failed to load series from storage', error);
        Alert.alert('Erro', 'Não foi possível carregar as séries salvas.');
        setSeries([
            { id: '1', name: 'Breaking Bad', favorite: false, watched: false },
            { id: '2', name: 'Game of Thrones', favorite: false, watched: false },
            { id: '3', name: 'Stranger Things', favorite: false, watched: false },
          ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadSeries();
  }, []);

  useEffect(() => {
    const saveSeries = async () => {
      if (isLoading) return;
      try {
        await AsyncStorage.setItem(SERIES_STORAGE_KEY, JSON.stringify(series));
      } catch (error) {
        console.error('Failed to save series to storage', error);
      }
    };
    saveSeries();
  }, [series, isLoading]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardVisible(true);
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const updateSeries = (newSeriesList) => {
    setSeries(newSeriesList);
  };

  // --- Core List Logic ---
  const toggleFavorite = (id) => {
    const updatedSeries = series.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item,
    );
    updateSeries(updatedSeries);
  };

  const toggleWatched = (id) => {
    const updatedSeries = series.map(item =>
      item.id === id ? { ...item, watched: !item.watched } : item,
    );
    updateSeries(updatedSeries);
  };

  const addSeries = () => {
    if (newSeriesName.trim() === '') return;
    if (series.some(item => item.name.toLowerCase() === newSeriesName.toLowerCase())) {
      Alert.alert('Erro', 'Esta série já existe na lista!');
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name: newSeriesName,
      favorite: false,
      watched: false,
    };
    updateSeries([...series, newItem]);
    setNewSeriesName('');
    toggleAddInput();
  };

  const renameSeries = (id, newName) => {
    const nameExists = series.some(
      item => item.id !== id && item.name.toLowerCase() === newName.toLowerCase(),
    );
    if (nameExists) {
      Alert.alert('Erro', `Esta série já existe na lista!`);
      return false;
    }
    const updatedSeries = series.map(item =>
      item.id === id ? { ...item, name: newName } : item,
    );
    updateSeries(updatedSeries);
    return true;
  };

  const deleteSeries = (id) => {
    const updatedSeries = series.filter(item => item.id !== id);
    updateSeries(updatedSeries);
  };

  const sortSeries = (option) => {
    setCurrentSort(option);
    let sortedSeries = [...series];
    switch (option) {
      case 'name':
        sortedSeries.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'favorite':
        sortedSeries.sort((a, b) => {
          if (a.favorite === b.favorite) return a.name.localeCompare(b.name);
          return a.favorite ? -1 : 1;
        });
        break;
      case 'watched':
        sortedSeries.sort((a, b) => {
          if (a.watched === b.watched) return a.name.localeCompare(b.name);
          return a.watched ? -1 : 1;
        });
        break;
    }
    updateSeries(sortedSeries);
  };

  // Toggle add input field with animation
  const toggleAddInput = () => {
    if (showAddInput) {
      Keyboard.dismiss();
      // Animação para deslizar para baixo (por trás da bottombar)
      Animated.parallel([
        Animated.timing(inputTranslateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(inputOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowAddInput(false);
      });
    } else {
      setShowAddInput(true);
      // Resetar posição para começar de baixo
      inputTranslateY.setValue(100);
      inputOpacity.setValue(0);
      
      // Animação para deslizar para cima
      Animated.parallel([
        Animated.timing(inputTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(inputOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.starButton}
        onPress={() => toggleFavorite(item.id)}>
        {item.favorite ? (
          <MaterialIcons name="star" size={24} color={colors.favorite} />
        ) : (
          <MaterialIcons name="star-outline" size={24} color="rgba(242, 210, 133, 0.5)" />
        )}
      </TouchableOpacity>
      <Text style={styles.itemText}>{item.name}</Text>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleWatched(item.id)}>
        {item.watched ? (
          <MaterialIcons name="check-box" size={24} color={colors.primary} />
        ) : (
          <MaterialIcons name="check-box-outline-blank" size={24} color={colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  // --- Share Functions ---
  const shareAsText = async () => {
    setShareMenuVisible(false);
    try {
      let textContent = `Lista de Séries\n\n`;
      series.forEach((item, index) => {
        const favoriteStatus = item.favorite ? '⭐ ' : '';
        const watchedStatus = item.watched ? '[✓] ' : '[ ] ';
        textContent += `${index + 1}. ${favoriteStatus}${watchedStatus}${item.name}\n`;
      });
      textContent += '\nCompartilhado via MyMoveries App';
      await Share.share({
        message: textContent,
        title: 'Minha Lista de Séries'
      });
    } catch (error) {
      console.error('Erro ao compartilhar como texto:', error);
      if (error.message !== 'User did not share') {
          Alert.alert('Erro', 'Não foi possível compartilhar a lista como texto.');
      }
    }
  };

  const shareAsPDF = async () => {
    setShareMenuVisible(false);
    try {
      let htmlContent = `
        <!DOCTYPE html><html><head><meta charset="utf-8"><title>Lista de Séries</title><style>body{font-family:Arial,sans-serif;margin:20px;color:#333}h1{color:#4A0000;text-align:center;margin-bottom:30px}.item{padding:10px 0;border-bottom:1px solid #ddd}.favorite{color:#FFD700}.watched{color:#4CAF50}.footer{margin-top:30px;text-align:center;font-size:12px;color:#777}</style></head><body><h1>Lista de Séries</h1>`;
      series.forEach((item, index) => {
        const favoriteStatus = item.favorite ? `<span class="favorite">★</span> ` : '';
        const watchedStatus = item.watched ? `<span class="watched">✓</span> ` : '☐ ';
        htmlContent += `<div class="item">${index + 1}. ${favoriteStatus}${watchedStatus}${item.name}</div>`;
      });
      htmlContent += `<div class="footer">Gerado por MyMoveries App em ${new Date().toLocaleDateString()}</div></body></html>`;
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Erro', 'Compartilhamento de PDF não está disponível neste dispositivo');
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Erro ao compartilhar como PDF:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar a lista como PDF.');
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[colors.backgroundDark, colors.backgroundDarker]}
        style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.backgroundDark} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando séries...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.backgroundDark, colors.backgroundDarker]}
        style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.backgroundDark} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Lista de Séries</Text>
          </View>

          <FlatList
            data={series}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyListText}>Nenhuma série na lista ainda.</Text>}
          />

          {/* Footer Buttons - Fixed position */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => setShareMenuVisible(true)}>
              <MaterialCommunityIcons name="share-variant" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              onPress={toggleAddInput}>
              {showAddInput ? (
                <MaterialIcons name="close" size={32} color={colors.textDark} />
              ) : (
                <MaterialIcons name="add" size={32} color={colors.textDark} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => setSettingsVisible(true)}>
              <Ionicons name="settings-sharp" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Animated Add Input Field - Positioned above footer */}
          {showAddInput && (
            <Animated.View 
              style={[
                styles.addInputContainer, 
                { 
                  transform: [{ translateY: inputTranslateY }],
                  opacity: inputOpacity,
                  bottom: keyboardVisible ? keyboardHeight : 80,
                }
              ]}
            >
              <TextInput
                ref={inputRef}
                style={styles.addInput}
                placeholder="Nome da série"
                placeholderTextColor="rgba(242, 210, 133, 0.5)"
                value={newSeriesName}
                onChangeText={setNewSeriesName}
                onSubmitEditing={addSeries}
                returnKeyType="done"
                blurOnSubmit={false}
              />
              <TouchableOpacity style={styles.addConfirmButton} onPress={addSeries}>
                <MaterialIcons name="check" size={20} color={colors.textDark} />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Share Menu (Floating) */}
          {shareMenuVisible && (
            <View style={[styles.floatingMenu, styles.shareMenuPosition]}>
              <TouchableOpacity
                style={styles.floatingMenuItem}
                onPress={shareAsText}>
                <View style={styles.floatingMenuItemContent}>
                  <MaterialIcons name="text-snippet" size={20} color={colors.primary} />
                  <Text style={styles.floatingMenuText}>Compartilhar como Texto</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.floatingMenuItem}
                onPress={shareAsPDF}>
                <View style={styles.floatingMenuItemContent}>
                  <MaterialIcons name="picture-as-pdf" size={20} color={colors.primary} />
                  <Text style={styles.floatingMenuText}>Compartilhar como PDF</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.floatingMenuItem}
                onPress={() => setShareMenuVisible(false)}>
                <View style={styles.floatingMenuItemContent}>
                  <MaterialIcons name="close" size={20} color="#FF6B6B" />
                  <Text style={[styles.floatingMenuText, { color: '#FF6B6B' }]}>Fechar</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Settings Menu (Floating) */}
          {settingsVisible && (
            <View style={[styles.floatingMenu, styles.settingsMenuPosition]}>
              <TouchableOpacity
                style={styles.floatingMenuItem}
                onPress={() => { setSettingsVisible(false); setEditModalVisible(true); }}>
                <View style={styles.floatingMenuItemContent}>
                  <Feather name="edit-2" size={20} color={colors.primary} />
                  <Text style={styles.floatingMenuText}>Editar Itens</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.floatingMenuItem}
                onPress={() => { setSettingsVisible(false); setSortModalVisible(true); }}>
                <View style={styles.floatingMenuItemContent}>
                  <MaterialIcons name="sort" size={20} color={colors.primary} />
                  <Text style={styles.floatingMenuText}>Ordenar Por</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.floatingMenuItem}
                onPress={() => { setSettingsVisible(false); setAboutModalVisible(true); }}>
                <View style={styles.floatingMenuItemContent}>
                  <MaterialIcons name="info-outline" size={20} color={colors.primary} />
                  <Text style={styles.floatingMenuText}>Sobre o App</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.floatingMenuItem}
                onPress={() => setSettingsVisible(false)}>
                <View style={styles.floatingMenuItemContent}>
                  <MaterialIcons name="close" size={20} color="#FF6B6B" />
                  <Text style={[styles.floatingMenuText, { color: '#FF6B6B' }]}>Fechar</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Edit Items Modal */}
          <EditItemsModal
            visible={editModalVisible}
            onClose={() => setEditModalVisible(false)}
            items={series.map(item => ({ id: item.id, name: item.name }))}
            onRename={(id, newName) => {
                const success = renameSeries(id, newName);
                if (!success) return false;
                return true;
            }}
            onDelete={deleteSeries}
            type="series"
          />

          {/* Sort Modal */}
          <SortModal
            visible={sortModalVisible}
            onClose={() => setSortModalVisible(false)}
            onSort={sortSeries}
            currentSort={currentSort}
          />

          {/* About Modal */}
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
                  Versão 2.0.0
                </Text>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton, {width: '100%', marginTop: 20}]}
                  onPress={() => setAboutModalVisible(false)}>
                  <Text style={[styles.modalButtonText, {color: colors.white}]}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Overlay to close menus */}
          {(settingsVisible || shareMenuVisible) && (
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => {
                setSettingsVisible(false);
                setShareMenuVisible(false);
              }}
            />
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

// --- Styles with new color palette ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 210, 133, 0.3)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100, // Extra padding to ensure content is visible above footer
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(242, 210, 133, 0.1)',
    borderRadius: 8,
    marginVertical: 5,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  starButton: {
    padding: 5,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: colors.primary,
  },
  checkbox: {
    marginLeft: 10,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'rgba(242, 210, 133, 0.7)',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(242, 210, 133, 0.3)',
    backgroundColor: colors.backgroundDarker,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 10,
  },
  footerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(242, 210, 133, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Slightly elevated
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingMenu: {
    position: 'absolute',
    backgroundColor: 'rgba(42, 0, 0, 0.95)',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    zIndex: 1000,
  },
  shareMenuPosition: {
    bottom: 90,
    left: 20,
    width: 250,
  },
  settingsMenuPosition: {
    bottom: 90,
    right: 20,
    width: 250,
  },
  floatingMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 210, 133, 0.2)',
  },
  floatingMenuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingMenuText: {
    color: colors.primary,
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.backgroundDark,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: colors.primary,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(42, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(242, 210, 133, 0.3)',
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    zIndex: 5, // Menor que o zIndex do footer para ficar por trás
  },
  addInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(242, 210, 133, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: colors.primary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(242, 210, 133, 0.3)',
  },
  addConfirmButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SeriesListScreen;
