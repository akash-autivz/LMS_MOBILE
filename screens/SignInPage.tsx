import React, { useState, useEffect } from "react";
import { Dimensions, ScrollView } from "react-native";
import { StackActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import { View, Text } from "../components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { baseUrl } from "../utils";
import { useStateContext } from "./Context/ContextProvider";

const wid = Dimensions.get("window").width;
const high = Dimensions.get("window").height;
const save = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};
export default function SignInPage(props: any) {
  const { setAccess_token } = useStateContext();
  const navigation = useNavigation();
  const [userMailId, setUserMailId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const rememberClient = false;
  const [data1, setData] = useState("");
  const [isTyping, setisTyping] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    setUserMailId("");
    setUserPassword("");
  }, []);

  const result = async () => {
    var data = JSON.stringify({
      userNameOrEmailAddress: userMailId,
      password: userPassword,
      rememberClient: false,
    });

    var config = {
      method: "post",
      url: `${baseUrl}/api/TokenAuth/Authenticate`,
      headers: {
        "Content-Type": "application/json",
        "Abp-TenantId": "1",
      },
      data: data,
    };

    axios(config)
      .then((res: any) => {
        setData(res.data.result.accessToken);
        SecureStore.setItemAsync("userId1", `${res.data.result.userId}`);
        console.log("signInSucecesFull", res);
        if (data1 != null) {
          setAccess_token(res.data.result.accessToken);
          save("user_id", `${res.data.result.userId}`);
          save("access_token", `${res.data.result.accessToken}`);
          navigation.dispatch(StackActions.replace("Root"));
        } else {
          Alert.alert("Invalid credentials", "Incorrect Email or Password", [
            { text: "Okay" },
          ]);
          setUserMailId("");
          setUserPassword("");
        }
      })
      .catch((error: any) => {
        console.log(error);
        // navigation.navigate();
        Alert.alert("Login Failed", error.response.data.error.details, [
          { text: "Okay" },
        ]);
        // if(error.response.data.)
        // setUserMailId("");
        // setUserPassword("");
      });
    // Toast.show({
    //   type: "info",
    //   text1: "Please Enter Correct PhoneNo",
    //   position: "bottom",
    // });
  };
  const toggleFocus = () => {
    setFocused((prev: any) => !prev);
  };
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setisTyping(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setisTyping(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        imageStyle={{
          resizeMode: "cover",
          height: high / 2,
        }}
        style={styles.ImageBackground}
        source={require("../assets/images/bgBig.png")}
      ></ImageBackground>

      <View
        style={{
          alignItems: "center",
          flexDirection: "column",

          backgroundColor: "transparent",
        }}
      >
        <View style={{ backgroundColor: "transparent" }}>
          <Toast position="bottom" />
          <Image
            source={require("../assets/images/sampleImage.png")}
            style={{
              marginTop: isTyping == true ? -high / 18 : high / 20,
              alignSelf: "center",
              borderRadius: 18,
            }}
          ></Image>
        </View>
        <View
          style={{
            width: wid,
            backgroundColor: "#FFFFFF",
            height: high / 1.4,
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              paddingVertical: high / 30,
              marginBottom: high / 90,
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 32,
                color: "#1E2E46",
                fontFamily: "Poppins-Bold",
                left: wid / 12.8,
              }}
            >
              Sign In
            </Text>
          </View>
          <View
            style={{
              marginTop: -20,
              height: high / 9.5,
              justifyContent: "space-between",
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 18,
                alignSelf: "flex-start",
                left: wid / 9.8,
                color: "#929292",
              }}
            >
              Email
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#DBDBDB",
                width: "80%",
                borderRadius: 5,
                alignSelf: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: high / 16.35,
              }}
            >
              <TextInput
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 18,
                  left: wid / 76.8,
                  textAlignVertical: "center",
                }}
                value={userMailId}
                autoCapitalize="none"
                placeholder="Enter Your Email"
                onChangeText={(e) => setUserMailId(e)}
              />
            </View>
          </View>

          {/* <Text
            allowFontScaling={false}
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: 18,
              top: high / 7,
              alignSelf: "flex-start",
              left: wid / 9.8,
              color: "#929292",
            }}
          >
            Password
          </Text> */}
          <View
            style={{
              marginTop: high / 50,
              height: high / 9.5,
              justifyContent: "space-between",
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 18,

                alignSelf: "flex-start",
                left: wid / 9.8,
                color: "#929292",
              }}
            >
              Password
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#DBDBDB",

                width: "80%",
                alignSelf: "center",
                // left: wid/12.8,
                flexDirection: "row",
                borderRadius: 5,
                justifyContent: "center",
                height: high / 16.35,
              }}
            >
              <TextInput
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 18,
                  marginRight: 20,
                  width: "80%",
                  textAlignVertical: "center",
                }}
                value={userPassword}
                secureTextEntry={!focused}
                autoCapitalize="none"
                placeholder="Enter Your Password"
                onChangeText={(e) => setUserPassword(e)}
              />
              <FontAwesome
                onPress={toggleFocus}
                name="eye-slash"
                size={20}
                style={{ color: "#D0D0D0", alignSelf: "center" }}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: high / 30,
              width: "40%",
              left: wid / 9.8,
              height: 20,
              backgroundColor: "transparent",
            }}
          >
            <TouchableOpacity
              style={{}}
              onPress={() => navigation.navigate("reset")}
            >
              <Text allowFontScaling={false} style={{ color: "#309EAF" }}>
                Forget Password
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "80%",
              alignSelf: "center",
              flexDirection: "column",
              marginTop: high / 50,
              height: high / 21.35,
              justifyContent: "center",

              alignItems: "center",
              alignContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <TouchableOpacity
              onPress={result}
              style={{
                width: "80%",
                flexDirection: "row",
                height: high / 17,

                marginTop: high / 20,
                backgroundColor: "#1E2E46",
                alignSelf: "center",
                borderRadius: 14,
                justifyContent: "center",
              }}
            >
              <Text allowFontScaling={false} style={styles.BottomText}>
                Sign In
              </Text>
              <FontAwesome
                name="long-arrow-right"
                color={"white"}
                style={{ alignSelf: "center", left: wid / 38.4 }}
              ></FontAwesome>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: high / 80, flexDirection: "row" }}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text>Don’t have an account yet ? </Text>
              <Text allowFontScaling={false} style={{ color: "#309EAF" }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* </ImageBackground> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFB",
    height: high,
    width: wid,
    flex: 1,
  },
  ImageBackground: {
    width: "100%",
    position: "absolute",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },

  image: {},
  BottomText: {
    fontFamily: "Poppins-Regular",
    alignSelf: "center",
    color: "white",
    fontSize: 16,
  },
});
