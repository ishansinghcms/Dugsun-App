import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const NavigationService = () => {
  const navigation = useNavigation();
  const getLoginDetails = async () => {
    const userLoggedIn = await AsyncStorage.getItem("userLoggedIn");

    if (userLoggedIn === "true") {
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      navigation.navigate("User", { phoneNumber });
    }
  };

  useEffect(() => {
    getLoginDetails();
  }, []);
  return null;
};

export default NavigationService;
