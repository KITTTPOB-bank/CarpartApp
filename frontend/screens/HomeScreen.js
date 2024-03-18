import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  Animated,
  ImageBackground,
} from "react-native";

import axios from "axios";

import { Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { MyContext } from "../context/MyContext";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "../component/textlanguage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const HomeScreen = () => {
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const { globalValue, setGlobalValue } = useContext(MyContext);
  const { list, setlist } = useContext(MyContext);
  const { globalValue1, setGlobalValue1 } = useContext(MyContext);
  const [cardata, serCardata] = useState([]);
  const [Mycar, serMycar] = useState([]);
  const [Mybill, setMybill] = useState([]);
  const { carcurret, setcarcurret } = useContext(MyContext);

  const isFocused = useIsFocused();

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  const [activeIndex, setActiveIndex] = useState(0);

  //ดึงข้อมูล
  useEffect(() => {
    getdata();
  }, []);
  const gopage = async (id) => {
    if (id == 1) {
      navigation.navigate("TakePhotoSelectScreen");
    } else if (id == 2) {
      navigation.navigate("SearchCarScreen");
    } else if (id == 3) {
      navigation.navigate("ResetPassScreen");
    } else {
      navigation.navigate("AboutScreen");
    }
  };
  const getdata = async () => {
    const token = await AsyncStorage.getItem("token");
    urldata = "http://******:8000/getdatacar";
    urlgetuser = "http://******:8000/getuser";
    const options = {
      params: {
        token: token,
      },
    };
    await axios.get(urldata).then((response) => {
      const car = response.data.sort((item1, item2) => item2.year - item1.year);
      serCardata(car);
    });
    await axios.get(urlgetuser, options).then((response) => {
      serMycar(response.data["getcardata"]);
      setMybill(response.data["getbilldata"]);
    });
  };

  const scrollX = new Animated.Value(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {ShowShotcut.slice(0, 2).map((item, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex ? "#2D58AD" : "#D3D3D3",
                top: -20,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const [isIconBlinking, setIsIconBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsIconBlinking((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setcarcurret("");
    setlist({
      frontbumper: [],
      backbumper: [],
      grille: [],
      headlight: [],
      backlight: [],
      door: [],
      mirror: [],
    });
    if (globalValue1 == true) {
      setGlobalValue1(false);
      setGlobalValue(false);
    }
    getdata();
  }, [isFocused]);

  if (!fontsLoaded) {
    return "";
  }

  const ShowShotcut = [
    {
      id: "1",
      name: i18n.t("photo"),
      image: require("../assets/phonecamera.png"),
    },
    {
      id: "2",
      name: i18n.t("search"),
      image: require("../assets/searchingcar.png"),
    },
    {
      id: "3",
      name: i18n.t("edit"),
      image: require("../assets/useredit.png"),
    },
    {
      id: "4",
      name: i18n.t("about"),
      image: require("../assets/infocar.png"),
    },
  ];

  const renderCarItem = ({ item, index }) => (
    <TouchableOpacity style={styles.rectangle2} onPress={() => gopage(item.id)}>
      <View style={styles.btnContent}>
        <Image
          style={{
            width: 60,
            height: 60,
            marginTop: 10,
            justifyContent: "center",
            alignSelf: "center",
            tintColor: "white",
          }}
          source={item.image}
        />
        <Text style={styles.btnText2}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        style={{
          backgroundColor: "white",
          zIndex: -9999,
        }}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <FlatList
            data={ShowShotcut}
            keyExtractor={(item) => item.id}
            renderItem={renderCarItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={handleScroll}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth
              );
              setActiveIndex(index);
            }}
          />
          {renderDots()}
        </View>

        <View style={styles.rowContainer}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            pagingEnabled
            style={{ backgroundColor: "white" }}
          >
            <TouchableOpacity
              style={{
                height: 150,
                width: 350,
                backgroundColor: "white",
                borderRadius: 20,
                marginTop: 10,
                marginHorizontal: 20,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                marginBottom: 10,
              }}
              onPress={() =>
                navigation.navigate("HelpToggleScreen")
              }
            >
              <ImageBackground
                source={require("../assets/carinformationuse.png")}
                resizeMode="cover"
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              ></ImageBackground>
              <Text style={styles.overlayText}>{i18n.t("howtophotocar")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 150,
                width: 350,
                backgroundColor: "white",
                borderRadius: 20,
                marginTop: 10,
                marginHorizontal: 20,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                marginBottom: 10,
              }}
              onPress={() =>
                navigation.navigate("HelpTogglePartScreen")
              }
            >
              <ImageBackground
                source={require("../assets/partcarinformationuse.png")}
                resizeMode="cover"
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              ></ImageBackground>
              <Text style={styles.overlayText}>{i18n.t("howtophotocarpart")}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <Text style={styles.txt}>{i18n.t("carnow")}</Text>
        <View style={styles.rowContainer}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ backgroundColor: "white" }}
          >
            {cardata.slice(0, 5).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.rectangle}
                onPress={() =>
                  navigation.navigate("ResultPartsScreen", {
                    name: item.name,
                    brand: item.brand,
                    year: item.year,
                    id: item._id,
                  })
                }
              >
                <View style={styles.btnContent}>
                  <Image
                    style={{
                      width: 100,
                      height: 70,
                      marginTop: 10,
                      resizeMode: "cover",
                    }}
                    source={{ uri: item.car_image }}
                  />
                  <Text
                    style={styles.btnText}
                  >{`${item.brand} ${item.name} ${item.year}`}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.txt2}>{i18n.t("carhave")}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("HaveCarScreen")}
          >
            <Text style={styles.txt2_right}>
              {i18n.t("more")} {">"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowContainer}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ backgroundColor: "white" }}
          >
            {Mycar.length > 0 && (
              <>
                {Mycar.slice(0, 3).map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.rectangle}
                    onPress={() =>
                      navigation.navigate("ResultPartsScreen", {
                        name: item.name,
                        brand: item.brand,
                        year: item.year,
                        id: item._id,
                      })
                    }
                  >
                    <View style={styles.btnContent}>
                      <Image
                        style={{
                          width: 100,
                          height: 70,
                          marginTop: 10,
                          resizeMode: "cover",
                        }}
                        source={{ uri: item.car_image }}
                      ></Image>
                      <Text
                        style={styles.btnText}
                      >{`${item.brand} ${item.name} ${item.year}`}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.txt3}>{i18n.t("list")}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("HistoryScreen")}
          >
            <Text style={styles.txt3_right}>
              {i18n.t("more")} {">"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowContainer}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ backgroundColor: "white" }}
          >
            {Mybill.length > 0 && (
              <>
                {Mybill.map((item, index) => (
                  <TouchableOpacity
                    style={styles.rectangle}
                    key={index}
                    onPress={() =>
                      navigation.navigate("CarPartListScreen", {
                        carnmae: item.car_name,
                        bill_id: item._id,
                      })
                    }
                  >
                    <View style={styles.btnContent}>
                      <Image
                        style={{ width: 50, height: 50, marginTop: 25 }}
                        source={require("../assets/bill.png")}
                      ></Image>
                      <Text style={styles.btnText}>{item.car_name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  txt: {
    fontFamily: "PakkadThin",
    fontSize: 18,
    color: "black",
    marginTop: 20,
    marginLeft: 20,
  },

  txt2: {
    fontFamily: "PakkadThin",
    fontSize: 18,
    color: "black",
    marginTop: 40,
    marginLeft: 20,
  },

  txt2_right: {
    fontFamily: "PakkadThin",
    fontSize: 12,
    color: "#5A6199",
    marginTop: 45,
    marginLeft: 220,
    position: "absolute",
  },

  txt3: {
    fontFamily: "PakkadThin",
    fontSize: 18,
    color: "black",
    marginTop: 60,
    marginLeft: 20,
  },

  txt3_right: {
    fontFamily: "PakkadThin",
    fontSize: 12,
    color: "#5A6199",
    marginTop: 65,
    marginLeft: 190,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rectangle: {
    // height: 80,
    // width: 100,
    // backgroundColor: "white",
    // borderRadius: 20,
    // marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    // shadowColor: "black",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 1,
    // marginBottom: 35,
  },

  rectangle2: {
    height: 100,
    width: 150,
    backgroundColor: "#2D58AD",
    borderRadius: 20,
    marginTop: 30,
    marginHorizontal: 15,
    marginBottom: 35,
    marginLeft: 25,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },

  rectangle3: {
    height: 150,
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
    marginHorizontal: 30,
    alignSelf: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    marginBottom: 10,
  },

  txtinside: {
    fontSize: 18,
    color: "black",
    fontFamily: "PakkadThin",
    marginTop: 20,
  },

  btnContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    fontFamily: "PakkadThin",
    textAlign: "center",
    fontSize: 10,
    marginTop: 20,
  },

  btnText2: {
    fontFamily: "PakkadThin",
    textAlign: "center",
    marginTop: 4,
    fontSize: 15,
    color: "white",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D3D3D3",
    marginHorizontal: 5,
  },
  overlayText: {
    color: "white",
    fontSize: 24,
    fontFamily: "PakkadThin",
    textAlign: "center",
    marginTop: "-40%",
  },
});

export default HomeScreen;
