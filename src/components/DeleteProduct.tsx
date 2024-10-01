import React from 'react';
import { Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import { ref, remove } from 'firebase/database';
import { dbRealTime } from '../configs/firebaseConfig';

export const DeleteProduct = ({ productId, userId }) => {
  const handleDelete = () => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            const productRef = ref(dbRealTime, `products/${userId}/${productId}`);
            await remove(productRef);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return <IconButton icon="delete" size={24} onPress={handleDelete} />;
};