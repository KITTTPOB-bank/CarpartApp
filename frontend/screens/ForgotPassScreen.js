import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,

} from "react-native";
import { useFonts } from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from '../component/textlanguage'
import axios from "axios";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const ForgotPassScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [checkValidEmail, setCheckValidEmail] = useState(false);

  const handleCheckEmail = (text) => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    setEmail(text);
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false);
    } else {
      setCheckValidEmail(true);
    }
  };

  const handleForgotPass = async () => {
    console.log(email)
    if (!checkValidEmail && email !== "") {
      try {
        const response = await axios.post("http://******:8000/forgotpassword", {
          email: email
        })
        setEmail("")
        Alert.alert(response.data.alert);
      } catch (retryError) {
        Alert.alert("อีเมลล์ของคุณไม่ถูกต้อง");
      }
    }
    else {
      Alert.alert("กรุณาตรวจสอบอีเมลของคุณ");

    }
  }
  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.txt}>{i18n.t('forgotpassword')} ?</Text>
      <View style={styles.textInputContainer}>
        <MaterialIcons
          name="email"
          size={30}
          color={"black"}
          style={{ marginRight: 15 }}
        />
        <TextInput
          style={styles.block_regis}
          placeholder={i18n.t('email')}
          value={email}
          onChangeText={(text) => handleCheckEmail(text)}
        ></TextInput>
      </View>
      <Text
        style={styles.textLogin}
        onPress={() => {
          navigation.navigate("LoginScreen");
        }}
      >
        {i18n.t('login')}
      </Text>

      {email == "" || checkValidEmail == true ? (
        <TouchableOpacity
          disabled
          style={styles.btn_disable}
          onPress={handleForgotPass}
        >
          <View style={styles.btnContent}>
            <Text
              style={{
                fontFamily: "PakkadThin",
                fontSize: 20,
              }}
            >
              {i18n.t('resetpassword')}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleForgotPass}>
          <View style={styles.btnContent}>
            <Text
              style={{
                fontFamily: "PakkadThin",
                fontSize: 20,
              }}
            >
              รีเซ็ตรหัสผ่าน
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  txt: {
    fontFamily: "PakkadThin",
    fontSize: 30,
    bottom: 100,
  },

  btn: {
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 2,
    width: 250,
    padding: 5,
    marginTop: 80,
    borderRadius: 10,
  },

  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    width: 350,
    bottom: 20,
    height: 45,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },

  block_regis: {
    flex: 1,
    fontSize: 18,
    fontFamily: "PakkadThin",
    color: "black",
  },
  textFailed: {
    fontSize: 14,
    color: "#FF0000",
    fontFamily: "PakkadThin",
  },
  btn_disable: {
    alignSelf: "center",
    width: 250,
    padding: 5,
    backgroundColor: "gray",
    marginTop: 80,
    borderRadius: 10,
  },
  textLogin: {
    fontSize: 14,
    color: "#2D58AD",
    marginLeft: 250,
    fontFamily: "PakkadThin",
  },
});

export default ForgotPassScreen;
