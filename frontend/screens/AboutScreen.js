import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { useFonts } from "expo-font";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from '../component/textlanguage'

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const AboutScreen = () => {
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
      <SafeAreaView style={styles.aboutContainer}>
        <View style={styles.aboutLayout}>
          <Text style={[styles.paraStyle, styles.aboutPara]}>
            {i18n.t("detail")}
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    display: "flex",
    alignItems: "center",
  },
  paraStyle: {
    fontSize: 16,
    color: "#7d7d7d",
    paddingBottom: 30,
  },
  aboutLayout: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  aboutPara: {
    color: "black",
  },
});

export default AboutScreen;
