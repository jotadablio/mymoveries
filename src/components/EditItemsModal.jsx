import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { colors } from '../utils/colors';

const EditItemsModal = ({
  visible,
  onClose,
  items,
  onRename,
  onDelete,
  type,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');

  const startEditing = (id, currentName) => {
    setEditingId(id);
    setNewName(currentName);
  };

  const confirmRename = (id) => {
    if (newName.trim() === '') {
      Alert.alert('Erro', 'O nome não pode estar vazio');
      return;
    }

    const nameExists = items.some(
      item => item.id !== id && item.name.toLowerCase() === newName.toLowerCase(),
    );

    if (nameExists) {
      Alert.alert('Erro', `Este ${type === 'movies' ? 'filme' : 'série'} já existe na lista!`);
      return;
    }

    const success = onRename(id, newName);
    if (success) { // Only close if rename was successful
        setEditingId(null);
        setNewName('');
    }
  };

  const confirmDelete = (id, name) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir "${name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => onDelete(id),
          style: 'destructive',
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {editingId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={newName}
            onChangeText={setNewName}
            autoFocus
            placeholderTextColor="rgba(242, 210, 133, 0.5)"
          />
          <TouchableOpacity
            style={[styles.editButton, styles.confirmButton]}
            onPress={() => confirmRename(item.id)}>
            <MaterialIcons name="check" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editButton, styles.cancelButton]}
            onPress={() => setEditingId(null)}>
            <MaterialIcons name="close" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>{item.name}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editActionButton]}
              onPress={() => startEditing(item.id, item.name)}>
              <Feather name="edit-2" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteActionButton]}
              onPress={() => confirmDelete(item.id, item.name)}>
              <Feather name="trash-2" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Editar {type === 'movies' ? 'Filmes' : 'Séries'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.itemsList}
          />

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Concluído</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Updated styles with new color palette
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 210, 133, 0.3)',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeButton: {
    padding: 5,
  },
  itemsList: {
    // Removed maxHeight to allow content to define height up to modal max
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 210, 133, 0.2)',
    paddingVertical: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
    minHeight: 36,
  },
  editActionButton: {
    backgroundColor: 'rgba(242, 210, 133, 0.2)',
  },
  deleteActionButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(242, 210, 133, 0.3)',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: 'rgba(242, 210, 133, 0.1)',
    color: colors.primary,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
    minHeight: 36,
  },
  confirmButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  doneButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditItemsModal;
