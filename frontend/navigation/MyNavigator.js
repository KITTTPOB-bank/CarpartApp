import React, { useContext, useState } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { useFonts } from "expo-font";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";

import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import TakePhotoAllCarScreen from "../screens/TakePhotoAllCarScreen";
import TakePhotoCarPartScreen from "../screens/TakePhotoCarPartScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SelectPhotoPart from "../screens/SelectPhotoPart";
import SelectPhotoAll from "../screens/SelectPhotoAll";
import ResultScreen from "../screens/ResultScreen";
import ResultPartsScreen from "../screens/ResultPartsScreen";
import RegisScreen from "../screens/RegisScreen";
import PartListScreen from "../screens/PartList";
import TakePhotoScreen from "../screens/TakePhotoScreen";
import TakePhotoSelectScreen from "../screens/TakePhotoSelectScreen";
import HelpToggleScreen from "../screens/HelpToggleScreen";
import HelpTogglePartScreen from "../screens/HelpTogglePartScreen";
import HaveCarScreen from "../screens/HaveCarScreen";
import SearchCarScreen from "../screens/SearchCarScreen";
import PartListItemScreen from "../screens/PartListItem";
import CreateHistoryScreen from "../screens/CreateHistory";
import ForgotPassScreen from "../screens/ForgotPassScreen";
import AboutScreen from "../screens/AboutScreen";
import ResetPassScreen from "../screens/ResetPassScreen";
import CarPartListScreen from "../screens/CarPartListScreen";
import SeePartCarList from "../screens/SeePartCarList";

import { MyContext } from "../context/MyContext";
import { FA5Style } from "@expo/vector-icons/build/FontAwesome5";

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "../component/textlanguage";

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;


//Stack
const Stack = createStackNavigator();

