import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Image,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [userData, setUserData] = useState([]);

  const handleNextPress = async () => {
    try {
      if (phoneNumber.length !== 10) {
        Alert.alert("Error", "Please enter a 10 digit Phone Number");
        return;
      }
      if (
        userData &&
        Array.isArray(userData) &&
        userData.some((user) => user.phone === phoneNumber)
      ) {
        setDisableBtn(true);
        const foundUser = userData.find((user) => user.phone === phoneNumber);
        const email = foundUser.email;
        axios
          .post(`https://api.dugsun.co.in/users/send-otp/${email}`)
          .catch((error) => console.error(error));

        await AsyncStorage.setItem("userToken", email);
        await AsyncStorage.setItem("phoneNumber", phoneNumber);

        navigation.navigate("Otp", { phoneNumber, email });
        setDisableBtn(false);
      } else {
        Alert.alert("Error", "Phone Number not registered!.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Something went wrong. Please try again");
    }
  };

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetch("https://api.dugsun.co.in/users/all");
        const data = await response.json();

        if (response.ok) {
          setUserData(data.users);
        } else {
          Alert.alert("Error", data.error || "Failed to fetch Users list.");
        }
      } catch (error) {
        console.error("Error fetching users list:", error);
      }
    };
    fetchUserList();
  }, []);

  return (
    <ImageBackground
      source={require("../images/backgroundLogin.png")}
      style={loginStyles.backgroundImage}
    >
      <View style={loginStyles.container}>
        <Image
          source={require("../images/logo.png")}
          style={loginStyles.logo}
        />
        <TextInput
          style={loginStyles.inputField}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          placeholderTextColor="#ffffff"
          onChangeText={(text) => setPhoneNumber(text)}
        />
        <TouchableOpacity
          style={loginStyles.nextButton}
          onPress={handleNextPress}
          disabled={disableBtn}
        >
          <Text style={loginStyles.nextButtonText}>Next{">"}</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  );
};

const loginStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
  },
  logo: {
    width: wp("37%"),
    height: hp("10%"),
    resizeMode: "contain",
    alignSelf: "flex-start",
    marginLeft: hp("6%"),
  },
  inputField: {
    height: hp("6%"),
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#e3a224",
    borderRadius: 30,
    width: "70%",
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: wp("6%"),
    marginTop: hp("17%"),
    marginBottom: hp("6%"),
  },
  nextButton: {
    paddingVertical: hp("1%"),
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: wp("6%"),
    fontWeight: "bold",
  },
});

export default Login;
