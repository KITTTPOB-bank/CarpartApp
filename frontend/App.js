import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import MyNavigator from "./navigation/MyNavigator";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import TakePhotoAllCar from "./screens/TakePhotoAllCarScreen";
import { AuthProvider } from './context/AuthContext';
import { MyProvider } from "./context/MyContext";
export default function App() {
  return (
    <AuthProvider>
      <MyProvider>

        <MyNavigator />
      </MyProvider>

    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
