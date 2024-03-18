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
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordConfirm] = useState("");
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const [checkValidPassword, setcheckValidPassword] = useState(false);
  const [checkValidConfirmPassword, setcheckValiConfirmPassword] =
    useState(false);

  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isSecureEntryConpass, setIsSecureEntryConpass] = useState(true);
  const { register } = useContext(AuthContext);

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

  const handleRegister = async () => {
    // AsyncStorage.removeItem('token');

    if (
      !checkValidEmail &&
      !checkValidPassword &&
      !checkValidConfirmPassword &&
      email !== "" &&
      password !== "" &&
      passwordconfirm !== ""
    ) {
      await register(email, password);
      navigation.navigate("PartListDrawerNavigator")
      navigation.navigate("HomeScreen")
    } else {
      Alert.alert("ตรวจสอบอีเมล และ รหัสผ่านของคุณ");
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
      <Text style={styles.txt}>{i18n.t('register')} !</Text>
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
      {checkValidEmail ? (
        <Text style={styles.textFailed}>{i18n.t('wrongemail')}</Text>
      ) : (
        <Text style={styles.textFailed}></Text>
      )}

      <View style={styles.textInputContainer}>
        <MaterialIcons
          name="lock"
          size={30}
          color={"black"}
          style={{ marginRight: 15 }}
        />
        <TextInput
          style={styles.block_regis}
          placeholder={i18n.t('password')}
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

      {email == "" ||
        password == "" ||
        passwordconfirm == "" ||
        checkValidEmail == true ||
        checkValidPassword == true ||
        checkValidConfirmPassword == true ? (
        <TouchableOpacity
          disabled
          style={styles.btn_disable}
          onPress={handleRegister}
        >
          <View style={styles.btnContent}>
            <Text
              style={{
                fontFamily: "PakkadThin",
                fontSize: 20,
              }}
            >
              {i18n.t('register')}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <View style={styles.btnContent}>
            <Text
              style={{
                fontFamily: "PakkadThin",
                fontSize: 20,
              }}
            >
              {i18n.t('register')}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <View style={styles.textContainer}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "PakkadThin",
          }}
        >
          {i18n.t('haveaccount')}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text
            style={{
              color: "#2D58AD",
              fontSize: 16,
              fontFamily: "PakkadThin",
            }}
          >
            &nbsp;&nbsp;{i18n.t('login')}
          </Text>
        </TouchableOpacity>
      </View>
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

export default RegisterScreen;
