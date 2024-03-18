import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "../component/textlanguage";
import axios from "axios";
const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [Mybill, setMybill] = useState([]);

  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    const token = await AsyncStorage.getItem('token');
    urlgetuser = "http://******:8000/getuser";

    // urlgetuser = `http://192.168.69.55:8000/getuser`;
    const options = {
      params: {
        token:
          token
      },
    };
    await axios.get(urlgetuser, options).then((response) => {
      setMybill(response.data["getbilldata"]);
    });
  };
  const dropbill = async (id) => {
    const token = await AsyncStorage.getItem('token');
    urlgetuser = `http://******:8000/dropbill`;
    console.log(id)
    await axios.post(urlgetuser, {
      bill_id: id,
      token: token
    })
      .then(function (response) {
        const Bill = Mybill.filter(item => item._id != id);
        console.log(Bill)
        setMybill(Bill)
      })
      .catch(function (error) {
      });
  }

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: "white" }}
    >
      <SafeAreaView style={styles.screen}>
        {
          Mybill.length > 0 && (
            <>
              {Mybill.map((item, index) => (

                <TouchableOpacity style={styles.btn} key={index} onPress={() => navigation.navigate("CarPartListScreen",
                  {
                    carnmae: item.car_name,
                    bill_id: item._id
                  })}
                >
                  <View style={styles.btnContent} >
                    <View style={{ flexDirection: "column" }}>
                      <Text style={styles.btnText1}>{item.car_name}</Text>
                      <Text style={styles.btnText2}>{i18n.t("total")} {item.total_price} {i18n.t("baht")}</Text>
                    </View>
                    <TouchableOpacity onPress={() => dropbill(item._id)}
                    >
                      <Ionicons
                        name="trash"
                        size={35}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

              ))}
            </>
          )}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },

  txt: {
    fontFamily: "PakkadThin",
    fontSize: 30,
    color: "white",
    marginTop: 30,
  },


  btn: {
    flex: 1,
    borderColor: "#2D58AD",
    borderWidth: 2,
    borderRadius: 20,
    marginTop: 20,
    padding: 5,
    width: "90%"

  },
  btnContent: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  btnText1: {
    fontFamily: "PakkadThin",
    fontSize: 14,
  },

  btnText2: {
    fontFamily: "PakkadThin",
    marginTop: 5,
    fontSize: 12,
  },
});

export default HistoryScreen;