function MyStackNavigator() {
  const { globalValue2, setGlobalValue2 } = useContext(MyContext);

  const [fontsLoaded] = useFonts({
    PakkadThin: require("../assets/fonts/PakkadThin.ttf"),
  });


  if (!fontsLoaded) {
    return "";
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2D58AD",
          },
          headerTitleStyle: {
            color: "white",
            fontFamily: "PakkadThin",
            fontSize: 24,
            marginLeft: -25,
          },
          headerTitleAlign: "left",
          headerBackTitleVisible: false,
          headerTintColor: "black",
        }}
      >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={PartListDrawerNavigator}
          options={({ route }) => ({
            title: "",
            headerShown: getFocusedRouteNameFromRoute(route) === "หน้าหลัก",
          })}
        />
        <Stack.Screen
          name="TakePhotoAllCarScreen"
          component={TakePhotoAllCarScreen}
          options={{
            title: i18n.t("takephotocar"),
          }}
        />
        <Stack.Screen
          name="TakePhotoCarPartScreen"
          component={TakePhotoCarPartScreen}
          options={{
            title: i18n.t("takephotocarpart"),
          }}
        />
        <Stack.Screen
          name="HistoryTopTabNavigator"
          component={HistoryTopTabNavigator}
          options={{
            title: i18n.t("lists"),
          }}
        />
        <Stack.Screen
          name="SeePartCarList"
          component={SeePartCarList}
          options={{
            title: i18n.t("carpartlists"),
          }}
        />
        <Stack.Screen
          name="CarPartListScreen"
          component={CarPartListScreen}
          options={{
            title: i18n.t("carpartlists"),
          }}
        />
        <Stack.Screen
          name="SelectPhotoPart"
          component={SelectPhotoPart}
          options={{
            title: "เลือกรูปภาพชิ้นส่วน"+globalValue2,
          }}
        />
        <Stack.Screen
          name="SelectPhotoAll"
          component={SelectPhotoAll}
          options={{
            title: "เลือกรูปภาพรถยนต์",
          }}
        />
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={{
            title: i18n.t("processresult"),
            headerLeft: null,
            headerTitleStyle: {
              marginLeft: 10,
              fontFamily: "PakkadThin",
              color: "white",
              fontSize: 24,
            },
          }}
        />
        <Stack.Screen
          name="ResultPartsScreen"
          component={ResultPartsScreen}
          options={{
            title: "รายการอะไหล่",
          }}
        />
        <Stack.Screen
          name="RegisScreen"
          component={RegisScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassScreen"
          component={ForgotPassScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SearchCarScreen"
          component={SearchCarScreen}
          options={{
            title: i18n.t("search"),    
          }}
        />
        <Stack.Screen
          name="AboutScreen"
          component={AboutScreen}
          options={{
            title: i18n.t("about"),
          }}
        />
        <Stack.Screen
          name="ResetPassScreen"
          component={ResetPassScreen}
          options={{
            title: i18n.t("edit"),
          }}
        />
        <Stack.Screen
          name="TakePhotoScreen"
          component={TakePhotoScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TakePhotoSelectScreen"
          component={TakePhotoSelectScreen}
          options={{
            title: i18n.t("photo"),
            fontFamily: "PakkadThin"
          }}
        />
        <Stack.Screen
          name="PartListItemScreen"
          component={PartListItemScreen}
          options={{
            title: "รายการอะไหล่",
          }}
        />
        <Stack.Screen
          name="PartListDrawerNavigator"
          component={PartListDrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HelpToggleScreen"
          component={HelpToggleScreen}
          options={{
            title: i18n.t("howtophoto"),
          }}
        />
        <Stack.Screen
          name="HelpTogglePartScreen"
          component={HelpTogglePartScreen}
          options={{
            title: i18n.t("howtophoto"),
          }}
        />
        <Stack.Screen
          name="HistoryScreen"
          component={HistoryScreen}
          options={{
            title: i18n.t("list"),
          }}
        />

        <Stack.Screen
          name="HaveCarScreen"
          component={HaveCarScreen}
          options={{
            title: i18n.t("carhave"),
          }}
        />

        <Stack.Screen
          name="CreateHistoryScreen"
          component={CreateHistoryScreen}
          options={{
            title: i18n.t("bill"),
          }}
        />
      </Stack.Navigator>
    </>
  );
}

//Top Tab
const TopTab = createMaterialTopTabNavigator();
function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{
              flex: 1,
              backgroundColor: "white",
              borderColor: isFocused ? "#2D58AD" : "white",
              borderWidth: 2,
              padding: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontFamily: "PakkadThin",
                color: isFocused ? "#2D58AD" : "black",
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

//Tob Tab
function HistoryTopTabNavigator() {
  return (
    <TopTab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        swipeEnabled: false,
      }}
    >
      <TopTab.Screen
        name={i18n.t("list")}
        component={HistoryScreen}
        options={{
          tabBarActiveTintColor: "#000",
          tabBarLabel: i18n.t("list"),
        }}
      ></TopTab.Screen>
      <TopTab.Screen
        name={i18n.t("carhave")}
        component={HaveCarScreen}
        options={{
          tabBarActiveTintColor: "#000",
          tabBarLabel: i18n.t("carhave"),
        }}
      ></TopTab.Screen>
    </TopTab.Navigator>
  );
}

function CustomDrawerContent(props) {
  const { globalValue, setGlobalValue } = useContext(MyContext);
  const { globalValue1, setGlobalValue1 } = useContext(MyContext);

  const handlePress = () => {
    if (globalValue1 && globalValue == false) {
      setGlobalValue(true);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      {globalValue1 && (
        <>
          <TouchableOpacity
            onPress={handlePress}
            style={{
              textAlign: "center",
              top: 180,
              left: 15,
              borderRadius: 50,
              backgroundColor: "white",
              width: 255,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                name="car"
                size={24}
                color="black"
                style={{ marginRight: 85 }}
              />
              <Text
                style={{
                  color: "black",
                  fontFamily: "PakkadThin",
                  fontSize: 18,
                  left: -55,
                }}
              >
                {i18n.t("carpart")}
              </Text>
              <AntDesign name="down" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </>
      )}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function PartListDrawerNavigator() {
  const { globalValue, setGlobalValue } = useContext(MyContext);
  const { globalValue1, setGlobalValue1 } = useContext(MyContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerItemStyle: { borderRadius: 50 },
        drawerInactiveTintColor: "black",
        drawerStyle: {
          backgroundColor: "white",
        },
        headerTitleAlign: "left",
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#2D58AD",
        },
        headerTitleStyle: {
          fontFamily: "PakkadThin",
          fontSize: 22
        }
        
      }}
    >
      <Drawer.Screen
        name={i18n.t("home")}
        component={HomeScreen}
        options={{
          drawerLabelStyle: { fontSize: 18, fontFamily: "PakkadThin" },
          drawerActiveBackgroundColor: "#2D58AD",
          headerTitle: "",
          drawerActiveTintColor: "white",
          drawerIcon: ({ color, size }) => (
            <FontAwesome
              name="home"
              size={size}
              color={color}
              style={{ marginLeft: 20 }}
            />
          ),
        }}
      ></Drawer.Screen>
      {!globalValue1 && (
        <>
          <Drawer.Screen
            name={i18n.t("search")}
            component={SearchCarScreen}
            options={{
              drawerLabelStyle: { fontSize: 18, fontFamily: "PakkadThin" },
              drawerActiveBackgroundColor: "#2D58AD",
              drawerActiveTintColor: "white",
              drawerIcon: ({ color, size }) => (
                <AntDesign
                  name="search1"
                  size={size}
                  color={color}
                  style={{ marginLeft: 20 }}
                />
              ),
            }}
          ></Drawer.Screen>

          <Drawer.Screen
            name={i18n.t("photo")}
            component={TakePhotoSelectScreen}
            options={{
              drawerLabelStyle: { fontSize: 18, fontFamily: "PakkadThin" },
              drawerActiveBackgroundColor: "#2D58AD",
              drawerActiveTintColor: "white",
              drawerIcon: ({ color, size }) => (
                <MaterialIcons
                  name="photo-camera"
                  size={size}
                  color={color}
                  style={{ marginLeft: 20 }}
                />
              ),
            }}
          ></Drawer.Screen>

          <Drawer.Screen
            name={i18n.t("lists")}
            component={HistoryTopTabNavigator}
            options={{
              drawerLabelStyle: { fontSize: 18, fontFamily: "PakkadThin" },
              drawerActiveBackgroundColor: "#2D58AD",
              drawerActiveTintColor: "white",
              drawerIcon: ({ color, size }) => (
                <Feather
                  name="list"
                  size={size}
                  color={color}
                  style={{ marginLeft: 20 }}
                />
              ),
            }}
          ></Drawer.Screen>

          <Drawer.Screen
            name={i18n.t("logout")}
            component={LoginScreen}
            options={{
              drawerLabelStyle: { fontSize: 18, fontFamily: "PakkadThin" },
              drawerActiveBackgroundColor: "#2D58AD",
              drawerActiveTintColor: "white",
              drawerIcon: ({ color, size }) => (
                <MaterialIcons
                  name="logout"
                  size={size}
                  color={color}
                  style={{ marginLeft: 20 }}
                />
              ),
              headerShown: false,
            }}
          ></Drawer.Screen>
        </>
      )}
      {globalValue1 && (
        <>
          <Drawer.Screen
            name={i18n.t("summary")}
            component={PartListScreen}
            options={{
              drawerLabelStyle: { fontSize: 18, fontFamily: "PakkadThin" },
              drawerActiveBackgroundColor: "#2D58AD",
              drawerActiveTintColor: "white",
              // เพิ่มไอคอนข้างๆ รายการ "หน้าแรก"
              drawerIcon: ({ color, size }) => (
                <Feather
                  name="list"
                  size={size}
                  color={color}
                  style={{ marginLeft: 20 }}
                />
              ),
            }}
          ></Drawer.Screen>

          <Drawer.Screen
            name={i18n.t("carpart")}
            component={PartListScreen}
            options={{
              drawerLabelStyle: { fontSize: 18, fontFamily: "PakkadThin" },
              drawerIcon: ({ color, size }) => (
                <FontAwesome
                  name="car"
                  size={size}
                  color={color}
                  style={{ marginLeft: 20 }}
                />
              ),
              onPress: () => setIsPartListHidden(!isPartListHidden),
            }}
          ></Drawer.Screen>
        </>
      )}
      {globalValue && (
        <>
          <Drawer.Screen
            name={i18n.t("frontbumperpart")}
            initialParams={{ key: "frontbumper" }}
            component={PartListItemScreen}
            options={{
              drawerLabelStyle: {
                fontSize: 12,
                fontFamily: "PakkadThin",
                marginLeft: 100,
              },
              headerTitle: i18n.t("partlist"),
              drawerActiveBackgroundColor: "white",
              drawerActiveTintColor: "#2D58AD",
            }}
          ></Drawer.Screen>

          <Drawer.Screen
            name={i18n.t("rearbumperpart")}
            component={PartListItemScreen}
            initialParams={{ key: "backbumper" }}
            options={{
              drawerLabelStyle: {
                fontSize: 12,
                fontFamily: "PakkadThin",
                marginLeft: 100,
              },
              headerTitle: i18n.t("partlist"),
              drawerActiveBackgroundColor: "white",
              drawerActiveTintColor: "#2D58AD",
            }}
          ></Drawer.Screen>
          <Drawer.Screen
            name={i18n.t("grillepart")}
            component={PartListItemScreen}
            initialParams={{ key: "grille" }}
            options={{
              drawerLabelStyle: {
                fontSize: 12,
                fontFamily: "PakkadThin",
                marginLeft: 100,
              },
              headerTitle: i18n.t("partlist"),
              drawerActiveBackgroundColor: "white",
              drawerActiveTintColor: "#2D58AD",
            }}
          ></Drawer.Screen>
          <Drawer.Screen
            name={i18n.t("headlamppart")}
            component={PartListItemScreen}
            initialParams={{ key: "headlight" }}
            options={{
              drawerLabelStyle: {
                fontSize: 12,
                fontFamily: "PakkadThin",
                marginLeft: 100,
              },
              headerTitle: i18n.t("partlist"),
              drawerActiveBackgroundColor: "white",
              drawerActiveTintColor: "#2D58AD",
            }}
          ></Drawer.Screen>
          <Drawer.Screen
            name={i18n.t("backuplamppart")}
            component={PartListItemScreen}
            initialParams={{ key: "backlight" }}
            options={{
              drawerLabelStyle: {
                fontSize: 12,
                fontFamily: "PakkadThin",
                marginLeft: 100,
              },
              headerTitle: i18n.t("partlist"),
              drawerActiveBackgroundColor: "white",
              drawerActiveTintColor: "#2D58AD",
            }}
          ></Drawer.Screen>
          <Drawer.Screen
            name={i18n.t("doorpart")}
            component={PartListItemScreen}
            initialParams={{ key: "door" }}
            options={{
              drawerLabelStyle: {
                fontSize: 12,
                fontFamily: "PakkadThin",
                marginLeft: 100,
              },
              headerTitle: i18n.t("partlist"),
              drawerActiveBackgroundColor: "white",
              drawerActiveTintColor: "#2D58AD",
            }}
          ></Drawer.Screen>
          <Drawer.Screen
            name={i18n.t("mirrorpart")}
            component={PartListItemScreen}
            initialParams={{ key: "mirror" }}
            options={{
              drawerLabelStyle: {
                fontSize: 12,
                fontFamily: "PakkadThin",
                marginLeft: 100,
              },
              headerTitle: i18n.t("partlist"),
              drawerActiveBackgroundColor: "white",
              drawerActiveTintColor: "#2D58AD",
            }}
          ></Drawer.Screen>
        </>
      )}
    </Drawer.Navigator>
  );
}

export default function Mynavigator() {
  return (
    <NavigationContainer>
      <MyStackNavigator />
    </NavigationContainer>
  );
}
