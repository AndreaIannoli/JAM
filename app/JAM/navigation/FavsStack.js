import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from "../activities/Home";
import Profile from "../activities/Profile";
import Favourites from "../activities/Favourites";
import Street from "../activities/Street";

const Stack = createNativeStackNavigator();

export default function FavsStack() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen name="Favourites" component={Favourites} />
                <Stack.Screen name="Street" component={Street} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
