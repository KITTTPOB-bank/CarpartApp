import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Image,
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from '../component/textlanguage'
import { BASE_URL } from '../config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const ResetPassScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordConfirm] = useState("");
  const [checkValidPassword, setcheckValidPassword] = useState(false);
  const [checkValidConfirmPassword, setcheckValiConfirmPassword] = useState(false);
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isSecureEntryConpass, setIsSecureEntryConpass] = useState(true);

  const handleCheckPassword = (text) => {
    setPassword(text);

    if (text.length <= 6) {
      setcheckValidPassword(true);
    } else {
      setcheckValidPassword(false);
    }
  };

  const handleCheckPasswordConfirm = (text) => {
    setPasswordConfirm(text);

    if (text == password) {
      setcheckValiConfirmPassword(false);
    } else {
      setcheckValiConfirmPassword(true);
    }
  };

  const handleResetPass = async () => {
    if (
      !checkValidPassword &&
      !checkValidConfirmPassword &&
      password !== "" &&
      passwordconfirm !== ""
    ) {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.post("http://******:8000/resetpassword", {
          token: token,
          newpassword: passwordconfirm
        })
        setPassword("")
        setPasswordConfirm("")
        if (response.data.token) {
          AsyncStorage.setItem('token', response.data.token);
          Alert.alert("รหัสผ่านของคุณถูกแก้ไขแล้ว");
        }
      } catch (retryError) {
        Alert.alert("เกิดช้อผิดพลาด");

      }
    }
    else {
      Alert.alert(i18n.t('textalertpass'));
    }
  };

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.txt}>{i18n.t('changepass')} !</Text>
      <View style={styles.textInputContainer}>
        <MaterialIcons
          name="lock"
          size={30}
          color={"black"}
          style={{ marginRight: 15 }}
        />
        <TextInput
          style={styles.block_regis}
          placeholder={i18n.t('newpassword')}
          secureTextEntry={isSecureEntry}
          value={password}
          onChangeText={(text) => handleCheckPassword(text)}
        ></TextInput>
        <TouchableOpacity
          onPress={() => {
            setIsSecureEntry((prev) => !prev);
          }}
        >
          <Ionicons
            name={isSecureEntry ? "md-eye" : "md-eye-off"}
            size={30}
            color={"black"}
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      </View>
      {checkValidPassword ? (
        <Text style={styles.textFailed}>
          {i18n.t('wrongpassword')}
        </Text>
      ) : (
        <Text style={styles.textFailed}></Text>
      )}

      <View style={styles.textInputContainer}>
        <MaterialCommunityIcons
          name="lock-check"
          size={30}
          color={"black"}
          style={{ marginRight: 15 }}
        />
        <TextInput
          style={styles.block_regis}
          placeholder={i18n.t('confirmpassword')}
          secureTextEntry={isSecureEntryConpass}
          value={passwordconfirm}
          onChangeText={(text) => handleCheckPasswordConfirm(text)}
        ></TextInput>
        <TouchableOpacity
          onPress={() => {
            setIsSecureEntryConpass((prev) => !prev);
          }}
        >
          <Ionicons
            name={isSecureEntryConpass ? "md-eye" : "md-eye-off"}
            size={30}
            color={"black"}
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      </View>
      {checkValidConfirmPassword ? (
        <Text style={styles.textFailed}>{i18n.t('wrongconfirmpass')}</Text>
      ) : (
        <Text style={styles.textFailed}></Text>
      )}

      {
        password == "" ||
          passwordconfirm == "" ||
          checkValidPassword == true ||
          checkValidConfirmPassword == true ? (
          <TouchableOpacity
            disabled
            style={styles.btn_disable}
            onPress={handleResetPass}
          >
            <View style={styles.btnContent}>
              <Text
                style={{
                  fontFamily: "PakkadThin",
                  fontSize: 20,
                }}
              >
                {i18n.t('confirm')}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={handleResetPass}>
            <View style={styles.btnContent}>
              <Text
                style={{
                  fontFamily: "PakkadThin",
                  fontSize: 20,
                }}
              >
                {i18n.t('confirm')}
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
    top: -50
  },

  btn: {
    alignSelf: "center",
    borderColor: "black",
    borderWidth: 2,
    width: 250,
    padding: 5,
    marginTop: 50,
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
    marginTop: 30,
    marginBottom: 10,
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
    marginTop: 50,
    borderRadius: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
});

export default ResetPassScreen;
