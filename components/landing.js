import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const Landing = () => {
  const navigation = useNavigation();
  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../images/backgroundHome.png")}
      style={landingStyles.backgroundImage}
    >
      <View style={landingStyles.container}>
        <View style={landingStyles.insideContainer}>
          <Image
            source={require("../images/logo.png")}
            style={landingStyles.additionalImage}
          />
          <Text style={landingStyles.textBetweenButtonAndImage}>
            Festival App
          </Text>
          <TouchableOpacity
            style={landingStyles.button}
            onPress={handleGetStarted}
          >
            <Text style={landingStyles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const landingStyles = {
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  insideContainer: {
    marginBottom: hp("20%"),
    alignItems: "center",
  },
  button: {
    backgroundColor: "#e3a224",
    paddingVertical: hp("1.1%"),
    paddingHorizontal: wp("10%"),
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("6%"),
    fontWeight: "bold",
  },
  textBetweenButtonAndImage: {
    color: "#fff",
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginBottom: hp("4%"),
  },
  additionalImage: {
    width: wp("50%"),
    height: hp("7%"),
    resizeMode: "contain",
  },
};

export default Landing;
