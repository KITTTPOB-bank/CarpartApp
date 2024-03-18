import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert, ActivityIndicator
} from "react-native";

import axios from "axios";
import { useFonts } from "expo-font";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from '../component/textlanguage'

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const TakePhotoAllCarScreen = ({ route }) => {
  const navigation = useNavigation();
  const [listimagefrontsend, setListImageFrontSend] = useState([]);
  const [listimagebacksend, setListImageBacktSend] = useState([]);
  const [listimagerearsend, setListImageRearSend] = useState([]);
  const [statuscolorf, setStatusColorF] = useState(false);
  const [statuscolorb, setStatusColorB] = useState(false);
  const [statuscolorr, setStatusColorR] = useState(false);
  const [loading, setLoding] = useState(false);

  //รับรายการรูปภาพจากหน้าเลือกรูปภาพ
  useEffect(() => {
    if (route.params && route.params.listimagefront) {
      setListImageFrontSend(route.params.listimagefront);
      setStatusColorF(route.params.statusfront);
    } else if (route.params && route.params.listimageback) {
      setListImageBacktSend(route.params.listimageback);
      setStatusColorB(route.params.statusback);
    } else if (route.params && route.params.listimagerear) {
      setListImageRearSend(route.params.listimagerear);
      setStatusColorR(route.params.statusrear);
    }
  }, [route.params]);

  const ProcessCarImageScreen = async () => {
    if (statuscolorf == true || statuscolorr == true || statuscolorb == true) {
      const formData = new FormData();
      setLoding(true)

      if (statuscolorf) {
        for (let i = 0; i < listimagefrontsend.length; i++) {
          const file = listimagefrontsend[i];
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append(`filesF`, {
            uri: file,
            type: blob.type,
            name: file,
          });
        }
      }
      if (statuscolorr) {

        for (let i = 0; i < listimagerearsend.length; i++) {
          const file = listimagerearsend[i];
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append(`filesR`, {
            uri: file,
            type: blob.type,
            name: file,
          });
        }
      }
      if (statuscolorb) {
        for (let i = 0; i < listimagebacksend.length; i++) {
          const file = listimagebacksend[i];
          const response = await fetch(file);
          const blob = await response.blob();
          formData.append(`filesB`, {
            uri: file,
            type: blob.type,
            name: file,
          });
        }
      }
      handleCancelImageF();
      handleCancelImageR();
      handleCancelImageB();
      if (formData) {
        try {
          const response = await axios.post("http://******:8000/uploadcar", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setLoding(false);
          if (response.data.probability > 85) {
            navigation.navigate("ResultScreen", {
              prediction: response.data.prediction,
              probability: response.data.probability,
              car_image: response.data.car_image,
            });
          }
          else {
            Alert.alert("รูปที่อัปโหลดไม่ถูกต้องหรือไม่ชัดเจนกรุณาอัปโหลดใหม่อีกครั้ง");
          }
        }
        catch (error) {
          try {
            const response = await axios.post("http://******:8000/uploadcar", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            setLoding(false);
            if (response.data.probability > 85) {
              navigation.navigate("ResultScreen", {
                prediction: response.data.prediction,
                probability: response.data.probability,
                car_image: response.data.car_image,
              });
            }
            else {
              Alert.alert("รูปที่อัปโหลดไม่ถูกต้องหรือไม่ชัดเจนกรุณาอัปโหลดใหม่อีกครั้ง");
            }
          }
          catch (retryError) {
            // จัดการข้อผิดพลาดจากการส่งคำขออีกครั้ง
            setLoding(false)
            Alert.alert("เกิดข้อผิดพลากกรุณาอัปโหลดรูปภาพใหม่อีกครั้ง");
          }
        }

      }
    }
    else {
      Alert.alert("กรุณาอัปโหลดรูปรถยนต์อย่างน้อย 1 รูปภาพ");
    }
  };




  const navigateToSelectPhotoScreen = (type) => {
    navigation.navigate("SelectPhotoAll", {
      type: type,
    });
  };
  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }

  const handleCancelImageF = () => {
    setListImageFrontSend([]);
    setStatusColorF(false);
  };
  const handleCancelImageR = () => {
    setListImageRearSend([]);
    setStatusColorR(false);
  };
  const handleCancelImageB = () => {
    setListImageBacktSend([]);
    setStatusColorB(false);
  };
  function LoadingAnimation() {
    return (
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator size="large" />
        <Text style={{ fontFamily: 'PakkadThin', fontSize: 18 }} >{i18n.t('imgprocess')} {i18n.t('wait')}</Text>
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
              disabled={statuscolorf}
              style={[
                styles.btn,
                { backgroundColor: statuscolorf ? "#7DE3B2" : "#C0BCBC" },
              ]}
              onPress={() => navigateToSelectPhotoScreen("front")}
            >
              <View style={styles.btnContent}>
                {statuscolorf && (
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color="gray"
                    style={styles.cancelIcon}
                    onPress={() => handleCancelImageF()}
                  />
                )}
                <Image
                  style={{ width: 80, height: 80 }}
                  source={require("../assets/logofrontcar.png")}
                ></Image>

                <Text style={styles.btnText}>{i18n.t('carfront')}</Text>
              </View>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                disabled={statuscolorr}
                style={[
                  styles.btn,
                  { backgroundColor: statuscolorr ? "#7DE3B2" : "#C0BCBC" },
                ]}
                onPress={() => navigateToSelectPhotoScreen("rear")}
              >
                <View style={styles.btnContent}>
                  {statuscolorr && (
                    <MaterialIcons
                      name="cancel"
                      size={20}
                      color="gray"
                      style={styles.cancelIcon}
                      onPress={() => handleCancelImageR()}
                    />
                  )}
                  <Image
                    style={{ width: 80, height: 80 }}
                    source={require("../assets/logosidecar.png")}
                  ></Image>
                  <Text style={styles.btnText}>{i18n.t('carside')}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={statuscolorb}
              style={[
                styles.btn,
                { backgroundColor: statuscolorb ? "#7DE3B2" : "#C0BCBC" },
              ]}
              onPress={() => navigateToSelectPhotoScreen("back")}
            >
              <View style={styles.btnContent}>
                {statuscolorb && (
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color="gray"
                    style={styles.cancelIcon}
                    onPress={() => handleCancelImageB()}
                  />
                )}
                <Image
                  style={{ width: 80, height: 80 }}
                  source={require("../assets/logobackcar.png")}
                ></Image>
                <Text style={styles.btnText}>{i18n.t('carbehind')}</Text>
              </View>
            </TouchableOpacity>
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
                {i18n.t('process')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("HelpToggleScreen")}>
            <Image
              source={require("../assets/helptoggle.png")}
              style={{ width: 80, height: 80, bottom: -140, left: 140 }}
            />
          </TouchableOpacity>
        </>
      )
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  indicatorWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 150,
  },

  btn: {
    flex: 1,
    backgroundColor: "#C0BCBC",
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
  cancelIcon: {
    position: "absolute",
    top: -2,
    right: -2,
    padding: 5,
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
    marginTop: 100,
    borderRadius: 10,
    backgroundColor: "#2D58AD",
  },

  predict_btnContent: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TakePhotoAllCarScreen;
