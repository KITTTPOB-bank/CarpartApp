import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView,
    ScrollView,
    Button, Alert
} from "react-native";

import { useFonts } from "expo-font";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
const showAlert = () =>
    Alert.alert(
        '',
        'สามารถเลือกได้สูงสุด 3 รูปภาพ',
    );
const SelectPhotoPart = ({ route }) => {
    const navigation = useNavigation();
    const typecheck = route.params?.type
    const [listimagefrontbumpersend, setListImageFrontBumperSend] = useState([]);
    const [listimagerearbumpersend, setListImageRearBumperSend] = useState([]);
    const [listimagedoorsend, setListImageDoorSend] = useState([]);
    const [listimageheadlampsend, setListImageHeadLampSend] = useState([]);
    const [listimagebackuplampsend, setListImageBackupLampSend] = useState([]);
    const [alertcheck, setalertcheck] = useState(false);
    const Alertcheck = async () => {
        setalertcheck(true)
    }
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
                    alert("โปรดอนูญาติการเข้าถึง");
                }
            }
        })();
    }, []);

    //เลือกรูปภาพจากgallery
    const pickImage = async (typecheck) => {
        const typeback = route.params?.typeback
        console.log(typecheck)
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                maxWidth: 224,
                maxHeight: 224
            });

            // ตรวจสอบการเลือกรูปภาพ
            if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
                if (typeback == 'frontbumper' || typecheck == 'frontbumper') {
                    setListImageFrontBumperSend((prevList) => [...prevList, result.assets[0].uri]);
                }
                else if (typeback == 'rearbumper' || typecheck == 'rearbumper') {
                    setListImageRearBumperSend((prevList) => [...prevList, result.assets[0].uri]);
                }
                else if (typeback == 'door' || typecheck == 'door') {
                    setListImageDoorSend((prevList) => [...prevList, result.assets[0].uri]);
                }
                else if (typeback == 'headlamp' || typecheck == 'headlamp') {
                    setListImageHeadLampSend((prevList) => [...prevList, result.assets[0].uri]);
                }
                else if (typeback == 'backuplamp' || typecheck == 'backuplamp') {
                    setListImageBackupLampSend((prevList) => [...prevList, result.assets[0].uri]);
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

        if (savedImage && typeback == 'frontbumper') {
            setListImageFrontBumperSend((prevList) => [...prevList, savedImage]);
        }
        else if (savedImage && typeback == 'rearbumper') {
            setListImageRearBumperSend((prevList) => [...prevList, savedImage]);
        }
        else if (savedImage && typeback == 'door') {
            setListImageDoorSend((prevList) => [...prevList, savedImage]);
        }
        else if (savedImage && typeback == 'headlamp') {
            setListImageHeadLampSend((prevList) => [...prevList, savedImage]);
        }
        else if (savedImage && typeback == 'backuplamp') {
            setListImageBackupLampSend((prevList) => [...prevList, savedImage]);
        }
    }, [route.params]);


    //ไปหน้ากล้องถ่ายรูป
    const navigateToTakePhotoScreen = (typecheck) => {
        if (!typecheck) {
            const typeback = route.params?.typeback
            typecheck = typeback
        }
        navigation.navigate("TakePhotoScreen", {
            type: typecheck
        });
    };


    //บันถึกรายการรูปภาพ
    const navigateToSaveListImage = async (typecheck) => {
        const typeback = route.params?.typeback

        if (typeback == 'frontbumper' || typecheck == 'frontbumper') {
            navigation.navigate("TakePhotoCarPartScreen", {
                listimagefrontbumper: listimagefrontbumpersend,
                statusfrontbumper: true
            })
        }
        else if (typeback == 'rearbumper' || typecheck == 'rearbumper') {
            navigation.navigate("TakePhotoCarPartScreen", {
                listimagerearbumper: listimagerearbumpersend,
                statusrearbumper: true
            })
        }
        else if (typeback == 'door' || typecheck == 'door') {
            navigation.navigate("TakePhotoCarPartScreen", {
                listimagedoor: listimagedoorsend,
                statusdoor: true
            })
        }
        else if (typeback == 'headlamp' || typecheck == 'headlamp') {
            navigation.navigate("TakePhotoCarPartScreen", {
                listimageheadlamp: listimageheadlampsend,
                statusheadlamp: true
            })
        }
        else if (typeback == 'backuplamp' || typecheck == 'backuplamp') {
            navigation.navigate("TakePhotoCarPartScreen", {
                listimagebackuplamp: listimagebackuplampsend,
                statusbackuplamp: true
            })
        }
    }

    //เอารูปภาพออก
    const handleCancelFrontbumper = (index) => {
        const newList = [...listimagefrontbumpersend];
        newList.splice(index, 1);
        setListImageFrontBumperSend(newList);
    };
    const handleCancelRearbumper = (index) => {
        const newList = [...listimagerearbumpersend];
        newList.splice(index, 1);
        setListImageRearBumperSend(newList);
    };
    const handleCancelDoor = (index) => {
        const newList = [...listimagedoorsend];
        newList.splice(index, 1);
        setListImageDoorSend(newList);
    };
    const handleCancelHeadLamp = (index) => {
        const newList = [...listimageheadlampsend];
        newList.splice(index, 1);
        setListImageHeadLampSend(newList);
    }; const handleCancelBackuplamp = (index) => {
        const newList = [...listimagebackuplampsend];
        newList.splice(index, 1);
        setListImageBackupLampSend(newList);
    };

    let isSaveButtonDisabled = true
    if ((listimagefrontbumpersend.length == 3 || listimagefrontbumpersend.length == 2 || listimagefrontbumpersend.length == 1)
        || (listimagerearbumpersend.length == 3 || listimagerearbumpersend.length == 2 || listimagerearbumpersend.length == 1)
        || (listimagedoorsend.length == 3 || listimagedoorsend.length == 2 || listimagedoorsend.length == 1)
        || (listimageheadlampsend.length == 3 || listimageheadlampsend.length == 2 || listimageheadlampsend.length == 1)
        || (listimagebackuplampsend.length == 3 || listimagebackuplampsend.length == 2 || listimagebackuplampsend.length == 1)) {
        isSaveButtonDisabled = false
    }
    if ((listimagefrontbumpersend.length === 4 || listimagerearbumpersend.length === 4 ||
        listimagedoorsend.length === 4 || listimageheadlampsend.length === 4 || listimagebackuplampsend.length === 4) && !alertcheck) {
        showAlert();
        Alertcheck()
    }


    const [fontsLoaded] = useFonts({
        PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
    });

    if (!fontsLoaded) {
        return "";
    }

    return (
        <ScrollView
        >
            <SafeAreaView style={styles.screen}>
                <View style={styles.squarecontainer}>
                    <TouchableOpacity style={styles.square} onPress={() => pickImage(typecheck)}>
                        <MaterialIcons name="add-photo-alternate" size={160} />
                    </TouchableOpacity>
                    {listimagefrontbumpersend.map((val, index) => (
                        <TouchableOpacity key={index} style={styles.square}>
                            <Image source={{ uri: val }} style={styles.image} />
                            <MaterialIcons
                                name="cancel"
                                size={20}
                                color="gray"
                                style={styles.cancelIcon}
                                onPress={() => handleCancelFrontbumper(index)}
                            />
                        </TouchableOpacity>
                    ))}
                    {listimagerearbumpersend.map((val, index) => (
                        <TouchableOpacity key={index} style={styles.square}>
                            <Image source={{ uri: val }} style={styles.image} />
                            <MaterialIcons
                                name="cancel"
                                size={20}
                                color="gray"
                                style={styles.cancelIcon}
                                onPress={() => handleCancelRearbumper(index)}
                            />
                        </TouchableOpacity>
                    ))}

                    {listimagedoorsend.map((val, index) => (
                        <TouchableOpacity key={index} style={styles.square}>
                            <Image source={{ uri: val }} style={styles.image} />
                            <MaterialIcons
                                name="cancel"
                                size={20}
                                color="gray"
                                style={styles.cancelIcon}
                                onPress={() => handleCancelDoor(index)}
                            />
                        </TouchableOpacity>
                    ))}

                    {listimageheadlampsend.map((val, index) => (
                        <TouchableOpacity key={index} style={styles.square}>
                            <Image source={{ uri: val }} style={styles.image} />
                            <MaterialIcons
                                name="cancel"
                                size={20}
                                color="gray"
                                style={styles.cancelIcon}
                                onPress={() => handleCancelHeadLamp(index)}
                            />
                        </TouchableOpacity>
                    ))}
                    {listimagebackuplampsend.map((val, index) => (
                        <TouchableOpacity key={index} style={styles.square}>
                            <Image source={{ uri: val }} style={styles.image} />
                            <MaterialIcons
                                name="cancel"
                                size={20}
                                color="gray"
                                style={styles.cancelIcon}
                                onPress={() => handleCancelBackuplamp(index)}
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

    txt: {
        fontFamily: "PakkadThin",
        fontSize: 30,
        color: "white",
        marginTop: 30,
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    cancelIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 5,
    },
    squarecontainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 30,
        flexWrap: 'wrap',
    },

    square: {
        width: '48%',
        marginBottom: 10,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 60,
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

export default SelectPhotoPart;
