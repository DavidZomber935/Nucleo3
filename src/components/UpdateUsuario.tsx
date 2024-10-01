import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { styles } from '../themes/styles';

interface UpdateUsuarioProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
}

export const UpdateUsuario: React.FC<UpdateUsuarioProps> = ({ visible, onClose, onSave }) => {
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    if (newName) {
      onSave(newName);
      setNewName(''); 
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.textHead}>Modificar Nombre</Text>
          <TextInput
            label="Nuevo nombre"
            value={newName}
            onChangeText={(text) => setNewName(text)}
            style={styles.inputs}
          />
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
          >
            Guardar
          </Button>
          <Button
            mode="outlined"
            onPress={onClose}
            style={styles.button}
          >
            Cancelar
          </Button>
        </View>
      </View>
    </Modal>
  );
};