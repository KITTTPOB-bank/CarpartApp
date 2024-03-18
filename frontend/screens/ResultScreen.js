import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";

import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MyContext } from "../context/MyContext";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "../component/textlanguage";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const ResultScreen = ({ route }) => {
  const navigation = useNavigation();
  const { carcurret, setcarcurret } = useContext(MyContext);
  const { globalValue1, setGlobalValue1 } = useContext(MyContext);
  const [carname, setcarname] = useState(null);
  const [probability, setprobability] = useState(null);
  const [carimage, setcarimage] = useState(null);

  useEffect(() => {
    setcarname(route.params.prediction)
    setprobability(route.params.probability)
    setcarimage(route.params.car_image)

  }, [route.params]);

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Image
        style={{ width: "100%", height: "40%", marginBottom: "15%" }}
        source={{ uri: carimage }}
      ></Image>
      <Text style={styles.txt1}>{carname}</Text>
      <Text style={styles.txt2}>{i18n.t("confident")} : {probability} %</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <View style={styles.btnContent}>
            <Text style={styles.btnText}>{i18n.t("back")}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const car = carname
            setGlobalValue1(true), setcarcurret(car),
              navigation.navigate("PartListDrawerNavigator", {
                screen: i18n.t("summary"),
              });
          }}
          style={styles.btn}
        >
          <View style={styles.btnContent}>
            <Text style={styles.btnText}>{i18n.t("seepartlist")}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    marginTop: "30%",
  },

  txt1: {
    fontFamily: "PakkadThin",
    fontSize: 24,
    marginTop: -50,
  },

  txt2: {
    fontFamily: "PakkadThin",
    fontSize: 24,
    marginTop: 30,
  },

  circle: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 5,
    borderRadius: 100,
    padding: 10,
    marginTop: 100,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  btn: {
    flex: 1,
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 5,
    height: 50,
  },

  btnContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    fontFamily: "PakkadThin",
    textAlign: "center",
    color: "black",
    padding: 10,
    fontSize: 20,
  },
});

export default ResultScreen;
