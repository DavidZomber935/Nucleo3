import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, ScrollView, StatusBar } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut, updateProfile, User } from "firebase/auth";
import { ref, onValue, update } from "firebase/database";
import { dbRealTime } from "../configs/firebaseConfig";
import { styles } from "../themes/styles";
import { UpdateUsuario } from "../components/UpdateUsuario";
import { CreateProduct } from "../components/CreateProduct";
import { UpdateProduct } from "../components/UpdateProduct"; 
import { DeleteProduct } from "../components/DeleteProduct"; 


interface Product {
  id: string;
  nombre: string;
  desarrolladora: string;
  año: string;
  consola: string;
  stock: number;
  precio: number;
}

export const HomeScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); 
  const [products, setProducts] = useState<Product[]>([]); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [isProductModalVisible, setProductModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); 

  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      const productsRef = ref(dbRealTime, `products/${currentUser.uid}`);
      onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setProducts(productsArray);
        }
      });
    }
  }, [auth]);


  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const handleNameChange = async (newName: string) => {
    if (user && newName) {
      try {
        await updateProfile(user, { displayName: newName });
        await update(ref(dbRealTime, `users/${user.uid}`), {
          name: newName,
        });
        setUser({ ...user, displayName: newName });
        setModalVisible(false); 
      } catch (error) {
        console.error("Error al actualizar el nombre:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.root}>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>
            Bienvenido, {user?.displayName || "Usuario"}!
          </Text>
          <IconButton
            icon="pencil"
            size={24}
            onPress={() => setModalVisible(true)}
            style={styles.iconButton}
          />
          <IconButton
            icon="plus-circle"
            size={24}
            onPress={() => setProductModalVisible(true)}
            style={styles.iconButton}
          />
        </View>


        <UpdateUsuario
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleNameChange}
        />


        <CreateProduct
          visible={isProductModalVisible}
          onClose={() => setProductModalVisible(false)}
        />

        <ScrollView style={{ width: "100%" }}>
          {products.map((product) => (
            <View key={product.id} style={styles.container}>
              <Text style={styles.secondaryText}>{product.nombre}</Text>
              <Text style={styles.text}>${product.precio}</Text>

 
              <IconButton
                icon="pencil"
                size={24}
                onPress={() => {
                  setSelectedProduct(product);
                  setUpdateModalVisible(true);
                }}
              />


              <DeleteProduct productId={product.id} userId={user?.uid || ""} />
            </View>
          ))}
        </ScrollView>


        {selectedProduct && (
          <UpdateProduct
            visible={isUpdateModalVisible}
            onClose={() => setUpdateModalVisible(false)}
            product={selectedProduct}
            userId={user?.uid || ""}
          />
        )}


        <Button style={styles.button} mode="contained" onPress={handleLogout}>
          Cerrar Sesión
        </Button>
      </View>
    </SafeAreaView>
  );
};