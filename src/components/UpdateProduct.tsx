import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Modal, Button } from 'react-native-paper';
import { ref, update } from 'firebase/database';
import { dbRealTime } from '../configs/firebaseConfig';
import { styles } from '../themes/styles';

interface Product {
  id: string;
  nombre: string;
  desarrolladora: string;
  año: string;
  consola: string;
  stock: number;
  precio: number;
}

interface UpdateProductProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
  userId: string;
}

export const UpdateProduct: React.FC<UpdateProductProps> = ({ visible, onClose, product, userId }) => {
  const [nombre, setNombre] = useState<string>(product.nombre);
  const [desarrolladora, setDesarrolladora] = useState<string>(product.desarrolladora);
  const [año, setAño] = useState<string>(product.año);
  const [consola, setConsola] = useState<string>(product.consola);
  const [stock, setStock] = useState<number>(product.stock);
  const [precio, setPrecio] = useState<number>(product.precio);

  const handleUpdate = async () => {
    const productRef = ref(dbRealTime, `products/${userId}/${product.id}`);
    await update(productRef, {
      nombre,
      desarrolladora,
      año,
      consola,
      stock,
      precio,
    });
    onClose();
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContent}>
      <Text style={styles.textHead}>Actualizar Producto</Text>
      <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre" style={styles.input} />
      <TextInput value={desarrolladora} onChangeText={setDesarrolladora} placeholder="Desarrolladora" style={styles.input} />
      <TextInput value={año} onChangeText={setAño} placeholder="Año" style={styles.input} />
      <TextInput value={consola} onChangeText={setConsola} placeholder="Consola" style={styles.input} />
      <TextInput value={stock.toString()} onChangeText={(text) => setStock(Number(text))} placeholder="Stock" style={styles.input} />
      <TextInput value={precio.toString()} onChangeText={(text) => setPrecio(Number(text))} placeholder="Precio" style={styles.input} />
      <Button onPress={handleUpdate} style={styles.button}>Guardar Cambios</Button>
      <Button onPress={onClose} style={styles.cancelButton}>Cancelar</Button>
    </Modal>
  );
};