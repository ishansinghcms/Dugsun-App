import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Video from "react-native-video";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const User = ({ route }) => {
  const { phoneNumber } = route.params;
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [noData, setNoData] = useState(false);
  const navigation = useNavigation();
  const videoRef = useRef();

  const dates = [];

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const generateDates = (numberOfDays) => {
    const datesMenu = [];

    for (let i = 0; i < numberOfDays; i++) {
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + i);
      if (i === 0) {
        datesMenu.push("Today");
        dates.push(formatDate(nextDate));
      } else if (i === 1) {
        datesMenu.push("Tomorrow");
        dates.push(formatDate(nextDate));
      } else {
        datesMenu.push(
          nextDate.toLocaleString("default", {
            month: "long",
            day: "numeric",
          })
        );
        dates.push(formatDate(nextDate));
      }
    }
    return datesMenu;
  };

  onBuffer = (bufferStatus) => {
    console.log("Buffering:", bufferStatus.isBuffering);
  };

  videoError = (error) => {
    console.error("Video Error:", error);
  };

  const LogoutButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={userStyles.logoutButton} onPress={onPress}>
        <Text style={userStyles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    );
  };

  const renderMediaItem = ({ item }) => {
    const fileExtension = item.split(".").pop().toLowerCase();
    const handleImageClick = () => {
      navigation.navigate("Frames", {
        item,
        selectedDate,
        phoneNumber,
      });
    };
    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      return (
        <TouchableOpacity onPress={handleImageClick}>
          <Image source={{ uri: item }} style={userStyles.mediaItem} />
        </TouchableOpacity>
      );
    } else if (["mp4", "avi", "mkv"].includes(fileExtension)) {
      return (
        <TouchableOpacity onPress={handleImageClick}>
          <Video
            source={{ uri: item }}
            controls={false}
            paused={true}
            ref={videoRef}
            onBuffer={() => {}}
            onError={() => {}}
            style={userStyles.backgroundVideo}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const datesMenu = generateDates(5);
  const fetchData = async (date, index) => {
    try {
      const dateFormat = dates[index];
      setSelectedDate(dateFormat);
      const response = await fetch(
        `https://api.dugsun.co.in/media/${dateFormat}`
      );
      const result = await response.json();
      if (result.media.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }
      const cloudinaryUrls = result.media.map((item) => item.cloudinaryUrl);
      const imageFormats = /\.(jpg|jpeg|png)$/i;
      const videoFormats = /\.(mp4|avi|mov|mkv)$/i;
      // Separate URLs for images and videos
      const imageUrls = cloudinaryUrls.filter((url) => imageFormats.test(url));
      const videoUrls = cloudinaryUrls.filter((url) => videoFormats.test(url));
      setImageData(imageUrls);
      const combinedUrls = imageUrls.concat(videoUrls);
      setMediaData(combinedUrls);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderItemWithHeading = ({ item, index }) => {
    const mediaType = index < imageData.length ? "Images" : "Videos";
    if (
      index === 0 ||
      (index === imageData.length && index < mediaData.length)
    ) {
      return (
        <>
          <Text style={userStyles.mediaType}>{mediaType}</Text>
          {renderMediaItem({ item })}
        </>
      );
    }
    return renderMediaItem({ item });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem("userLoggedIn", "false");
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("phoneNumber");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  useEffect(() => {
    setSelectedDate(dates[0]);
    fetchData(dates[0], 0);
  }, []);

  return (
    <View style={userStyles.container}>
      <View style={userStyles.topContainer}>
        <Image
          source={require("../images/logo.png")}
          style={userStyles.image}
        />
        <LogoutButton onPress={handleLogout} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={userStyles.dateContainer}
      >
        {datesMenu.map((date, index) => (
          <DateButton
            key={index}
            title={date}
            onPress={() => fetchData(date, index)}
            selected={selectedDate === dates[index]}
          />
        ))}
      </ScrollView>
      {noData && <Text style={userStyles.noData}>No media for this date.</Text>}
      <FlatList
        data={mediaData}
        renderItem={renderItemWithHeading}
        keyExtractor={(item) => item}
        vertical
        showsVerticalScrollIndicator={false}
        contentContainerStyle={userStyles.mediaContainer}
      />
    </View>
  );
};

const DateButton = ({ title, onPress, selected }) => {
  return (
    <TouchableOpacity style={userStyles.dateButton} onPress={onPress}>
      <Text
        style={[userStyles.dateButtonText, selected && userStyles.selectedDate]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const userStyles = {
  logoutButton: {
    position: "absolute",
    top: hp("4.8%"),
    left: wp("77%"),
    backgroundColor: "#e3a224",
    borderRadius: 30,
    paddingVertical: hp("0.3%"),
    width: hp("9%"),
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    textAlign: "center",
  },
  noData: {
    color: "#fff",
    fontSize: wp("7%"),
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  mediaType: {
    marginLeft: -wp("17%"),
    marginRight: -wp("17%"),
    paddingLeft: wp("2.5%"),
    textAlign: "left",
    fontWeight: "bold",
    fontSize: wp("5.5%"),
    color: "#fff",
    backgroundColor: "rgba(227, 162, 36, 1)",
    marginTop: hp("2.8%"),
    borderRadius: 5,
    borderColor: "#666bfa",
  },
  backgroundVideo: {
    height: hp("16%"),
    width: wp("60%"),
    borderColor: "#fff",
    marginTop: hp("2.8%"),
  },
  container: {
    flex: 1,
    backgroundColor: "#071c39",
  },
  mediaItem: {
    width: hp("27%"),
    height: hp("27%"),
    resizeMode: "cover",
    marginTop: hp("2.8%"),
    borderRadius: 15,
  },
  mediaContainer: {
    alignItems: "center",
  },
  image: {
    width: wp("37%"),
    height: hp("9%"),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: hp("2%"),
  },
  dateContainer: {
    marginTop: hp("2%"),
    paddingHorizontal: wp("3%"),
  },
  dateButton: {
    height: hp("6%"),
    paddingRight: wp("12%"),
    marginBottom: hp("2%"),
  },
  dateButtonText: {
    color: "#fff",
    fontSize: wp("6.4%"),
  },
  selectedDate: {
    borderBottomWidth: 3,
    borderBottomColor: "#fff",
    fontWeight: "bold",
  },
};

export default User;
