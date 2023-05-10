import { Camera, CameraType, onCameraReady, CameraPictureOptions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraSendToServer() {
    const navigation = useNavigation();
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camera, setCamera] = useState(null);

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
        console.log("Camera: ", type)
    }

    async function takePhoto() {
        if (camera) {
            const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) }
            const data = await camera.takePictureAsync(options)
        }
    }

    async function sendToServer(data) {
        console.log("HERE", data.uri)

        let id = 10;
        let token = "token here";

        let res = await fetch(data.uri);
        let blob = await res.blob()

        //network request here
        //contenttype image/png


        const userId = await AsyncStorage.getItem('@user_id');
        return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + userId + "/photo", {
            method: 'POST',
            headers: {
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
                'Content-Type': 'image/png'
            },
            body: blob,
        })

            .then(async (response) => {
                console.log("pic taken")
            })
            .catch((error) => {
                console.log(error)
            })
    }

    if (!permission || !permission.granted) {
        return (<Text>No access to camera</Text>)
    } else {
        return (
            <View style={styles.container}>
                <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}>

                    <View style={styles.Iconleft}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={takePhoto}>
                            <Text style={styles.text}>Take Photo</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    Iconleft: {
        position: 'absolute',
        top: 0,
        left: 0,
        marginLeft: 15,
        marginTop: 10,
    },
    buttonContainer: {
        alignSelf: 'flex-end',
        padding: 5,
        margin: 5,
        backgroundColor: 'steelblue'
    },
    button: {
        width: '100%',
        height: '100%'
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ddd'
    }
})

