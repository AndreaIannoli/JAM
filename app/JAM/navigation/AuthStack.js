import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Onboarding from "../activities/Onboarding";
import Authentication from "../activities/Authentication";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="Authentication" component={Authentication} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
