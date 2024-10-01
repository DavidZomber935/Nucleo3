import React, { useState } from "react";
import { View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { styles } from "../themes/styles";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, dbRealTime } from "../configs/firebaseConfig"; 
import { ref, set } from "firebase/database"; 
import { CommonActions, useNavigation } from "@react-navigation/native";

interface FormRegister {
  name: string;
  email: string;
  password: string;
}

interface MessageSnackBar {
  visible: boolean;
  message: string;
  color: string;
}

export const RegisterScreen = () => {
  const [formRegister, setFormRegister] = useState<FormRegister>({
    name: "",
    email: "",
    password: "",
  });

  const [showMessage, setShowMessage] = useState<MessageSnackBar>({
    visible: false,
    message: "",
    color: "#fff",
  });

  const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

  const navigation = useNavigation();

  const handlerSetValues = (key: string, value: string) => {
    setFormRegister({ ...formRegister, [key]: value });
  };

  const handlerRegister = async () => {
    if (!formRegister.name || !formRegister.email || !formRegister.password) {
      setShowMessage({
        visible: true,
        message: "Completa todos los campos!",
        color: "#b53333",
      });
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        formRegister.email,
        formRegister.password
      );

      if (response.user) {

        await updateProfile(response.user, {
          displayName: formRegister.name,
        });

        await set(ref(dbRealTime, 'users/' + response.user.uid), {
          name: formRegister.name,
          email: formRegister.email,
        });
      }

      setShowMessage({
        visible: true,
        message: "Registro exitoso!",
        color: "#146525",
      });

      navigation.dispatch(CommonActions.navigate({ name: "Login" }));
    } catch (ex) {
      console.log(ex);
      setShowMessage({
        visible: true,
        message: "No se logró completar el registro, intente más tarde.",
        color: "#b53333",
      });
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.textHead}>Regístrate</Text>
      <TextInput
        mode="outlined"
        label="Nombre"
        placeholder="Escriba su nombre"
        style={styles.inputs}
        onChangeText={(value) => handlerSetValues("name", value)}
      />
      <TextInput
        mode="outlined"
        label="Correo"
        placeholder="Escriba su correo"
        style={styles.inputs}
        onChangeText={(value) => handlerSetValues("email", value)}
      />
      <TextInput
        mode="outlined"
        label="Contraseña"
        placeholder="Escriba su contraseña"
        secureTextEntry={hiddenPassword}
        right={
          <TextInput.Icon
            icon="eye"
            onPress={() => setHiddenPassword(!hiddenPassword)}
          />
        }
        style={styles.inputs}
        onChangeText={(value) => handlerSetValues("password", value)}
      />
      <Button style={styles.button} mode="contained" onPress={handlerRegister}>
        Registrar
      </Button>
      <Text
        style={styles.textRedirect}
        onPress={() =>
          navigation.dispatch(CommonActions.navigate({ name: "Login" }))
        }
      >
        Ya tienes una cuenta? Inicia sesión
      </Text>
      <Snackbar
        visible={showMessage.visible}
        onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
        style={{ backgroundColor: showMessage.color }}
      >
        {showMessage.message}
      </Snackbar>
    </View>
  );
};