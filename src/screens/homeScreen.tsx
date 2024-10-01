import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../themes/styles';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut, User } from 'firebase/auth';

export const HomeScreen = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigation = useNavigation();
    const auth = getAuth();

    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <View style={styles.root}>
            {user && (
                <Text style={styles.text}>
                    Bienvenido, {user.displayName || 'Usuario'}!
                </Text>
            )}
            <Button
                style={styles.button}
                mode="contained"
                onPress={handleLogout}
            >
                Cerrar Sesión
            </Button>
        </View>
    );
};