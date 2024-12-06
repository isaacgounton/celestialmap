import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { HomeScreen } from "./screens/HomeScreen";
import { ParishMapScreen } from "./screens/ParishMapScreen";
import { ParishDetailsScreen } from "./screens/ParishDetailsScreen";
import { MarketplaceScreen } from "./screens/MarketplaceScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#4A90E2",
                },
                headerTintColor: "#ffffff",
                headerShown: true,
            }}
        >
            <StackNavigator.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "CelestialMap" }}
            />
            <StackNavigator.Screen
                name="ParishMap"
                component={ParishMapScreen}
                options={{ title: "Find Parishes" }}
            />
            <StackNavigator.Screen
                name="ParishDetails"
                component={ParishDetailsScreen}
                options={{ title: "Parish Details" }}
            />
            <StackNavigator.Screen
                name="Marketplace"
                component={MarketplaceScreen}
                options={{ title: "Marketplace" }}
            />
            <StackNavigator.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: "My Profile" }}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);