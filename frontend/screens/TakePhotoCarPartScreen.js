import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import { useFonts } from "expo-font";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "../component/textlanguage";
import { MyContext } from "../context/MyContext";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const TakePhotoCarPartScreen = ({ route }) => {
  const navigation = useNavigation();

  const [listimagefrontbumpersend, setListImageFrontBumperSend] = useState([]);
  const [statuscolorfrontbumper, setStatusColorFrontBumper] = useState(false);

  const [listimagerearbumpersend, setListImageRearBumperSend] = useState([]);
  const [statuscolorrearbumper, setStatusColorRearBumper] = useState(false);

  const [listimagedoorsend, setListImageDoorSend] = useState([]);
  const [statuscolordoor, setStatusColorDoor] = useState(false);

  const [listimageheadlampsend, setListImageHeadLampSend] = useState([]);
  const [statuscolorheadlamp, setStatusColorHeadLamp] = useState(false);

  const [listimagebackuplampsend, setListImageBackupLampSend] = useState([]);
  const [statuscolorbackuplamp, setStatusColorBackupLamp] = useState(false);

  const [loading, setLoding] = useState(false);

  const { globalValue2, setGlobalValue2 } = useContext(MyContext);

  //รับรายการรูปภาพจากหน้าเลือกรูปภาพ

  //รับรายการรูปภาพจากหน้าเลือกรูปภาพ
  useEffect(() => {
    Alert.alert(i18n.t("alertuploadtext"));
  }, []);
  useEffect(() => {
    if (route.params && route.params.listimagefrontbumper) {
      setListImageFrontBumperSend(route.params.listimagefrontbumper);
      setStatusColorFrontBumper(route.params.statusfrontbumper);
    } else if (route.params && route.params.listimagerearbumper) {
      setListImageRearBumperSend(route.params.listimagerearbumper);
      setStatusColorRearBumper(route.params.statusrearbumper);
    } else if (route.params && route.params.listimagedoor) {
      setListImageDoorSend(route.params.listimagedoor);
      setStatusColorDoor(route.params.statusdoor);
    } else if (route.params && route.params.listimageheadlamp) {
      setListImageHeadLampSend(route.params.listimageheadlamp);
      setStatusColorHeadLamp(route.params.statusheadlamp);
    } else if (route.params && route.params.listimagebackuplamp) {
      setListImageBackupLampSend(route.params.listimagebackuplamp);
      setStatusColorBackupLamp(route.params.statusbackuplamp);
    }
  }, [route.params]);

  const ProcessCarImageScreen = async () => {
    if (statuscolorfrontbumper == true || statuscolorheadlamp == true) {
      const formData = new FormData();
      setLoding(true);
      if (statuscolorfrontbumper) {
        for (let i = 0; i < listimagefrontbumpersend.length; i++) {
          const file = listimagefrontbumpersend[i];
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append(`filesF`, {
            uri: file,
            type: blob.type,
            name: file,
          });
        }
      }
      if (statuscolorrearbumper) {
        for (let i = 0; i < listimagerearbumpersend.length; i++) {
          const file = listimagerearbumpersend[i];
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append(`filesR`, {
            uri: file,
            type: blob.type,
            name: file,
          });
        }
      }

      if (statuscolordoor) {
        for (let i = 0; i < listimagedoorsend.length; i++) {
          const file = listimagedoorsend[i];
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append(`filesD`, {
            uri: file,
            type: blob.type,
            name: file,
          });
        }
      }

      if (statuscolorheadlamp) {
        for (let i = 0; i < listimageheadlampsend.length; i++) {
          const file = listimageheadlampsend[i];
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append(`filesB`, {
            uri: file,
            type: blob.type,
            name: file,
          });
        }
      }

      if (statuscolorbackuplamp) {
        for (let i = 0; i < listimagebackuplampsend.length; i++) {
          const file = listimagebackuplampsend[i];
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append(`filesE`, {
            uri: file,
            type: blob.type,
            name: file,
          });
        }
      }

      handleCancelFrontbumper();
      handleCancelRearbumper();
      handleCancelDoor();
      handleCancelHeadLamp();
      handleCancelBackuplamp();
      if (formData) {
        try {
          const response = await axios.post(
            "http://******:8000/uploadparts",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setLoding(false);
          if (response.data.probability > 85) {
            navigation.navigate("ResultScreen", {
              prediction: response.data.prediction,
              probability: response.data.probability,
              car_image: response.data.car_image,
            });
          } else {
            Alert.alert("รูปที่อัปโหลดไม่ถูกต้องหรือไม่ชัดเจนกรุณาอัปโหลดใหม่อีกครั้ง");
          }
        } catch (error) {
          try {
            const response = await axios.post(
              "http://******:8000/uploadparts",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            setLoding(false);
            if (response.data.probability > 85) {
              navigation.navigate("ResultScreen", {
                prediction: response.data.prediction,
                probability: response.data.probability,
                car_image: response.data.car_image,
              });
            } else {
              Alert.alert("รูปที่อัปโหลดไม่ถูกต้องหรือไม่ชัดเจนกรุณาอัปโหลดใหม่อีกครั้ง");
            }
          } catch (retryError) {
            setLoding(false);
            Alert.alert("เกิดข้อผิดพลากกรุณาอัปโหลดรูปภาพใหม่อีกครั้ง");
          }
        }
      }
    } else {
      Alert.alert(i18n.t("alertuploadtext"));
    }
  };

  const navigateToSelectPhotoScreen = (type) => {
    if (type == "frontbumper") {
      setGlobalValue2("กันชนหน้า");
    } else if (type == "rearbumper") {
      setGlobalValue2("กันชนหลัง");
    } else if (type == "headlamp") {
      setGlobalValue2("ไฟหน้า");
    } else if (type == "backuplamp") {
      setGlobalValue2("ไฟท้าย");
    } else if (type == "door") {
      setGlobalValue2("ประตู");
    }
    navigation.navigate("SelectPhotoPart", {
      type: type,
    });
  };
  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }

  const handleCancelFrontbumper = () => {
    setListImageFrontBumperSend([]);
    setStatusColorFrontBumper(false);
  };
  const handleCancelRearbumper = () => {
    setListImageRearBumperSend([]);
    setStatusColorRearBumper(false);
  };
  const handleCancelDoor = () => {
    setListImageDoorSend([]);
    setStatusColorDoor(false);
  };
  const handleCancelHeadLamp = () => {
    setListImageHeadLampSend([]);
    setStatusColorHeadLamp(false);
  };
  const handleCancelBackuplamp = () => {
    setListImageBackupLampSend([]);
    setStatusColorBackupLamp(false);
  };

  function LoadingAnimation() {
    return (
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator size="large" />
        <Text style={{ fontFamily: "PakkadThin", fontSize: 18 }}>
          {i18n.t("imgprocess")} {i18n.t("wait")}
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.screen}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={statuscolorfrontbumper}
              style={[
                styles.btn,
                {
                  backgroundColor: statuscolorfrontbumper
                    ? "#7DE3B2"
                    : "#C0BCBC",
                },
              ]}
              onPress={() => navigateToSelectPhotoScreen("frontbumper")}
            >
              <View style={styles.btnContent}>
                {statuscolorfrontbumper && (
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color="gray"
                    style={styles.cancelIcon}
                    onPress={() => handleCancelFrontbumper()}
                  />
                )}
                <Image
                  style={{ width: 80, height: 80 }}
                  source={require("../assets/iconfontbumper.png")}
                ></Image>
                <Text style={styles.btnText}>{i18n.t("frontbumper")}</Text>
              </View>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                disabled={statuscolorrearbumper}
                style={[
                  styles.btn,
                  {
                    backgroundColor: statuscolorrearbumper
                      ? "#7DE3B2"
                      : "#C0BCBC",
                  },
                ]}
                onPress={() => navigateToSelectPhotoScreen("rearbumper")}
              >
                <View style={styles.btnContent}>
                  {statuscolorrearbumper && (
                    <MaterialIcons
                      name="cancel"
                      size={20}
                      color="gray"
                      style={styles.cancelIcon}
                      onPress={() => handleCancelRearbumper()}
                    />
                  )}
                  <Image
                    style={{ width: 80, height: 80 }}
                    source={require("../assets/iconbackbumper.png")}
                  ></Image>
                  <Text style={styles.btnText}>{i18n.t("rearbumper")}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={statuscolordoor}
              style={[
                styles.btn,
                { backgroundColor: statuscolordoor ? "#7DE3B2" : "#C0BCBC" },
              ]}
              onPress={() => navigateToSelectPhotoScreen("door")}
            >
              <View style={styles.btnContent}>
                {statuscolordoor && (
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color="gray"
                    style={styles.cancelIcon}
                    onPress={() => handleCancelDoor()}
                  />
                )}
                <Image
                  style={{ width: 80, height: 80 }}
                  source={require("../assets/icondoor.png")}
                ></Image>
                <Text style={styles.btnText}>{i18n.t("door")}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer2}>
            <TouchableOpacity
              disabled={statuscolorheadlamp}
              style={[
                styles.btn,

                {
                  backgroundColor: statuscolorheadlamp ? "#7DE3B2" : "#C0BCBC",
                  marginRight: "2%",
                },
              ]}
              onPress={() => navigateToSelectPhotoScreen("headlamp")}
            >
              <View style={styles.btnContent}>
                {statuscolorheadlamp && (
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color="gray"
                    style={styles.cancelIcon}
                    onPress={() => handleCancelHeadLamp()}
                  />
                )}
                <Image
                  style={{ width: 80, height: 80 }}
                  source={require("../assets/iconheadlamp.png")}
                ></Image>
                <Text style={styles.btnText}>{i18n.t("headlamp")}</Text>
              </View>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                disabled={statuscolorbackuplamp}
                style={[
                  styles.btn,
                  {
                    backgroundColor: statuscolorbackuplamp
                      ? "#7DE3B2"
                      : "#C0BCBC",
                    marginRight: "3%",
                  },
                ]}
                onPress={() => navigateToSelectPhotoScreen("backuplamp")}
              >
                <View style={styles.btnContent}>
                  {statuscolorbackuplamp && (
                    <MaterialIcons
                      name="cancel"
                      size={20}
                      color="gray"
                      style={styles.cancelIcon}
                      onPress={() => handleCancelBackuplamp()}
                    />
                  )}
                  <Image
                    style={{ width: 80, height: 80 }}
                    source={require("../assets/iconbackuplamp.png")}
                  ></Image>
                  <Text style={styles.btnText}>{i18n.t("backuplamp")}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btn_invis}></TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.predict_btn}
            onPress={() => ProcessCarImageScreen()}
          >
            <View style={styles.predict_btnContent}>
              <Text
                style={{
                  fontFamily: "PakkadThin",
                  fontSize: 24,
                  color: "white",
                }}
              >
                {i18n.t("process")}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("HelpTogglePartScreen")}
          >
            <Image
              source={require("../assets/helptoggle.png")}
              style={{ width: 80, height: 80, bottom: -100, left: 140 }}
            />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  indicatorWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
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
    paddingHorizontal: 20,
    marginTop: 100,
  },

  buttonContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 30,
  },

  btn: {
    flex: 1,
    backgroundColor: "#C0BCBC",
    borderRadius: 15,
    marginHorizontal: 5,
    height: 80,
    width: "93%",
  },
  btn_invis: {
    borderRadius: 20,
    marginLeft: 10,
    width: "31%",
  },

  btnContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  btnText: {
    fontFamily: "PakkadThin",
    textAlign: "center",
    fontSize: 12,
  },

  predict_btn: {
    alignSelf: "center",
    width: 300,
    height: 50,
    padding: 5,
    backgroundColor: "white",
    marginTop: 80,
    borderRadius: 10,
    backgroundColor: "#5A6199",
  },

  predict_btnContent: {
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "PakkadThin",
    fontSize: 20,
  },
  cancelIcon: {
    position: "absolute",
    top: -2,
    right: -2,
    padding: 5,
  },
});

export default TakePhotoCarPartScreen;
