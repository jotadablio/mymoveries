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

type EditModalProps = {
  visible: boolean;
  onClose: () => void;
  items: Array<{id: string; name: string}>;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  type: 'movies' | 'series';
};

const EditItemsModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  items,
  onRename,
  onDelete,
  type,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setNewName(currentName);
  };

  const confirmRename = (id: string) => {
    if (newName.trim() === '') {
      Alert.alert('Erro', 'O nome não pode estar vazio');
      return;
    }

    // Verificar se o nome já existe (exceto para o item atual)
    const nameExists = items.some(
      item => item.id !== id && item.name.toLowerCase() === newName.toLowerCase(),
    );

    if (nameExists) {
      Alert.alert('Erro', `Este ${type === 'movies' ? 'filme' : 'série'} já existe na lista!`);
      return;
    }

    onRename(id, newName);
    setEditingId(null);
    setNewName('');
  };

  const confirmDelete = (id: string, name: string) => {
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

  const renderItem = ({ item }: { item: {id: string; name: string} }) => (
    <View style={styles.itemContainer}>
      {editingId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={newName}
            onChangeText={setNewName}
            autoFocus
          />
          <TouchableOpacity
            style={[styles.editButton, styles.confirmButton]}
            onPress={() => confirmRename(item.id)}>
            <Text style={styles.editButtonText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editButton, styles.cancelButton]}
            onPress={() => setEditingId(null)}>
            <Text style={styles.editButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>{item.name}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editActionButton]}
              onPress={() => startEditing(item.id, item.name)}>
              <Text style={styles.actionButtonText}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteActionButton]}
              onPress={() => confirmDelete(item.id, item.name)}>
              <Text style={styles.actionButtonText}>🗑</Text>
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
              <Text style={styles.closeButtonText}>✕</Text>
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

const styles = StyleSheet.create({
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
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemsList: {
    maxHeight: '80%',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
    borderRadius: 5,
  },
  editActionButton: {
    backgroundColor: '#F0F0F0',
  },
  deleteActionButton: {
    backgroundColor: '#FFE0E0',
  },
  actionButtonText: {
    fontSize: 16,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  editButton: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  confirmButton: {
    backgroundColor: '#E0FFE0',
  },
  cancelButton: {
    backgroundColor: '#FFE0E0',
  },
  editButtonText: {
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditItemsModal;
