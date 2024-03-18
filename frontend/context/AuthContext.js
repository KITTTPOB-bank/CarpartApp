import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { BASE_URL } from '../config';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const register = async (email, password) => {
        setIsLoading(true);
        await axios
            .post(`${BASE_URL}/register`, {
                email,
                password,
            })
            .then(res => {
                let token = res.data.token;
                AsyncStorage.setItem('token', token);
                setIsLoading(false);
                console.log(userInfo);
            })
            .catch(e => {
                console.log(`register error ${e}`);
                setIsLoading(false);
            });
    };

    const login = async (email, password) => {

        setIsLoading(true);
        await axios
            .post(`${BASE_URL}/login`, {
                email,
                password,
            })
            .then(res => {
                let token = res.data.token;

                AsyncStorage.setItem('token', token);


                setIsLoading(false);
            })
            .catch(error => {
                Alert.alert("ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบอีเมลและรหัสผ่านของคุณ");
            });
    };



    return (
        <AuthContext.Provider
            value={{
                register,
                login,
            }}>
            {children}
        </AuthContext.Provider>
    );
};


