import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { StackActions, useNavigation } from "@react-navigation/native";
import {
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  BackHandler,
  Share,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  PermissionsAndroid,
  TouchableWithoutFeedback,
} from "react-native";
import Toast from "react-native-toast-message";
import { View, Text } from "../components/Themed";
import { useStateContext } from "./Context/ContextProvider";
import axios from "axios";
import { baseUrl, header } from "../utils";

import moment from "moment";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
const wid = Dimensions.get("window").width;
const high = Dimensions.get("window").height;

export default function EditProfile(props: any) {
  const { userDetail, userImage, setUserDetail, access_token } =
    useStateContext();
  const navigation = useNavigation();
  const [currUserDetail, setcurrUserDetail] = useState<any>();
  const [surName, setSurName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resourcePath, setresourcePath] = useState("");
  const [hasGalleryPermission, setHasGalleryPermission] =
    useState<boolean>(false);
  const [image, setImgae] = useState<String>("");
  let header: any = {
    "Content-Type": "multipart/form-data",
    "Abp-TenantId": "1",
    Authorization: `Bearer ${access_token}`,
  };
  const [cameraPhoto, setCameraPhoto] = useState();
  const [galleryPhoto, setGalleryPhoto] = useState();

  const uploadImage = async (file: any) => {
    var data = new FormData();
    data.append("file", file.uri);
    console.log();

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://13.126.218.96/api/services/app/CommonService/UploadImage",
      headers: header,
      data: data,
    };

    axios(config)
      .then(function (response: any) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };
  // let options: any = {
  //   saveToPhotos: true,
  //   mediaType: "photo",
  // };
  const getImageFromLibrary = async () => {
    try {
      const grantedcamera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      const grantedstorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (
        grantedcamera === PermissionsAndroid.RESULTS.GRANTED &&
        grantedstorage === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("Camera & storage permission given");

        var options: any = {
          mediaType: "photo", //to allow only photo to select ...no video
          saveToPhotos: true, //to store captured photo via camera to photos or else it will be stored in temp folders and will get deleted on temp clear
          includeBase64: false,
        };

        launchImageLibrary(options, (res: any) => {
          console.log("Response = ", res);

          if (res.didCancel) {
            console.log("User cancelled image picker");
          } else if (res.error) {
            console.log("ImagePicker Error: ", res.error);
          } else if (res.customButton) {
            console.log("User tapped custom button: ", res.customButton);
            alert(res.customButton);
          } else {
            // let source = res;
            // var resourcePath1 = source.assets[0].uri;
            const source = { uri: res.uri };
            // console.log("response", JSON.stringify(res.assets));
            console.log("response", JSON.stringify(res));
            console.log("flasdjflasdf;lasdhf", res.assets[0].uri);

            setImgae(res.assets[0].uri);
            uploadImage(res.assets[0]);

            //             Content-Disposition: form-data; name="file"; filename="MicrosoftTeams-image.png"
            // Content-Type: image/png
          }
        });
      } else {
        console.log("Camera permission denied");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const launchCameraa = async () => {
    const grantedcamera = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "App Camera Permission",
        message: "App needs access to your camera ",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    const grantedstorage = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "App Camera Permission",
        message: "App needs access to your camera ",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (
      grantedcamera === PermissionsAndroid.RESULTS.GRANTED &&
      grantedstorage === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log("Camera & storage permission given");

      var options: any = {
        mediaType: "photo", //to allow only photo to select ...no video
        saveToPhotos: true, //to store captured photo via camera to photos or else it will be stored in temp folders and will get deleted on temp clear
        includeBase64: false,
      };

      launchCamera(options, (res: any) => {
        console.log("Response = ", res);

        if (res.didCancel) {
          console.log("User cancelled image picker");
        } else if (res.error) {
          console.log("ImagePicker Error: ", res.error);
        } else if (res.customButton) {
          console.log("User tapped custom button: ", res.customButton);
          alert(res.customButton);
        } else {
          // let source = res;
          // var resourcePath1 = source.assets[0].uri;
          const source = { uri: res.uri };
          console.log("response", JSON.stringify(res));
          console.log("flasdjflasdf;lasdhf", res.assets);
          setImgae(res.assets[0].uri);
        }
      });
    } else {
      console.log("Camera permission denied");
    }
  };

  // const launchCameraa = async () => {
  //   let options: any = {
  //     maxWidth: wid,
  //     maxHeight: high / 2,
  //     storageOptions: {
  //       skipBackup: true,
  //       path: "images",
  //     },
  //   };
  //   const result = await launchCamera(options);
  //   console.log(result);
  // };
  // const openCamera = async () => {
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.CAMERA
  //   );
  //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     const result: any = await launchCamera(options);
  //     setCameraPhoto(result.assets[0].uri);
  //   }
  // };

  // const openGallery = async () => {
  //   const result: any = await launchImageLibrary(options);
  //   setGalleryPhoto(result.assets[0].uri);
  // };

  const save = async () => {
    Toast.show({
      type: "success",
      text1: "Saved",
      position: "top",
    });
    let data: any = JSON.stringify({
      id: currUserDetail.id,
      userName: phoneNumber,
      name: name,
      gender: currUserDetail.gender,
      phoneNumber: null,
      pofileImage: currUserDetail.pofileImage,
      surname: surName,
      emailAddress: email,
      isActive: true,
      fullName: currUserDetail.fullName,
      creationTime: moment(),
      roleNames: ["STUDENT"],
    });
    try {
      const res = await axios.put(
        `${baseUrl}/api/services/app/User/Update`,
        data,
        {
          headers: header,
        }
      );

      Toast.show({
        type: "success",
        text1: "Saved",
        position: "top",
      });
      setUserDetail({
        name: name,
        surname: surName,
        userName: phoneNumber,
        emailAddress: email,
        id: userDetail.id,
      });
      console.log(res);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Please Enter Correct Details!!!",
        position: "top",
      });
    }
  };
  useEffect(() => {
    const backbuttonHander = () => {
      navigation.navigate("ProfilePage");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", backbuttonHander);
  });
  const checkValidation = () => {
    let PhoneNoRegex = new RegExp(/(0|91)?[6-9][0-9]{9}/);

    if (name == "") {
      Toast.show({
        type: "info",
        text1: "Please Enter Name",
        position: "top",
      });
    } else if (surName == "") {
      Toast.show({
        type: "info",
        text1: "Please Enter Surname",
        position: "top",
      });
    } else if (
      !PhoneNoRegex.test(phoneNumber) ||
      phoneNumber == "" ||
      phoneNumber.length != 10
    ) {
      if (!PhoneNoRegex.test(phoneNumber)) {
        Toast.show({
          type: "info",
          text1: "Please Enter Correct PhoneNo",
          position: "top",
        });
      } else
        Toast.show({
          type: "info",
          text1: "Enter 10 digit PhoneNo",
          position: "top",
        });
    } else if (email == "" || !email.includes("@")) {
      Toast.show({
        type: "info",
        text1: "Please Enter Correct Email",
        position: "top",
      });
    } else {
      save();
    }
  };

  const getcurrUserDeatail = async () => {
    try {
      const {
        data: { result },
      } = await axios.get(
        `${baseUrl}/api/services/app/User/Get?Id=${userDetail.id}`,
        { headers: header }
      );
      console.log(result);
      setcurrUserDetail(result);
      setPhoneNumber(result.userName);
      setEmail(result.emailAddress);
      setName(result.name);
      setSurName(result.surname);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getcurrUserDeatail();
  }, []);
  console.log(image);
  return (
    <ScrollView style={{ backgroundColor: "#FFF", flex: 1 }}>
      <ImageBackground
        style={{ paddingVertical: high / 30 }}
        imageStyle={{}}
        source={require("../assets/images/bgBig.png")}
      >
        <Toast position="top" topOffset={20} />
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 20,
            textAlign: "center",
            fontFamily: "Poppins-Bold",
            color: "white",
          }}
        >
          Edit Profile
        </Text>
        <View
          style={{
            width: wid,
            backgroundColor: "transparent",
          }}
        >
          {/* {image && (
            <Image
              // source={require("../assets/images/profile.png")}
              source={{ uri: image ?? "" }}
              style={{
                marginTop: high / 30,
                alignSelf: "center",
                borderRadius: 18,
                width: wid / 4.5,
                height: wid / 4.5,
              }}
            />
          )} */}
          {userImage && !image ? (
            <Image
              // source={require("../assets/images/profile.png")}
              source={{ uri: userImage }}
              style={{
                marginTop: high / 30,
                alignSelf: "center",
                borderRadius: 18,
                width: wid / 4.5,
                height: wid / 4.5,
              }}
            />
          ) : (
            <Image
              source={
                image ? { uri: image } : require("../assets/images/profile.png")
              }
              style={{
                alignSelf: "center",
                marginTop: high / 30,
                borderRadius: 18,
                width: wid / 4.5,
                height: wid / 4.5,
              }}
            />
          )}
          <Text
            allowFontScaling={false}
            style={{
              marginTop: high / 30,
              alignSelf: "center",
              color: "white",
              fontFamily: "Poppins-Regular",
              fontSize: 15,
            }}
          >
            Do not disturb, doing a study right now.
          </Text>
          <TouchableOpacity
            onPress={() => getImageFromLibrary()}
            style={{
              justifyContent: "center",
              backgroundColor: "#2C384C",
              marginTop: high / 50,
              width: wid / 3,
              height: high / 21.35,
              borderRadius: 114,
              alignSelf: "center",
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: "center",
                color: "white",
                fontFamily: "Poppins-Regular",
                fontSize: 15,
              }}
            >
              Edit Image
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formContainer}>
          <Text style={styles.textColor}>Edit Profile </Text>
          <TextInput
            value={name}
            placeholder="Enter Name"
            style={styles.textInput}
            onChangeText={(data: any) => setName(data)}
          />
          <TextInput
            placeholder="Enter SurName"
            value={surName}
            style={styles.textInput}
            onChangeText={(data: any) => setSurName(data)}
          />
          <TextInput
            placeholder="Enter Phone No"
            value={phoneNumber}
            textContentType="telephoneNumber"
            keyboardType="number-pad"
            style={styles.textInput}
            onChangeText={(data: any) => setPhoneNumber(data)}
          />
          <TextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={() => {
              checkValidation();
            }}
            style={{
              width: wid / 2.258,
              height: high / 17.08,
              backgroundColor: "#319EAE",
              borderRadius: 26,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginTop: high / 20,
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 18,
                color: "white",
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>

      {/* </ScrollView> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  formContainer: {
    justifyContent: "center",
    paddingHorizontal: wid / 10,
    paddingVertical: high / 60,
  },
  textColor: {
    fontSize: 20,
    textAlign: "left",
    color: "#959595",
    fontFamily: "Poppins-Medium",
  },

  inner: {
    // height: high / 1.9,
    justifyContent: "space-around",
    backgroundColor: "pink",
  },
  textInput: {
    marginTop: high / 60,
    borderWidth: 1,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
    borderColor: "#DBDBDB",
    alignSelf: "center",
    paddingHorizontal: wid / 30,
    width: wid / 1.25,
    flexDirection: "row",
    borderRadius: 5,
    justifyContent: "center",
    height: high / 16.35,
  },
});
