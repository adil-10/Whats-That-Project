import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class DisplayImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photo: null,
            isLoading: true
        }
    }

    componentDidMount() {
        this.get_profile_image()
    }

    async get_profile_image() {
        const userId = await AsyncStorage.getItem('@user_id');
        fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/photo", {
            method: "GET",
            headers: {
                'Accept': 'image/png',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            }
        })
            .then((res) => {
                return res.blob()
            })
            .then((resBlob) => {
                let data = URL.createObjectURL(resBlob);

                this.setState({
                    photo: data,
                    isLoading: false
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }



    render() {
        if (this.state.photo) {
            return (
                <View style={styles.container}>
                    <Image
                        source={{
                            uri: this.state.photo
                        }}
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </View>

            )
        } else {
            return (<Text>Loading</Text>)
        }
    }
}
const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 200,
        borderRadius: 150,
        overflow: "hidden",
        marginVertical: '15%',
        color: 'black',
        textAlign: 'center',
        justifyContent: 'center',
    },
});