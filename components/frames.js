import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Video from "react-native-video";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

//openURL sub component
const handlePress = async (url) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.warn(`Don't know how to open URL: ${url}`);
  }
};

//frames component
const Frames = ({ route }) => {
  const [totalFrames, setTotalFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const navigation = useNavigation();
  const { item, selectedDate, phoneNumber } = route.params;
  const videoRef = useRef();

  //data format
  const formatDateToOrdinal = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const getOrdinalSuffix = (number) => {
      const suffixes = ["th", "st", "nd", "rd"];
      const v = number % 100;
      return v >= 11 && v <= 13 ? "th" : suffixes[v % 10] || "th";
    };
    const ordinalSuffix = getOrdinalSuffix(day);
    return `${day}${ordinalSuffix} ${month}`;
  };
  const formattedDate = formatDateToOrdinal(selectedDate);

  //render image sub component
  const renderImageItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleFramePress(item)}>
        <Image
          source={{
            uri: item.cloudinaryUrl,
          }}
          style={{
            flex: 1,
            width: wp("35%"),
            marginHorizontal: 5,
            borderWidth: 3,
            borderColor: "#fff",
            backgroundColor: selectedFrame === item ? "#f7d992" : "transparent",
            borderRadius: 20,
          }}
        />
      </TouchableOpacity>
    );
  };

  const MediaItem = ({ item }) => {
    const mediaUrl = item;
    const fileExtension = item.split(".").pop().toLowerCase();

    if (["mp4", "mov", "avi"].includes(fileExtension)) {
      return (
        <View style={framesStyles.empty}>
          <Video
            source={{ uri: item }}
            controls={true}
            ref={videoRef}
            onBuffer={() => {}}
            onError={() => {}}
            style={framesStyles.mediaItem}
            resizeMode="contain"
          />
          {selectedFrame && (
            <>
              {isVideo(selectedFrame.cloudinaryUrl) ? (
                <Video
                  source={{
                    uri: selectedFrame.cloudinaryUrl,
                  }}
                  controls={true}
                  ref={videoRef}
                  onBuffer={() => {}}
                  onError={() => {}}
                  resizeMode="contain"
                  style={{
                    position: "absolute",
                    top: hp("2.25%"),
                    left: wp("6.2%"),
                    width: wp("85%"),
                    height: hp("40%"),
                    left: wp("7.5%"),
                    borderRadius: 20,
                    zIndex: 1,
                  }}
                />
              ) : (
                <Image
                  source={{
                    uri: selectedFrame.cloudinaryUrl,
                  }}
                  style={{
                    position: "absolute",
                    top: hp("2.25%"),
                    left: wp("6.2%"),
                    width: wp("85%"),
                    height: hp("40%"),
                    left: wp("7.5%"),
                    resizeMode: "cover",
                    borderRadius: 20,
                    zIndex: 1,
                  }}
                />
              )}
            </>
          )}
        </View>
      );
    } else {
      return (
        <View style={framesStyles.empty}>
          <Image source={{ uri: mediaUrl }} style={framesStyles.mediaItem} />
          {selectedFrame && (
            <>
              {isVideo(selectedFrame.cloudinaryUrl) ? (
                <Video
                  source={{
                    uri: selectedFrame.cloudinaryUrl,
                  }}
                  controls={true}
                  ref={videoRef}
                  onBuffer={() => {}}
                  onError={() => {}}
                  resizeMode="contain"
                  style={{
                    position: "absolute",
                    marginTop: 20,
                    left: wp("6.2%"),
                    width: wp("85%"),
                    height: hp("40%"),
                    left: wp("7.5%"),
                    borderRadius: 20,
                    zIndex: 1,
                  }}
                />
              ) : (
                <Image
                  source={{
                    uri: selectedFrame.cloudinaryUrl,
                  }}
                  style={{
                    position: "absolute",
                    marginTop: 20,
                    left: wp("6.2%"),
                    width: wp("85%"),
                    height: hp("40%"),
                    left: wp("7.5%"),
                    resizeMode: "cover",
                    borderRadius: 20,
                    zIndex: 1,
                  }}
                />
              )}
            </>
          )}
        </View>
      );
    }
  };

  const handleNextPress = () => {
    navigation.navigate("User", { phoneNumber });
  };

  const onDownload = async () => {
    if (!selectedFrame) {
      handlePress(item);
      return;
    }
    const encodedItem = encodeURIComponent(item);
    const encodedSelectedFrame = encodeURIComponent(
      selectedFrame.cloudinaryUrl
    );
    setLoadingModalVisible(true);
    try {
      const response = await fetch(
        `https://api.dugsun.co.in/users/addFrame/${phoneNumber}/${encodedItem}/${encodedSelectedFrame}`,
        { method: "POST" }
      );
      if (response.ok) {
        const data = await response.json();
        handlePress(data.fileUrl);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoadingModalVisible(false);
    }
  };

  const handleFramePress = (frame) => {
    setSelectedFrame((prevFrame) => (prevFrame === frame ? null : frame));
  };

  const isVideo = (filename) => {
    const fileExtension = filename.split(".").pop().toLowerCase();
    return ["mp4", "mov", "avi"].includes(fileExtension);
  };

  useEffect(() => {
    const phno = phoneNumber;
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `https://api.dugsun.co.in/users/user/${phno}`
        );
        if (response.ok) {
          const data = await response.json();
          const dataArray = data.user.frames;
          setTotalFrames(dataArray);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <View style={framesStyles.container}>
      <Image
        source={require("../images/logo.png")}
        style={framesStyles.image}
      />
      <TouchableOpacity
        style={framesStyles.nextButton}
        onPress={handleNextPress}
      >
        <Text style={framesStyles.nextButtonText}>{"\u2190"}</Text>
      </TouchableOpacity>
      <Text style={framesStyles.dateDisplay}>{formattedDate}</Text>
      <View style={framesStyles.imageCenter}>
        <MediaItem item={item} />
      </View>
      <View style={framesStyles.buttonsContainer}>
        <TouchableOpacity
          onPress={onDownload}
          style={[framesStyles.downloadButton, { backgroundColor: "#fff" }]}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/metro/26/download.png",
            }}
            style={framesStyles.icon}
          />
        </TouchableOpacity>
      </View>
      <Text style={framesStyles.framesText}>Frames</Text>
      <FlatList
        data={totalFrames}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.uniqueName}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <Modal
        transparent={true}
        animationType="slide"
        visible={loadingModalVisible}
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              padding: 20,
              borderRadius: 10,
              backgroundColor: "white",
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "bold" }}>
              Downloading...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const framesStyles = {
  icon: {
    width: hp("3.5%"),
    height: hp("3.5%"),
    resizeMode: "contain",
  },
  framesText: {
    color: "#fff",
    fontSize: wp("7%"),
    marginTop: hp("1.5%"),
    marginLeft: wp("6%"),
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  downloadButton: {
    overflow: "hidden",
    alignItems: "center",
    marginTop: hp("2%"),
    marginRight: wp("7%"),
    paddingVertical: 6,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    width: wp("13%"),
  },
  container: {
    flex: 1,
    backgroundColor: "#071c39",
  },
  image: {
    width: wp("37%"),
    height: hp("9%"),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: hp("2%"),
  },
  dateDisplay: {
    color: "#fff",
    fontSize: wp("8%"),
    textAlign: "center",
    marginTop: hp("1.2%"),
  },
  nextButton: {
    paddingLeft: wp("5%"),
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: wp("10%"),
    fontWeight: "bold",
  },
  mediaItem: {
    position: "absolute",
    width: wp("85%"),
    height: hp("40%"),
    marginTop: 20,
    borderRadius: 20,
    left: wp("7.5%"),
  },
  empty: {
    height: hp("42%"),
    width: "100%",
  },
  imageCenter: {
    alignItems: "center",
  },
};

export default Frames;
