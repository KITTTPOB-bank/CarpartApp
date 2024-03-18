import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";

import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "../component/textlanguage";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const TakePhotoSelectScreen = () => {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }

  return (
    <SafeAreaView style={styles.screen}>

      <View style={styles.colContainer}>
        <TouchableOpacity style={styles.rectangle} onPress={() => navigation.navigate("TakePhotoAllCarScreen")}>
          <Image
            style={{ width: 300, height: 200 }}
            source={require("../assets/aaajpg.jpg")}
          ></Image>
          <Text style={styles.btnText}>{i18n.t("takephotocar")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangle2} onPress={() => navigation.navigate("TakePhotoCarPartScreen")}>
          <Image
            style={{ width: 300, height: 200 }}
            source={require("../assets/cccc.jpg")}
          ></Image>
          <Text style={styles.btnText}>{i18n.t("takephotocarpart")}</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    alignItems: 'center'
  },
  txt: {
    fontFamily: "PakkadThin",
    fontSize: 18,
    color: "black",
    marginTop: 20,
    marginLeft: 20,
  },

  colContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: "20%"
  },
  rectangle: {
    height: 200,
    width: 200,
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rectangle2: {
    height: 200,
    width: 200,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 80,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    fontFamily: "PakkadThin",
    textAlign: "center",
    fontSize: 16,
    position: "absolute",
    bottom: -40,
  },
});

export default TakePhotoSelectScreen;
