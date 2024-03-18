import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView
} from "react-native";

import { useFonts } from "expo-font";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';



const SelectPhotoAll = ({ route }) => {
  const [listimagefront, setListImageFront] = useState([])
  const [listimagerear, setListImageRear] = useState([])
  const [listimageback, setListImageBack] = useState([])
  const navigation = useNavigation();
  const typecheck = route.params?.type

  // ขออนุญาติเข้าถึงคลังรูปภาพของ ios
  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const cameraRollStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (
          cameraRollStatus.status !== "granted" ||
          cameraStatus.status !== "granted"
        ) {
          alert("Sorry, we need these permissions to make this work!");
        }
      }
    })();
  }, []);

  //เลือกรูปภาพจากgallery
  const pickImage = async (typecheck) => {
    const typeback = route.params?.typeback

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,

        quality: 0.2,
      });

      // ตรวจสอบการเลือกรูปภาพ
      if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
        if (typeback == 'front' || typecheck == 'front') {
          setListImageFront((prevList) => [...prevList, result.assets[0].uri]);
        }
        else if (typeback == 'rear' || typecheck == 'rear') {
          setListImageRear((prevList) => [...prevList, result.assets[0].uri]);
        }
        else if (typeback == 'back' || typecheck == 'back') {
          setListImageBack((prevList) => [...prevList, result.assets[0].uri]);
        }
      } else {
        console.log('User canceled image picker');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //รับรูปภาพจากการถ่ายรูปภาพ
  useEffect(() => {
    const typeback = route.params?.typeback
    const savedImage = route.params?.savedImage;


    if (savedImage && typeback == 'front') {
      setListImageFront((prevList) => [...prevList, savedImage]);
    }
    else if (savedImage && typeback == 'rear') {
      setListImageRear((prevList) => [...prevList, savedImage]);
    }
    else if (savedImage && typeback == 'back') {
      setListImageBack((prevList) => [...prevList, savedImage]);
    }
  }, [route.params]);

  //ไปหน้ากล้องถ่ายรูป
  const navigateToTakePhotoScreen = (typecheck) => {
    if (!typecheck) {
      const typeback = price.params?.typeback
      typecheck = typeback
    }
    navigation.navigate("TakePhotoScreen", {
      type: typecheck
    });
  };

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });

  if (!fontsLoaded) {
    return "";
  }

  //บันถึกรายการรูปภาพ
  const navigateToSaveListImage = async (typecheck) => {
    const typeback = route.params?.typeback

    if (typeback == 'front' || typecheck == 'front') {
      navigation.navigate("TakePhotoAllCarScreen", {
        listimagefront: listimagefront,
        statusfront: true
      })
    }
    else if (typeback == 'rear' || typecheck == 'rear') {
      navigation.navigate("TakePhotoAllCarScreen", {
        listimagerear: listimagerear,
        statusrear: true

      })
    }
    else if (typeback == 'back' || typecheck == 'back') {

      navigation.navigate("TakePhotoAllCarScreen", {
        listimageback: listimageback,
        statusback: true


      })
    }
  }

  //เอารูปภาพออก
  const handleCancelImageF = (index) => {
    const newList = [...listimagefront];
    newList.splice(index, 1);
    setListImageFront(newList);
  };
  const handleCancelImageR = (index) => {
    const newList = [...listimagerear];
    newList.splice(index, 1);
    setListImageRear(newList);
  };
  const handleCancelImageB = (index) => {
    const newList = [...listimageback];
    newList.splice(index, 1);
    setListImageBack(newList);
  };



  let isSaveButtonDisabled = true
  if ((listimagefront.length == 3 || listimagefront.length == 2 || listimagefront.length == 1)
    || (listimagerear.length == 3 || listimagerear.length == 2 || listimagerear.length == 1)
    || (listimageback.length == 3 || listimageback.length == 2 || listimageback.length == 1)) {
    isSaveButtonDisabled = false
  }
  return (
    <ScrollView
    >
      <SafeAreaView style={styles.screen}>

        <View style={styles.squarecontainer}>

          <TouchableOpacity style={styles.square} onPress={() => pickImage(typecheck)}>
            <MaterialIcons name="add-photo-alternate" size={160} />
          </TouchableOpacity>

          {listimagefront.map((val, index) => (
            <TouchableOpacity key={index} style={styles.square}>
              <Image source={{ uri: val }} style={styles.image} />
              <MaterialIcons
                name="cancel"
                size={20}
                color="gray"
                style={styles.cancelIcon}
                onPress={() => handleCancelImageF(index)}
              />
            </TouchableOpacity>
          ))}
          {listimagerear.map((val, index) => (
            <TouchableOpacity key={index} style={styles.square}>
              <Image source={{ uri: val }} style={styles.image} />
              <MaterialIcons
                name="cancel"
                size={20}
                color="gray"
                style={styles.cancelIcon}
                onPress={() => handleCancelImageR(index)}
              />
            </TouchableOpacity>
          ))}

          {listimageback.map((val, index) => (
            <TouchableOpacity key={index} style={styles.square}>
              <Image source={{ uri: val }} style={styles.image} />
              <MaterialIcons
                name="cancel"
                size={20}
                color="gray"
                style={styles.cancelIcon}
                onPress={() => handleCancelImageB(index)}
              />
            </TouchableOpacity>
          ))}

        </View>


        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btn_takephoto} onPress={() => navigateToTakePhotoScreen(typecheck)}>
            <View style={styles.btnContent}>
              <Text style={styles.btnText}>ถ่ายรูป</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn_save, { backgroundColor: isSaveButtonDisabled ? '#7DE3B2' : '#39fa9d' }]}
            disabled={isSaveButtonDisabled}
            onPress={() => navigateToSaveListImage(typecheck)}
          >
            <View style={styles.btnContent}>
              <Text style={styles.btnText}>บันทึกข้อมูล</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",

  },

  cancelIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  txt: {
    fontFamily: "PakkadThin",
    fontSize: 30,
    color: "white",
    marginTop: 30,
  },
  square: {
    width: '48%', // กำหนดความกว้างของแต่ละรูปในแถว
    marginBottom: 10, // ระยะห่างระหว่างแถว
  },
  squarecontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 30,
    flexWrap: 'wrap', // เพิ่ม flexWrap เพื่อให้แถวถัดไปเริ่มต้นหลังจากที่ติดกันแถวที่ 1
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  btn_save: {
    flex: 1,
    backgroundColor: "#7DE3B2",
    borderRadius: 10,
    marginHorizontal: 5,
    height: 50,
  },

  btn_takephoto: {
    flex: 1,
    backgroundColor: "#2D58AD",
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
    color: "white",
    padding: 10,
    fontSize: 20,
  },
});

export default SelectPhotoAll;
