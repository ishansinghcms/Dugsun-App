import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const Otp = ({ navigation, route }) => {
  const { phoneNumber, email } = route.params;
  const [otp, setOtp] = useState("");
  const [apiOtp, setApiOtp] = useState();

  const handleNextPress = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a 6 digit OTP");
      return;
    }
    if (otp === apiOtp) {
      await AsyncStorage.setItem("userLoggedIn", "true");
      navigation.navigate("User", { phoneNumber });
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again");
    }
  };

  useEffect(() => {
    const fetchOtp = async () => {
      try {
        const response = await fetch(
          `https://api.dugsun.co.in/users/get-otp/${email}`
        );
        const data = await response.json();

        if (response.ok) {
          setApiOtp(data.otp);
        } else {
          Alert.alert("Error", data.error || "Failed to fetch OTP");
        }
      } catch (error) {
        console.error("Error fetching OTP:", error);
        Alert.alert("Error", "Something went wrong. Please try again");
      }
    };
    fetchOtp();
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
        <Text style={loginStyles.otpText}>
          OTP sent to your registered email
        </Text>
        <TextInput
          style={loginStyles.inputField}
          placeholder="Enter OTP"
          keyboardType="phone-pad"
          placeholderTextColor="#ffffff"
          onChangeText={(text) => setOtp(text)}
        />
        <TouchableOpacity
          style={loginStyles.nextButton}
          onPress={handleNextPress}
        >
          <Text style={loginStyles.nextButtonText}>Submit{">"}</Text>
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
  otpText: {
    color: "#fff",
    position: "absolute",
    top: hp("22%"),
    fontSize: wp("5%"),
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: hp("4%"),
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

export default Otp;
