import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/loginScreen';
import { RegisterScreen } from '../screens/registerScreen';
import { HomeScreen } from '../screens/homeScreen'; 
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { styles } from '../themes/styles';

const Stack = createStackNavigator();

interface Routes {
    name: string;
    screen: () => JSX.Element; 
}

const routesNoAuth: Routes[] = [
    { name: "Login", screen: LoginScreen },
    { name: "Register", screen: RegisterScreen }
];

const routesAuth: Routes[] = [
    { name: "Home", screen: HomeScreen },
];

export const StackNavigator = () => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuth(!!user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            {isLoading ? (
                <View style={styles.root}>
                    <ActivityIndicator size={35} />
                </View>
            ) : (
                <Stack.Navigator>
                    {!isAuth ? (
                        routesNoAuth.map((item, index) => (
                            <Stack.Screen key={index} name={item.name} options={{ headerShown: false }} component={item.screen} />
                        ))
                    ) : (
                        routesAuth.map((item, index) => (
                            <Stack.Screen key={index} name={item.name} options={{ headerShown: false }} component={item.screen} />
                        ))
                    )}
                </Stack.Navigator>
            )}
        </>
    );
};