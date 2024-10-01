import React, { useState } from 'react';
import { Modal, View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { ref, push } from 'firebase/database';
import { dbRealTime } from '../configs/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { styles } from '../themes/styles';

export const CreateProduct = ({ visible, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [desarrolladora, setDesarrolladora] = useState('');
  const [año, setAño] = useState('');
  const [consola, setConsola] = useState('');
  const [stock, setStock] = useState('');
  const [precio, setPrecio] = useState('');

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
      
      // Limpiar los campos después de crear el producto
      setNombre('');
      setDesarrolladora('');
      setAño('');
      setConsola('');
      setStock('');
      setPrecio('');

      onClose(); // Cerrar el modal después de agregar el producto
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