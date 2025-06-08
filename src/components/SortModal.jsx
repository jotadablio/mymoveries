import React from 'react';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { colors } from '../utils/colors';

const SortModal = ({
  visible,
  onClose,
  onSort,
  currentSort,
}) => {
  const sortOptions = [
    { id: 'name', label: 'Nome' },
    { id: 'favorite', label: 'Favoritos' },
    { id: 'watched', label: 'Assistidos' },
  ];

  const renderItem = ({ item }) => (
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
        <MaterialIcons name="check" size={22} color={colors.primary} />
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
              <MaterialIcons name="close" size={24} color={colors.primary} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 10,
    padding: 20,
    width: '80%',
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
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 210, 133, 0.2)',
  },
  selectedOption: {
    backgroundColor: 'rgba(242, 210, 133, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: colors.primary,
  },
  selectedOptionText: {
    fontWeight: 'bold',
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

export default SortModal;
