import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

class NewChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };
        this.startChat = this.startChat.bind(this);
    }

    startChat = async () => {

        let toSend = {
            name: this.state.name,
        };

        console.log("HERE", toSend)
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
            body: JSON.stringify(toSend)
        })
            .then(async (response) => {
                const responseJson = await response.json();
                console.log(responseJson)
                await AsyncStorage.setItem('@chat_id', responseJson.chat_id)


            })
            .catch((error) => {
                console.log(error);
                console.log(error.response && error.response.data);
            })
    }






    render() {
        return (
            <View style={styles.container}>
                <Text>Enter The Chat Name</Text>
                <TextInput style={styles.chatStyle}
                    placeholder=""
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                    placeholderTextColor="gray"
                />

                <TouchableOpacity
                    onPress={this.startChat}>
                    <Text>start chat</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default NewChat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    chatStyle: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        height: 50,
        marginVertical: '2%',
        paddingHorizontal: 5,
        color: 'black',
    },

})