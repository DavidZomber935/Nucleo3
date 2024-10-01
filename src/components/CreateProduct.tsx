import React, { useState } from 'react';
import { Modal, View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { ref, push } from 'firebase/database';
import { dbRealTime } from '../configs/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { styles } from '../themes/styles';

interface CreateProductProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateProduct: React.FC<CreateProductProps> = ({ visible, onClose }) => {
  const [nombre, setNombre] = useState<string>('');
  const [desarrolladora, setDesarrolladora] = useState<string>('');
  const [año, setAño] = useState<string>('');
  const [consola, setConsola] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');

  const auth = getAuth();
  const user = auth.currentUser;

  const handleCreateProduct = async () => {
    if (user) {
      const productRef = ref(dbRealTime, `products/${user.uid}`);
      const newProduct = {
        nombre,
        desarrolladora,
        año,
        consola,
        stock: Number(stock),
        precio: Number(precio),
      };
      await push(productRef, newProduct);
      
      setNombre('');
      setDesarrolladora('');
      setAño('');
      setConsola('');
      setStock('');
      setPrecio('');

      onClose(); 
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.text}>Crear Producto</Text>
          <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.inputs} />
          <TextInput label="Desarrolladora" value={desarrolladora} onChangeText={setDesarrolladora} style={styles.inputs} />
          <TextInput label="Año" value={año} onChangeText={setAño} keyboardType="numeric" style={styles.inputs} />
          <TextInput label="Consola" value={consola} onChangeText={setConsola} style={styles.inputs} />
          <TextInput label="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" style={styles.inputs} />
          <TextInput label="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" style={styles.inputs} />
          
          <Button mode="contained" onPress={handleCreateProduct} style={styles.button}>Guardar</Button>
          <Button onPress={onClose} style={styles.button}>Cancelar</Button>
        </View>
      </View>
    </Modal>
  );
};