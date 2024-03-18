import { useState, react, useEffect } from "react";
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
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from '../component/textlanguage'
const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const CarPartListScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [filteredItems, setfilteredItems] = useState([]);
    const [filteredItems2, setfilteredItems2] = useState([]);
    const [filteredItems3, setfilteredItems3] = useState([]);
    const [filteredItems4, setfilteredItems4] = useState([]);
    const [filteredItems5, setfilteredItems5] = useState([]);
    const [filteredItems6, setfilteredItems6] = useState([]);
    const [filteredItems7, setfilteredItems7] = useState([]);
    const [price, serPrice] = useState(0);
    const [carname, setCarName] = useState('');

    useEffect(() => {
        setCarName(route.params.carnmae)
        getdata();
    }, []);


    const getdata = async () => {
        url = "http://******:8000/getlist";
        // url = `http://192.168.69.55:8000/getlist`;
        const options = {
            params: {
                bill_id: route.params.bill_id,
            },
        };
        await axios.get(url, options).then((response) => {
            const filteredItems = response.data["carparts_list"].filter(
                (item) => item.item === "กันชนหน้า"
            );
            const filteredItems2 = response.data["carparts_list"].filter(
                (item) => item.item === "กันชนหลัง"
            );
            const filteredItems3 = response.data["carparts_list"].filter(
                (item) => item.item === "กระจังหน้า"
            );
            const filteredItems4 = response.data["carparts_list"].filter(
                (item) => item.item === "ไฟหน้า"
            );
            const filteredItems5 = response.data["carparts_list"].filter(
                (item) => item.item === "ไฟท้าย"
            );
            const filteredItems6 = response.data["carparts_list"].filter(
                (item) => item.item === "ประตู"
            );
            const filteredItems7 = response.data["carparts_list"].filter(
                (item) => item.item === "กระจกข้าง"
            );

            setfilteredItems(filteredItems);
            setfilteredItems2(filteredItems2);
            setfilteredItems3(filteredItems3);
            setfilteredItems4(filteredItems4);
            setfilteredItems5(filteredItems5);
            setfilteredItems6(filteredItems6);
            setfilteredItems7(filteredItems7);
            serPrice(response.data["total_price"]);
        });
    };

    const [fontsLoaded] = useFonts({
        PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
    });

    if (!fontsLoaded) {
        return "";
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.headerTopBar}>
                <Text style={styles.headerTopBarText}>
                    {i18n.t("billpart")}
                    {"\n"}
                    {carname}
                </Text>
            </View>
            <View
                style={{ borderColor: "black", borderBottomWidth: 1, marginBottom: 20 }}
            ></View>
            <ScrollView
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "white" }}
            >
                {filteredItems[0] != null && (
                    <>
                        <Text style={styles.text_top}>
                            {carname} : {i18n.t("frontbumper")}
                        </Text>
                        <View style={styles.header}>
                            <Text style={styles.heading}>{i18n.t("code")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("name")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("price")}</Text>
                        </View>

                        {filteredItems.map((filteredItem) => (
                            <View key={filteredItem._id} style={styles.row}>
                                <Text style={styles.cell}>{filteredItem.code}</Text>
                                <Text style={styles.cellWithPadding}>{filteredItem.name}</Text>
                                {filteredItem.price == 0 &&
                                    <Text style={styles.cellWithPadding}>{i18n.t("notsale")}</Text>
                                }
                                {filteredItem.price != 0 &&
                                    <Text style={styles.cellWithPadding}>{filteredItem.price}</Text>
                                }
                            </View>
                        ))}
                    </>
                )}
                {filteredItems2[0] != null && (
                    <>
                        <Text style={styles.text_top}>
                            {carname} : {i18n.t("rearbumper")}
                        </Text>
                        <View style={styles.header}>
                            <Text style={styles.heading}>{i18n.t("code")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("name")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("price")}</Text>
                        </View>

                        {filteredItems2.map((filteredItem) => (
                            <View key={filteredItem._id} style={styles.row}>
                                <Text style={styles.cell}>{filteredItem.code}</Text>
                                <Text style={styles.cellWithPadding}>{filteredItem.name}</Text>
                                {filteredItem.price == 0 &&
                                    <Text style={styles.cellWithPadding}>{i18n.t("notsale")}</Text>
                                }
                                {filteredItem.price != 0 &&
                                    <Text style={styles.cellWithPadding}>{filteredItem.price}</Text>
                                }
                            </View>
                        ))}
                    </>
                )}

                {filteredItems3[0] != null && (
                    <>
                        <Text style={styles.text_top}>
                            {carname} : {i18n.t("grille")}
                        </Text>
                        <View style={styles.header}>
                            <Text style={styles.heading}>{i18n.t("code")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("name")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("price")}</Text>
                        </View>

                        {filteredItems3.map((filteredItem) => (
                            <View key={filteredItem._id} style={styles.row}>
                                <Text style={styles.cell}>{filteredItem.code}</Text>
                                <Text style={styles.cellWithPadding}>{filteredItem.name}</Text>
                                {filteredItem.price == 0 &&
                                    <Text style={styles.cellWithPadding}>{i18n.t("notsale")}</Text>
                                }
                                {filteredItem.price != 0 &&
                                    <Text style={styles.cellWithPadding}>{filteredItem.price}</Text>
                                }
                            </View>
                        ))}
                    </>
                )}

                {filteredItems4[0] != null && (
                    <>
                        <Text style={styles.text_top}>
                            {carname} : {i18n.t("headlamp")}
                        </Text>
                        <View style={styles.header}>
                            <Text style={styles.heading}>{i18n.t("code")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("name")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("price")}</Text>
                        </View>
                        {filteredItems4.map((filteredItem) => (
                            <View key={filteredItem._id} style={styles.row}>
                                <Text style={styles.cell}>{filteredItem.code}</Text>
                                <Text style={styles.cellWithPadding}>{filteredItem.name}</Text>
                                {filteredItem.price == 0 &&
                                    <Text style={styles.cellWithPadding}>{i18n.t("notsale")}</Text>
                                }
                                {filteredItem.price != 0 &&
                                    <Text style={styles.cellWithPadding}>{filteredItem.price}</Text>
                                }
                            </View>
                        ))}
                    </>
                )}

                {filteredItems5[0] != null && (
                    <>
                        <Text style={styles.text_top}>
                            {carname} : {i18n.t("backuplamp")}
                        </Text>
                        <View style={styles.header}>
                            <Text style={styles.heading}>{i18n.t("code")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("name")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("price")}</Text>
                        </View>
                        {filteredItems5.map((filteredItem) => (
                            <View key={filteredItem._id} style={styles.row}>
                                <Text style={styles.cell}>{filteredItem.code}</Text>
                                <Text style={styles.cellWithPadding}>{filteredItem.name}</Text>
                                {filteredItem.price == 0 &&
                                    <Text style={styles.cellWithPadding}>{i18n.t("notsale")}</Text>
                                }
                                {filteredItem.price != 0 &&
                                    <Text style={styles.cellWithPadding}>{filteredItem.price}</Text>
                                }
                            </View>
                        ))}
                    </>
                )}
                {filteredItems6[0] != null && (
                    <>
                        <Text style={styles.text_top}>
                            {carname} : {i18n.t("door")}
                        </Text>
                        <View style={styles.header}>
                            <Text style={styles.heading}>{i18n.t("code")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("name")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("price")}</Text>
                        </View>
                        {filteredItems6.map((filteredItem) => (
                            <View key={filteredItem._id} style={styles.row}>
                                <Text style={styles.cell}>{filteredItem.code}</Text>
                                <Text style={styles.cellWithPadding}>{filteredItem.name}</Text>
                                {filteredItem.price == 0 &&
                                    <Text style={styles.cellWithPadding}>{i18n.t("notsale")}</Text>
                                }
                                {filteredItem.price != 0 &&
                                    <Text style={styles.cellWithPadding}>{filteredItem.price}</Text>
                                }
                            </View>
                        ))}
                    </>
                )}
                {filteredItems7[0] != null && (
                    <>
                        <Text style={styles.text_top}>
                            {carname} : {i18n.t("mirror")}
                        </Text>
                        <View style={styles.header}>
                            <Text style={styles.heading}>{i18n.t("code")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("name")}</Text>
                            <Text style={styles.headingPadding}>{i18n.t("price")}</Text>
                        </View>
                        {filteredItems7.map((filteredItem) => (
                            <View key={filteredItem._id} style={styles.row}>
                                <Text style={styles.cell}>{filteredItem.code}</Text>
                                <Text style={styles.cellWithPadding}>{filteredItem.name}</Text>
                                {filteredItem.price == 0 &&
                                    <Text style={styles.cellWithPadding}>{i18n.t("notsale")}</Text>
                                }
                                {filteredItem.price != 0 &&
                                    <Text style={styles.cellWithPadding}>{filteredItem.price}</Text>
                                }
                            </View>
                        ))}
                    </>
                )}
                <View style={{ marginBottom: 20 }}></View>
            </ScrollView>
            <View
                style={{ borderColor: "black", borderBottomWidth: 1, marginBottom: 20 }}
            ></View>
            <Text
                style={{
                    fontFamily: "PakkadThin",
                    textAlign: "center",
                    marginBottom: 20,
                    fontSize: 16,
                }}
            >
                {i18n.t("total")} {price.toFixed(2)} {i18n.t("baht")}
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.save_btn} onPress={() => navigation.navigate("HomeScreen")}
                >
                    <Text
                        style={{
                            fontFamily: "PakkadThin",
                            fontSize: 16,
                            color: "black",
                            textAlign: "center",
                        }}
                    >
                        {i18n.t("back")}
                    </Text>
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
        fontSize: 16,
        color: "black",
        textAlign: "center",
    },

    text_top: {
        fontFamily: "PakkadThin",
        fontSize: 14,
        color: "black",
        textAlign: "left",
        left: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    heading: {
        fontFamily: "PakkadThin",
        fontSize: 12,
        color: "black",
        flex: 1,
    },
    headingPadding: {
        fontFamily: "PakkadThin",
        fontSize: 12,
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
        padding: 10,
        marginTop: -10,
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
    save_btn: {
        alignItems: "center",
        justifyContent: "center",
        width: 150,
        height: 40,
        padding: 5,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
    },

    buttonContainer: {
        alignItems: "center",
        bottom: 0,
        width: "100%",
        marginBottom: 20,
    },
});

export default CarPartListScreen;
