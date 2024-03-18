import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import { MyContext } from "../context/MyContext";

import { useFonts } from "expo-font";

import Checkbox from "expo-checkbox";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "../component/textlanguage";
import axios from "axios";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

// import { Dimensions } from "react-native";

const PartListItemScreen = ({ route }) => {
  const [alldata, setalldata] = useState([]);
  const [num, setnum] = useState(1);
  const [data, setdata] = useState([]);
  const [partnames, setpartnames] = useState("กันชนหน้า");
  const { list, setlist } = useContext(MyContext);
  const [isCheckedArray, setIsCheckedArray] = useState(data.map(() => false));
  const { carcurret, setcarcurret } = useContext(MyContext);
  const [isCheckedAll, setCheckedAll] = useState(false);

  useEffect(() => {
    fetchDatapart();
  }, []);

  useEffect(() => {
    if (isCheckedAll) {
      // เมื่อ isCheckedAll เป็น true ให้ทำการติ้กทุกรายการ
      const newIsCheckedArray = data.reduce((acc, item) => {
        acc[item._id] = true;
        return acc;
      }, []);
      setIsCheckedArray(newIsCheckedArray);

      setlist((prevList) => {
        const updatedList = { ...prevList };
        updatedList[route.params.key] = data.map((item) => {
          let partName = "";
          switch (route.params.key) {
            case "frontbumper":
              partName = i18n.t("frontbumper");
              break;
            case "backbumper":
              partName = i18n.t("rearbumper");
              break;
            case "grille":
              partName = i18n.t("grille");
              break;
            case "headlight":
              partName = i18n.t("headlamp");
              break;
            case "backlight":
              partName = i18n.t("backuplamp");
              break;
            case "door":
              partName = i18n.t("door");
              break;
            case "mirror":
              partName = i18n.t("mirror");
              break;
            default:
              break;
          }
          return { ...item, item: partName };
        });
        return updatedList;
      });
    }
  }, [isCheckedAll]);

  const fetchDatapart = async () => {
    const [requestbrand, requestname, requestyear] = carcurret.split(" ");
    const apiUrl = "http://******:8000/carpartsearch";

    const queryParams = {
      brand: requestbrand,
      name: requestname,
      year: requestyear,
    };
    const response = await axios.get(apiUrl, {
      params: queryParams,
    });
    setalldata(response.data);
  };

  useEffect(() => {
    if (route.params && route.params.key === "frontbumper") {
      const data = alldata["frontbumper"];
      if (data) {
        for (item in data) {
          item["isChecked"] = false;
        }
        setdata(data);
        setpartnames(i18n.t("frontbumper"));
      }
    } else if (route.params.key === "backbumper") {
      const data = alldata["rearbumper"];
      if (data) {
        for (item in data) {
          item["isChecked"] = false;
        }
        setdata(data);
        setpartnames(i18n.t("rearbumper"));
      }
    } else if (route.params.key === "grille") {
      const data = alldata["grille"];
      if (data) {
        for (item in data) {
          item["isChecked"] = false;
        }
        setdata(data);
        setpartnames(i18n.t("grille"));
      }
    } else if (route.params.key === "headlight") {
      const data = alldata["headlamp"];
      if (data) {
        for (item in data) {
          item["isChecked"] = false;
        }
        setdata(data);
        setpartnames(i18n.t("headlamp"));
      }
    } else if (route.params.key === "backlight") {
      const data = alldata["backuplamp"];
      if (data) {
        for (item in data) {
          item["isChecked"] = false;
        }
        setdata(data);
        setpartnames(i18n.t("backuplamp"));
      }
    } else if (route.params.key === "door") {
      const data = alldata["door"];
      if (data) {
        for (item in data) {
          item["isChecked"] = false;
        }
        setdata(data);
        setpartnames(i18n.t("door"));
      }
    } else if (route.params.key === "mirror") {
      const data = alldata["mirror"];
      if (data) {
        for (item in data) {
          item["isChecked"] = false;
        }
        setdata(data);
        setpartnames(i18n.t("mirror"));
      }
    }
  }, [route.params, alldata]);

  const backpage = async () => {
    if (num > 1) {
      const go = num;
      setnum(go - 1);
    }
  };
  const gopage = async () => {
    if (num < data.length / 8) {
      const go = num;
      setnum(go + 1);
    }
  };

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }

  const renderItem = ({ item, index }) => {
    const priceText =
      item.price === 0 ? i18n.t("notsale") : item.price.toFixed(2).toString();
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.code}</Text>
        <Text style={styles.cellWithPadding2}>{item.name}</Text>
        <Text style={styles.cellWithPadding3}>{priceText}</Text>
        <Checkbox
          style={{ marginLeft: -20, left: -20 }}
          value={isCheckedArray[item._id]}
          onValueChange={(newValue) => {
            setlist((prevList) => {
              setCheckedAll(false)
              const updatedList = { ...prevList };
              updatedList[route.params.key] =
                updatedList[route.params.key] || [];
              const existingItemIndex = updatedList[route.params.key].findIndex(
                (existingItem) => existingItem._id === item._id
              );
              if (existingItemIndex !== -1) {
                updatedList[route.params.key].splice(existingItemIndex, 1);
              } else {
                let data = "";
                if (route.params.key === "frontbumper") {
                  data = i18n.t("frontbumper");
                } else if (route.params.key === "backbumper") {
                  data = i18n.t("rearbumper");
                } else if (route.params.key === "grille") {
                  data = i18n.t("grille");
                } else if (route.params.key === "headlight") {
                  data = i18n.t("headlamp");
                } else if (route.params.key === "backlight") {
                  data = i18n.t("backuplamp");
                } else if (route.params.key === "door") {
                  data = i18n.t("door");
                } else if (route.params.key === "mirror") {
                  data = i18n.t("mirror");
                }
                const newItem = { ...item, item: data };
                updatedList[route.params.key].push(newItem);
              }

              return updatedList;
            });
            const newIsCheckedArray = [...isCheckedArray];
            newIsCheckedArray[item._id] = newValue;
            setIsCheckedArray(newIsCheckedArray);
          }}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerTopBar}>
        <Text style={styles.headerTopBarText}>
          {carcurret} : {partnames} ทั้งชุด
          กรุณาเลือกชิ้นส่วนที่ลูกค้าต้องการ
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.heading}>{i18n.t("code")}</Text>
        <Text style={styles.headingPadding}>{i18n.t("name")}</Text>
        <Text style={styles.headingPadding}>{i18n.t("price")}</Text>
        <Text style={styles.headingPadding2}>{i18n.t("choose")}</Text>
      </View>
      <FlatList
        data={data.slice(8 * (num - 1), 8 * num)}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <View style={{ marginTop: 20 }}>
            <View style={styles.CheckboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={isCheckedAll}
                onValueChange={setCheckedAll}
              />
            </View>
            <Text style={{ top: -40, left: 300, fontFamily: "PakkadThin", fontSize: 16 }}>เลือกทั้งหมด</Text>
            <View style={styles.chevronContainer}>
              <TouchableOpacity>
                <Entypo
                  name="chevron-small-left"
                  size={30}
                  color="black"
                  style={styles.chevronLeft}
                  onPress={backpage}
                />
              </TouchableOpacity>
              <Text style={{ top: 5 }}>{num}</Text>
              <TouchableOpacity>
                <Entypo
                  name="chevron-small-right"
                  size={30}
                  color="black"
                  onPress={gopage}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      ></FlatList>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },

  headerTopBar: {
    paddingVertical: 10,
    marginBottom: 15,
  },
  headerTopBarText: {
    fontFamily: "PakkadThin",
    fontSize: 18,
    color: "black",
    textAlign: "left",
    left: 10,
    top: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderColor: "black",
    borderBottomWidth: 1,
  },
  heading: {
    fontFamily: "PakkadThin",
    fontSize: 16,
    color: "black",
    flex: 1,
  },
  headingPadding: {
    fontFamily: "PakkadThin",
    fontSize: 16,
    color: "black",
    flex: 1,
    paddingLeft: 25,
  },

  headingPadding2: {
    fontFamily: "PakkadThin",
    fontSize: 16,
    color: "black",
    flex: 1,
    left: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 2,
    marginVertical: 10,
    borderRadius: 1,
    borderColor: "black",
    padding: 10,
    borderBottomWidth: 1,
  },
  cell: {
    fontSize: 10,
    fontFamily: "PakkadThin",
    flex: 1,
  },
  cellWithPadding: {
    fontSize: 10,
    fontFamily: "PakkadThin",
    flex: 1,
    paddingLeft: 25,
  },
  cellWithPadding2: {
    fontSize: 10,
    fontFamily: "PakkadThin",
    flex: 1,
    right: 15,
  },
  cellWithPadding3: {
    fontSize: 10,
    fontFamily: "PakkadThin",
    flex: 1,
    right: 15,
  },
  chevronContainer: {
    flexDirection: "row",
    left: 300,
    top: -20,
  },
  CheckboxContainer: {
    bottom: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    right: -270,
    bottom: -30,
    width: 20,
    height: 20,
  },
});

export default PartListItemScreen;
