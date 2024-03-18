import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from '../component/Button';
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';

const TakePhotoScreen = () => {

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();

    const typecheck = route.params?.type

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                setImage(data.uri);
            } catch (error) {
                console.log(error);
            }
        }
    };
    const copyFile = async (from, to) => {
        await FileSystem.copyAsync({ from, to });
    };

    const generateUniqueFileName = (originalName) => {
        const timestamp = new Date().getTime();
        const extension = originalName.split('.').pop();
        return `${timestamp}.${extension}`;
    };

    const back = async () => {
        if (typecheck == 'front' || typecheck == 'back' || typecheck == 'rear') {
            navigation.navigate("SelectPhotoAll")
        }
        else {
            navigation.navigate("SelectPhotoPart")
        }
    }

    const savePicture = async () => {
        if (image) {
            try {
                const originalFileName = 'car.jpg';
                const uniqueFileName = generateUniqueFileName(originalFileName);
                const localUri = `${FileSystem.documentDirectory}${uniqueFileName}`;
                await copyFile(image, localUri);
                await MediaLibrary.createAssetAsync(localUri, {
                    mediaType: 'photo',
                    mimeType: 'image/jpg',
                });

                setImage(null);
                if (typecheck == 'front' || typecheck == 'back' || typecheck == 'rear') {
                    navigation.navigate("SelectPhotoAll", {
                        savedImage: localUri, typeback: typecheck
                    });
                }
                else {
                    navigation.navigate("SelectPhotoPart", {
                        savedImage: localUri, typeback: typecheck
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {!image ? (
                <Camera
                    style={styles.camera}
                    type={type}
                    ref={cameraRef}
                    flashMode={flash}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 30,
                        }}
                    >
                        <Button
                            onPress={() => back()}
                            icon="back"
                        />


                        <Button
                            onPress={() =>
                                setFlash(
                                    flash === Camera.Constants.FlashMode.off
                                        ? Camera.Constants.FlashMode.on
                                        : Camera.Constants.FlashMode.off
                                )
                            }
                            icon="flash"
                            color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
                        />
                    </View>
                </Camera>
            ) : (
                <Image source={{ uri: image }} style={styles.camera} />
            )}

            <View style={styles.controls}>
                {image ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 50,
                        }}
                    >
                        <Button
                            title="ถ่ายใหม่"
                            onPress={() => setImage(null)}
                            icon="retweet"

                        />
                        <Button title="บันทึก" onPress={savePicture} icon="check" />
                    </View>
                ) : (
                    <Button title="ถ่ายรูป" onPress={takePicture} icon="camera" />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#000',
        padding: 8,
    },
    controls: {
        flex: 0.5,
    },
    button: {
        height: 40,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: '#E9730F',
        marginLeft: 10,
    },
    camera: {
        flex: 5,
        borderRadius: 20,
    },
    topControls: {
        flex: 1,
    },
});
export default TakePhotoScreen;
