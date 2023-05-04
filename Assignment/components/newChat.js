import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
export default class NewChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };
        this.startChat = this.startChat.bind(this);
    }

    startChat = async () => {
        const navigation = this.props.navigation;

        let toSend = {
            name: this.state.name,
        };

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
                navigation.navigate('HomePage')
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response && error.response.data);
            })
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>Whats That</Text>


                    <View style={styles.Iconleft}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.newChatContainer}>
                    <Text style={styles.heading}>Enter the chat name:</Text>
                    <TextInput
                        style={styles.chatStyle}
                        placeholder="Chat name"
                        onChangeText={name => this.setState({ name })}
                        value={this.state.name}
                        placeholderTextColor="gray"
                    />
                    <TouchableOpacity style={styles.button} onPress={this.startChat}>
                        <Text style={styles.buttonText}>Start Chat</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: '100%',
        backgroundColor: '#075e54',
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 30,
    },
    Iconleft: {
        position: 'absolute',
        top: 0,
        left: 0,
        marginLeft: 15,
        marginTop: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    newChatContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatStyle: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '70%',
        height: 50,
        width: 200,
        paddingHorizontal: 5,
        color: 'black',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#c8ada4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});