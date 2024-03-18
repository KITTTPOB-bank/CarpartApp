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
  Alert,
} from "react-native";

import { Entypo } from "@expo/vector-icons";

import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { MyContext } from "../context/MyContext";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "../component/textlanguage";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;
// import { Dimensions } from "react-native";

const data = [
  {
    _id: "x",
    part_no: "",
    name: "",
    price: "x",
    item: "",
  },
  {
    _id: 2,
    part_no: "",
    name: "",
    price: "x",
    item: "",
  },
  {
    _id: 3,
    part_no: "",
    name: "",
    price: "x",
    item: "",
  },
];

const PartList = () => {
  const { list, setlist } = useContext(MyContext);
  const [combinedLists, setcombinedList] = useState([]);
  const navigation = useNavigation();
  const [num, setnum] = useState(1);
  const { carcurret, setcarcurret } = useContext(MyContext);

  useEffect(() => {

    const combinedData = [].concat(...Object.values(list));

    const updatedData = combinedData.map((item, index) => ({
      ...item,
      _id: index + 1,
    }));

    if (updatedData.length == 0) {
      setcombinedList(data);
    } else {
      setcombinedList(updatedData);
    }
  }, [list]);

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }
  const gonext = async () => {
    if (combinedLists[0]._id == "x") {
      Alert.alert("กรุณาเพิ่มข้อมูลอะไหล่อย่างน้อย 1 รายการ");
    } else {
      navigation.navigate("CreateHistoryScreen", {
        combinedLists: combinedLists,
      });
    }
  };
  const backpage = async () => {
    if (num > 1) {
      const go = num;
      setnum(go - 1);
    }
  };
  const gopage = async () => {
    if (num < combinedLists.length / 7) {
      const go = num;
      setnum(go + 1);
    }
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.code}</Text>
        <Text style={styles.cellWithPadding}>{item.name}</Text>
        {item.price == "x" && <Text style={styles.cellWithPadding}></Text>}
        {item.price == 0 && (
          <Text style={styles.cellWithPadding}>{i18n.t("notsale")}</Text>
        )}
        {item.price != 0 && item.price != "x" && (
          <Text style={styles.cellWithPadding}>{item.price}</Text>
        )}
        <Text style={styles.cellWithPadding2}>{item.item}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerTopBar}>
        <Text style={styles.headerTopBarText}>
          {i18n.t("summarypart")} : {carcurret}
        </Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.heading}>{i18n.t("code")}</Text>
        <Text style={styles.headingPadding}>{i18n.t("name")}</Text>
        <Text style={styles.headingPadding}>{i18n.t("price")}</Text>
        <Text style={styles.headingPadding}>{i18n.t("parts")}</Text>
      </View>
      <FlatList
        data={combinedLists.slice(7 * (num - 1), 7 * num)}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <View style={{ marginTop: 80 }}>
            <View style={styles.chevronContainer}>
              <TouchableOpacity>
                <Entypo
                  name="chevron-small-left"
                  size={30}
                  color="black"
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

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.create_btn} onPress={gonext}>
                <Text
                  style={{
                    fontFamily: "PakkadThin",
                    fontSize: 16,
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  {i18n.t("createbill")}
                </Text>
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
    textAlign: "center",
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
    right: -15,
  },
  create_btn: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 40,
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
    marginTop: -80,
    borderRadius: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  chevronContainer: {
    flexDirection: "row",
    left: 300,
  },
});

export default PartList;
