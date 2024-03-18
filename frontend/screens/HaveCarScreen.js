import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";

import { useFonts } from "expo-font";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from '../component/textlanguage'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;
const HaveCarScreen = () => {
  const navigation = useNavigation();
  const [cardata, serCardata] = useState([]);
  const [cardataseach, sercardataseach] = useState([]);
  const [searchtext, serSearchtext] = useState("");
  const isFocused = useIsFocused();

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  useEffect(() => {
    getdata()
  }, []);
  useEffect(() => {
    getdata()
  }, [isFocused]);

  const getdata = async () => {
    const token = await AsyncStorage.getItem('token');
    urlgetuser = `http://******:8000/getuser`;
    const options = {
      params: {
        token:
          token
      },
    };
    await axios.get(urlgetuser, options).then((response) => {
      const newData = response.data["getcardata"].map(item => ({
        _id: item._id,
        carname: `${item.brand} ${item.name} ${item.year}`,
        car_image: item.car_image
      }));
      serCardata(newData)
      sercardataseach(newData)
    })
  }
  useEffect(() => {
    const orilginaldata = cardata
    const filtered = cardata.filter(val => val.carname.toLowerCase().includes(searchtext.toLowerCase()));
    if (searchtext == "") {
      sercardataseach(orilginaldata)
    }
    else {
      sercardataseach(filtered)
    }
  }, [searchtext])


  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: "white" }}
    >
      <SafeAreaView style={styles.screen}>
        <View style={styles.container_search}>
          <AntDesign
            name="search1"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            placeholder={i18n.t('search')}
            clearButtonMode="always"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={newText => serSearchtext(newText)}
            style={styles.textInput}
          />
        </View>
        <View style={styles.ws}>
          {cardataseach.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.rectangle}
              onPress={() => navigation.navigate("ResultPartsScreen", {
                name: item.name,
                brand: item.brand,
                year: item.year
              })}            >
              <View style={styles.btnContent}>
                <Image
                  style={{ width: 100, height: 70, marginTop: 10, resizeMode: 'cover' }}
                  source={{ uri: item.car_image }}
                />
                <Text style={styles.btnText}>{`${item.carname}`}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  ws: {
    marginHorizontal: "auto",
    width: 400,
    flexDirection: "row",
    flexWrap: "wrap"
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rectangle: {
    height: 100,
    width: 150,
    marginTop: 20,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: "PakkadThin",
    textAlign: "center",
    fontSize: 12,
    position: "absolute",
    bottom: -30,
  },

  container_search: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2D58AD",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    width: 250,
    height: 40,
  },
  icon: {
    left: 10,
    position: "absolute",
  },
  textInput: {
    flex: 1,
    marginLeft: 40,
    fontFamily: "PakkadThin",
  },
});
export default HaveCarScreen;
