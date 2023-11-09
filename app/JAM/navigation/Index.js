import React from 'react';
import { useAuth } from '../hooks/useAuth';
import UserStack from "./UserStack";
import AuthStack from "./AuthStack";

export default function RootNavigation() {
    const { user } = useAuth();

    return user ? <UserStack /> : <AuthStack />;
}
