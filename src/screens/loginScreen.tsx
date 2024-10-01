import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from '../themes/styles';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';

interface FormLogin {
    email: string;
    password: string;
}

interface MessageSnackBar {
    visible: boolean;
    message: string;
    color: string;
}

export const LoginScreen = () => {

    const [formLogin, setFormLogin] = useState<FormLogin>({
        email: "",
        password: ""
    });

    const [showMessage, setShowMessage] = useState<MessageSnackBar>({
        visible: false,
        message: '',
        color: '#fff'
    });

    const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

    const navigation = useNavigation();

    const handlerSetValues = (key: string, value: string) => {
        setFormLogin({ ...formLogin, [key]: value });
    }

    const handlerLogin = async () => {
        if (!formLogin.email || !formLogin.password) {
            setShowMessage({
                visible: true,
                message: "campos incompletos, intente de nuevo y coloque bien sus campos",
                color: '#b53333'
            })
            return;
        }
        try {
            const response = await signInWithEmailAndPassword(
                auth,
                formLogin.email,
                formLogin.password
            );
        } catch (ex) {
            console.log(ex);
            setShowMessage({
                visible: true,
                message: "Usuario y/o contraseña incorrecta!",
                color: '#b53333'
            })
        }
    }

    return (

            <View style={styles.root}>
                <Text style={styles.textHead}>Inicia Sesión</Text>
                <TextInput
                    mode='outlined'
                    label='Correo'
                    placeholder='Escriba su correo'
                    style={styles.inputs}
                    onChangeText={(value) => handlerSetValues('email', value)}
                />
                <TextInput
                    mode='outlined'
                    label='Contraseña'
                    placeholder='Escriba su contraseña'
                    secureTextEntry={hiddenPassword}
                    right={<TextInput.Icon icon="eye"
                        onPress={() => setHiddenPassword(!hiddenPassword)} />}
                    style={styles.inputs}
                    onChangeText={(value) => handlerSetValues('password', value)}
                />
                <Button style={styles.button} mode="contained" onPress={handlerLogin}>
                    Iniciar Sesion
                </Button>
                <Text
                    style={styles.textRedirect}
                    onPress={() => navigation.dispatch(CommonActions.navigate({ name: "Register" }))}>
                    No tienes una cuenta? Regístrate ahora
                </Text>
                <Snackbar
                    visible={showMessage.visible}
                    onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                    style={{ backgroundColor: showMessage.color }}>
                    {showMessage.message}
                </Snackbar>
            </View>
    )
}