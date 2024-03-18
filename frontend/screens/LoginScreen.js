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
  Button,
} from "react-native";
import { useFonts } from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import Checkbox from "expo-checkbox";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from '../component/textlanguage'
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const [checkValidPassword, setcheckValidPassword] = useState(false);

  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChecked1, setChecked1] = useState(false);
  const [isChecked2, setChecked2] = useState(false);
  const [isChecked3, setChecked3] = useState(false);
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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

  const handleLogin = async () => {
    AsyncStorage.removeItem('token');

    // หรือตรวจสอบจาก navigation
    if (
      !checkValidEmail &&
      !checkValidPassword &&
      email !== "" &&
      password !== ""
    ) {
      await login(email, password);
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.navigate("PartListDrawerNavigator")
        navigation.navigate("HomeScreen")
      }
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
      <Image
        style={{ width: 200, height: 200 }}
        source={require("../assets/logocar.png")}
      ></Image>

      <Text style={styles.txt}>Carnan</Text>

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
      <Text
        style={styles.textResetPass}
        onPress={() => {
          navigation.navigate("ForgotPassScreen");
        }}
      >
        {i18n.t('forgotpassword')}
      </Text>
      {email == "" ||
        password == "" ||
        checkValidEmail == true ||
        checkValidPassword == true ? (
        <TouchableOpacity
          disabled
          style={styles.btn_disable}
          onPress={handleLogin}
        >
          <View style={styles.btnContent}>
            <Text
              style={{
                fontFamily: "PakkadThin",
                fontSize: 20,
              }}
            >
              {i18n.t('login')}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <View style={styles.btnContent}>
            <Text
              style={{
                fontFamily: "PakkadThin",
                fontSize: 20,
              }}
            >
              {i18n.t('login')}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.textContainer}>
        <Text
          style={{
            fontSize: 14,
            color: "black",
            fontFamily: "PakkadThin",
          }}
        >
          {i18n.t('account')}
        </Text>
        <TouchableOpacity onPress={toggleModal}>
          <Text
            style={{
              color: "#2D58AD",
              fontSize: 16,
              fontFamily: "PakkadThin",
            }}
          >
            &nbsp;&nbsp;{i18n.t('register')}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 12, fontFamily: "PakkadThin", marginTop: 150 }}>
        {i18n.t('version')} 3.0.0
      </Text>

      <View>
        <Modal
          isVisible={isModalVisible}
          style={{
            flex: 1,
            backgroundColor: "white",
            width: 350,
            maxHeight: 600,
            top: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "PakkadThin",
              bottom: 120,
              textDecorationLine: "underline",
            }}
          >
            ข้อกำหนดและเงื่อนไขในการสมัครสมาชิก
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: "PakkadThin",
              bottom: 80,
              textAlign: "center",
            }}
          >
            ผู้ใช้ที่สมัครสมาชิกจะต้องยินยอมข้อกำหนด {"\n"}
            และเงื่อนไขการใช้งานแอปพลิเคชัน Carnan ดังต่อไปนี้
          </Text>
          <View style={styles.CheckboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked1}
              onValueChange={setChecked1}
            />
            <Text style={styles.checkboxLabel}>
              ผู้สมัครต้องกรอกอีเมลตามความเป็นจริง {"\n"}
              เพื่อป้องกันการสูญหายของข้อมูล และรูปภาพ
            </Text>
          </View>

          <View style={styles.CheckboxContainer}>
            <Checkbox
              style={styles.checkbox2}
              value={isChecked2}
              onValueChange={setChecked2}
            />
            <Text style={styles.checkboxLabel2}>
              ผู้สมัครยินยอมที่จะให้แอปพลิเคชัน Carnan {"\n"}
              นำเข้าข้อมูลรูปภาพเพื่อพัฒนาแอปพลิเคชันต่อไป
            </Text>
          </View>

          <View style={styles.CheckboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked3}
              onValueChange={setChecked3}
            />
            <Text style={styles.checkboxLabel}>
              ผู้สมัครยินยอมที่จะให้แอปพลิเคชัน Carnan {"\n"}
              จัดเก็บข้อมูลและเข้าถึงรูปภาพ
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btn2} onPress={toggleModal}>
              <View style={styles.btnContent}>
                <Text style={styles.btnTextCancle}>ยกเลิก</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (isChecked1 && isChecked2 && isChecked3) {
                  toggleModal();
                  navigation.navigate("RegisScreen");
                } else {
                  // ถ้า checkbox ไม่ถูกติ๊กทั้ง 3 ตัว แจ้งเตือนหรือทำอย่างอื่นตามที่คุณต้องการ
                  Alert.alert("กรุณายอมรับข้อกำหนด และเงื่อนไขทั้ง 3 ข้อ");
                }
              }}
              style={styles.btn3}
            >
              <View style={styles.btnContent}>
                <Text style={styles.btnTextAccept}>ยอมรับ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
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
    marginTop: -70,
  },

  circle: {
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 100,
    padding: 10,
  },

  CheckboxContainer: {
    bottom: 40,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 8,
    right: 20,
    width: 25,
    height: 25,
  },

  checkbox2: {
    marginRight: 8,
    right: 10,
    width: 25,
    height: 25,
  },

  checkboxLabel: {
    fontSize: 14,
    fontFamily: "PakkadThin",
  },
  checkboxLabel2: {
    fontSize: 14,
    right: -10,
    fontFamily: "PakkadThin",
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
  textResetPass: {
    fontSize: 14,
    color: "#2D58AD",
    marginLeft: 250,
    top: 20,
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

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn2: {
    borderColor: "#FF0E0E",
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 5,
    height: 40,
    width: 150,
    top: 20,
  },

  btn3: {
    borderColor: "#135431",
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 5,
    height: 40,
    width: 150,
    top: 20,
  },

  btnTextCancle: {
    fontFamily: "PakkadThin",
    textAlign: "center",
    color: "#FF0E0E",
    fontSize: 20,
  },

  btnTextAccept: {
    fontFamily: "PakkadThin",
    textAlign: "center",
    color: "#135431",
    fontSize: 20,
  },
});

export default LoginScreen;
