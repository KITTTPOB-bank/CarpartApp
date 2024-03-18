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
import translations from '../component/textlanguage'
import axios from "axios";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

// import { Dimensions } from "react-native";

const SeePartCarList = ({ route }) => {
    const [alldata, setalldata] = useState([]);
    const [num, setnum] = useState(1);
    const [data, setdata] = useState([]);
    const [partnames, setpartnames] = useState('กันชนหน้า');
    const { list, setlist } = useContext(MyContext);
    const [isCheckedArray, setIsCheckedArray] = useState(data.map(() => false));
    const [carcurret, setcarcurret] = useState(null);

    useEffect(() => {
        fetchDatapart();
    }, []);

    const fetchDatapart = async () => {
        const apiUrl = "http://******:8000/carpartsearch";

        const queryParams = {
            brand: route.params.brand,
            name: route.params.name,
            year: route.params.year,
        };
        const response = await axios.get(apiUrl, {
            params: queryParams,
        });
        setcarcurret(route.params.brand + route.params.name + route.params.year)
        setalldata(response.data);

    }


    useEffect(() => {
        if (route.params && route.params.key === "frontbumper") {
            const data = alldata['frontbumper'];
            if (data) {
                for (item in data) {
                    item["isChecked"] = false
                }
                setdata(data);
                setpartnames(i18n.t("frontbumper"));
            }
        }
        else if (route.params.key === "backbumper") {
            const data = alldata['rearbumper'];
            if (data) {
                for (item in data) {
                    item["isChecked"] = false
                }
                setdata(data);
                setpartnames(i18n.t("rearbumper"));
            }
        }
        else if (route.params.key === "grille") {
            const data = alldata['grille'];
            if (data) {
                for (item in data) {
                    item["isChecked"] = false
                }
                setdata(data);
                setpartnames(i18n.t("grille"));
            }
        }
        else if (route.params.key === "headlight") {
            const data = alldata['headlamp'];
            if (data) {
                for (item in data) {
                    item["isChecked"] = false
                }
                setdata(data);
                setpartnames(i18n.t("headlamp"));
            }
        }
        else if (route.params.key === "backlight") {
            const data = alldata['backuplamp'];
            if (data) {
                for (item in data) {
                    item["isChecked"] = false
                }
                setdata(data);
                setpartnames(i18n.t("backuplamp"));
            }
        }
        else if (route.params.key === "door") {
            const data = alldata['door'];
            if (data) {
                for (item in data) {
                    item["isChecked"] = false
                }
                setdata(data);
                setpartnames(i18n.t("door"));
            }
        }
        else if (route.params.key === "mirror") {
            const data = alldata['mirror'];
            if (data) {
                for (item in data) {
                    item["isChecked"] = false
                }
                setdata(data);
                setpartnames(i18n.t("mirror"));
            }
        }

    }, [route.params, alldata]);



    const backpage = async () => {
        if (num > 1) {
            const go = num
            setnum(go - 1)
        }
    }
    const gopage = async () => {
        if (num < data.length / 8) {
            const go = num
            setnum(go + 1)
        }
    }

    const [fontsLoaded] = useFonts({
        PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
    });

    if (!fontsLoaded) {
        return "";
    }

    const renderItem = ({ item, index }) => {
        const priceText = item.price === 0 ? i18n.t("notsale") : item.price.toFixed(2).toString();
        return (
            <View style={styles.row}>
                <Text style={styles.cell}>{item.code}</Text>
                <Text style={styles.cellWithPadding2}>{item.name}</Text>
                <Text style={styles.cellWithPadding3}>{priceText}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.headerTopBar}>
                <Text style={styles.headerTopBarText}>
                    {carcurret} : {partnames}
                </Text>
            </View>

            <View style={styles.header}>
                <Text style={styles.heading}>{i18n.t('code')}</Text>
                <Text style={styles.headingPadding}>{i18n.t('name')}</Text>
                <Text style={styles.headingPadding}>{i18n.t('price')}</Text>
            </View>
            <FlatList
                data={data.slice(8 * (num - 1), 8 * num)}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
            ></FlatList>
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
                <Text style={{ top: 12, right: -7 }}>{num}</Text>
                <TouchableOpacity>
                    <Entypo
                        name="chevron-small-right"
                        size={30}
                        color="black"
                        style={styles.chevronRight}
                        onPress={gopage}
                    />
                </TouchableOpacity>
            </View>
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
        right: 0,
    },
    cellWithPadding3: {
        fontSize: 10,
        fontFamily: "PakkadThin",
        flex: 1,
        right: -45
    },
    chevronContainer: {
        position: "relative",
        flexDirection: "row",
        top: -100,
        left: 310,
    },

    chevronLeft: {
        position: "absolute",
        left: -30,
        top: 6.5,
    },

    chevronRight: {
        position: "absolute",
        left: 15,
        top: 6.5,
    },
});

export default SeePartCarList;
