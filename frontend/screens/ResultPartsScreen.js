import React, { useEffect, useState, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";

import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "../component/textlanguage";
import { Ionicons } from "@expo/vector-icons";
import { MyContext } from "../context/MyContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const ResultPartsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [carname, setcarname] = useState(null);
  const { globalValue1, setGlobalValue1 } = useContext(MyContext);
  const { carcurret, setcarcurret } = useContext(MyContext);
  const [Mycar, serMycar] = useState([]);
  const [fav, setFav] = useState(false);
  const [idfav, setIdfav] = useState(null);
  const [requestbrand, setbrand] = useState(null);
  const [requestname, setname] = useState(null);
  const [requestyear, setyear] = useState(null);
  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  useEffect(() => {
    setIdfav(route.params.id);
    if (route.params.carname) {
      setcarname(route.params.carname)
      const [brand, name, year] = route.params.carname.split(" ");
      setbrand(brand)
      setname(name)
      setyear(year)
    }
    else {
      setcarname(
        route.params.brand + " " + route.params.name + " " + route.params.year
      );
      setbrand(route.params.brand)
      setname(route.params.name)
      setyear(route.params.year)
    }
    getdata();
  }, []);

  const getdata = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(token);

    const urlgetuser = `http://******:8000/getuser`;
    const options = {
      params: {
        token: token,
      },
    };
    await axios.get(urlgetuser, options).then((response) => {
      serMycar(response.data["getcardata"]);

      if (response.data["idfav"].includes(route.params.id)) {
        setFav(true);
      }
    });
  };
  const changefav = async () => {
    const token = await AsyncStorage.getItem("token");

    const urlgetuser = `http://******:8000/dropfav`;
    try {
      const options = {
        data: {
          token: token,
          idcar: idfav,
          type: fav ? 0 : 1,
        },
      };

      const response = await axios.post(urlgetuser, options.data);

      if (response.status === 200) {
        setFav(!fav);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  if (!fontsLoaded) {
    return "";
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerTopBar}>
        <View style={styles.row}>
          <Text style={styles.headerTopBarText}>
            {i18n.t("seelist")} : {carname}
          </Text>
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={changefav}>
            <Ionicons
              name={fav ? "star" : "star-outline"}
              size={25}
              color="#FFD700"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer_1}>
        <TouchableOpacity
          style={styles.btn_invis}
          onPress={() =>
            navigation.navigate("SeePartCarList", {
              key: "headlight",
              name: requestname,
              brand: requestbrand,
              year: requestyear,
            })
          }
        >
          <View style={styles.btnContent}>
            <View style={styles.rectangle2}>
              <Image
                style={{ width: 60, height: 60 }}
                source={require("../assets/iconheadlamp.png")}
              ></Image>
              <Text style={styles.btnText}>ไฟหน้า</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            style={styles.btn_invis}
            onPress={() =>
              navigation.navigate("SeePartCarList", {
                key: "backlight",
                name: requestname,
                brand: requestbrand,
                year: requestyear,
              })
            }
          >
            <View style={styles.btnContent}>
              <View style={styles.rectangle2}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={require("../assets/iconbackuplamp.png")}
                ></Image>
                <Text style={styles.btnText}>ไฟท้าย</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btn_invis}
          onPress={() =>
            navigation.navigate("SeePartCarList", {
              key: "mirror",
              name: requestname,
              brand: requestbrand,
              year: requestyear,
            })
          }
        >
          <View style={styles.btnContent}>
            <View style={styles.rectangle2}>
              <Image
                style={{ width: 60, height: 60 }}
                source={require("../assets/iconcarmirror.png")}
              ></Image>
              <Text style={styles.btnText}>กระจกข้าง</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.btn_invis}
          onPress={() =>
            navigation.navigate("SeePartCarList", {
              key: "frontbumper",
              name: requestname,
              brand: requestbrand,
              year: requestyear,
            })
          }
        >
          <View style={styles.btnContent}>
            <View style={styles.rectangle2}>
              <Image
                style={{ width: 60, height: 60 }}
                source={require("../assets/iconfontbumper.png")}
              ></Image>
              <Text style={styles.btnText}>กันชนหน้า</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn_invis}
          onPress={() =>
            navigation.navigate("SeePartCarList", {
              key: "backbumper",
              name: requestname,
              brand: requestbrand,
              year: requestyear,
            })
          }
        >
          <View style={styles.btnContent}>
            <View style={styles.rectangle2}>
              <Image
                style={{ width: 60, height: 60 }}
                source={require("../assets/iconbackbumper.png")}
              ></Image>
              <Text style={styles.btnText}>กันชนหลัง</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            style={styles.btn_invis}
            onPress={() =>
              navigation.navigate("SeePartCarList", {
                key: "grille",
                name: requestname,
                brand: requestbrand,
                year: requestyear,
              })
            }
          >
            <View style={styles.btnContent}>
              <View style={styles.rectangle2}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={require("../assets/icongrille.png")}
                ></Image>
                <Text style={styles.btnText}>กระจังหน้า</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View>
          <TouchableOpacity
            style={styles.btn_invis}
            onPress={() =>
              navigation.navigate("SeePartCarList", {
                key: "door",
                name: requestname,
                brand: requestbrand,
                year: requestyear,
              })
            }
          >
            <View style={styles.btnContent}>
              <View style={styles.rectangle2}>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={require("../assets/icondoor.png")}
                ></Image>
                <Text style={styles.btnText}>ประตู</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn_invis}></TouchableOpacity>

        <TouchableOpacity style={styles.btn_invis}></TouchableOpacity>
      </View>
      <View style={styles.buttoncustomer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <View style={styles.btnContent}>
            <Text style={styles.btnTextbutton}>{i18n.t("back")}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const car = carname;
            console.log(car);
            setGlobalValue1(true),
              setcarcurret(car),
              navigation.navigate("PartListDrawerNavigator", {
                screen: i18n.t("summary"),
              });
          }}
          style={styles.btn}
        >
          <View style={styles.btnContent}>
            <Text style={styles.btnTextbutton}>{i18n.t("createbill")}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  buttonContainer_1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  row: {
    flexDirection: "row",
  },
  btn_invis: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 5,
    height: 80,
    width: 100,
  },
  btnContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  btnTextbutton: {
    fontFamily: "PakkadThin",
    textAlign: "center",
    color: "black",
    fontSize: 17,
  },
  btnText: {
    fontFamily: "PakkadThin",
    textAlign: "center",

    fontSize: 12,
  },
  buttoncustomer: {
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
  headerTopBar: {
    paddingTop: 20,
  },
  headerTopBarText: {
    fontFamily: "PakkadThin",
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
  rectangle2: {
    height: 90,
    width: 100,
    alignItems: "center",
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 20,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
});
export default ResultPartsScreen;
