import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

type SortOption = 'name' | 'favorite' | 'watched';

type SortModalProps = {
  visible: boolean;
  onClose: () => void;
  onSort: (option: SortOption) => void;
  currentSort: SortOption;
};

const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  onSort,
  currentSort,
}) => {
  const sortOptions: Array<{id: SortOption; label: string}> = [
    { id: 'name', label: 'Nome' },
    { id: 'favorite', label: 'Favoritos' },
    { id: 'watched', label: 'Assistidos' },
  ];

  const renderItem = ({ item }: { item: {id: SortOption; label: string} }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        currentSort === item.id && styles.selectedOption,
      ]}
      onPress={() => {
        onSort(item.id);
        onClose();
      }}>
      <Text
        style={[
          styles.optionText,
          currentSort === item.id && styles.selectedOptionText,
        ]}>
        {item.label}
      </Text>
      {currentSort === item.id && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ordenar Por</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={sortOptions}
            renderItem={renderItem}
            keyExtractor={item => item.id}
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
    width: '80%',
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
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
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

export default SortModal;
