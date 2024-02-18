import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Landing from "./components/landing";
import Login from "./components/login";
import Otp from "./components/otp";
import User from "./components/user";
import Frames from "./components/frames";
import NavigationService from "./components/navigationService";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <NavigationService />
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="Frames" component={Frames} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
