import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal, Pressable } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import moment from "moment";
export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            name: '',
            modalVisible: false,
            isLoading: false,
            user_id: '',
            limit: 20,
            offset: 0,
            message: '',
            chatData: [],
        };
        this.sendText = this.sendText.bind(this);
    }

    getChat = async () => {
        try {
            const userId = await AsyncStorage.getItem('@user_id');
            this.setState({ userId });
            const item = this.props.route.params;

            const limit = this.state.limit;
            const offset = this.state.offset;
            const chatData = this.state.chatData;
            let response = await fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "&limit=" + limit + "&offset=" + offset, {
                method: 'GET',
                headers: {
                    'X-Authorization': await AsyncStorage.getItem('@session_token'),
                },
            });
            let json = await response.json();

            this.setState({
                isLoading: false,
                chatData: json,
            });
        }
        catch (error) {
            console.log(error);
        }
    };
    componentDidMount() {
        this.getChat();
    }


    // update user info
    updateChat = async () => {
        const item = this.props.route.params;

        let toSend = {
            name: this.state.name,
        };

        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
            body: JSON.stringify(toSend)
        })
            .then((response) => {
                console.log('chat updated')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    addContact = async (user_id) => {
        const item = this.props.route.params;
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/user/" + user_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
        })
            .then((response) => {
                console.log('successs')

            })
            .catch((error) => {
                console.log(error);
            })
    }

    removeContact = async (user_id) => {
        const item = this.props.route.params;
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/user/" + user_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
        })
            .then((response) => {
                console.log("remove deleted");
            })
            .catch((error) => {
                console.log(error);
            })
    }

    sendText = async () => {
        const item = this.props.route.params;
        let toSend = {
            message: this.state.message
        };
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/message", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
            body: JSON.stringify(toSend)
        })
            .then((response) => {
                this.getChat();

            })
            .then((response) => {
                console.log('successs')

            })
            .catch((error) => {
                console.log(error);
            })
    }


    render() {
        const navigation = this.props.navigation;
        const { modalVisible } = this.state;

        const { route } = this.props;
        const chatName = route.params.chatName;
        const item = this.props.route.params;


        const { chatData, user_id } = this.state;

        return (
            <View style={styles.container}>



                <View style={styles.header}>
                    <Text style={styles.headerText}>{item.item.name}</Text>

                    <View style={styles.Iconleft}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.Icon}>
                        <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
                            <Text style={{ fontSize: 25 }}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.chatContainer}>

                    <FlatList
                        data={chatData.messages}
                        renderItem={({ item }) => {
                            const { userId } = this.state;
                            const sender = item.author.user_id;
                            console.log(userId);
                            const isSentByCurrentUser = parseInt(sender) === parseInt(userId);
                            const messageStyle = isSentByCurrentUser ? styles.rightMessage : styles.leftMessage;

                            // console.log(isSentByCurrentUser)
                            // console.log(sender)

                            console.log(item.message + ' ' + userId)
                            return (
                                <View style={[styles.messageContainer, messageStyle]}>
                                    <Text style={styles.messageText}>
                                        {item.message}
                                    </Text>
                                </View>
                            );
                        }}
                        keyExtractor={(item) => item.message_id.toString()}
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.messageInput}
                            onChangeText={message => this.setState({ message })}
                            placeholder='Enter text here ....'
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={() => this.sendText()}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* model View */}
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            this.setState({ modalVisible: !modalVisible });
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>

                                <TextInput
                                    placeholder={chatName}
                                    placeholderTextColor="gray"
                                    onChangeText={name => this.setState({ name })} />
                                <TouchableOpacity style={styles.button} onPress={this.updateChat}>
                                    <Text style={styles.buttonText}>Save changes</Text>
                                </TouchableOpacity>

                                <TextInput
                                    placeholder='Search for user'
                                    placeholderTextColor="gray"
                                    onChangeText={user_id => this.setState({ user_id })} />

                                <TouchableOpacity style={styles.button} onPress={() => this.addContact(this.state.user_id)}>
                                    <Text style={styles.buttonText}>Add Contact</Text>
                                </TouchableOpacity>

                                <TextInput
                                    placeholder='Search for user to remove'
                                    placeholderTextColor="gray"
                                    onChangeText={user_id => this.setState({ user_id })} />

                                <TouchableOpacity style={styles.button} onPress={() => this.removeContact(this.state.user_id)}>
                                    <Text style={styles.buttonText}>remove Contact</Text>
                                </TouchableOpacity>


                                <FlatList
                                    data={this.state.chatData.members}
                                    renderItem={({ item }) => (
                                        <View>
                                            <Text>{item.first_name} {item.last_name}</Text>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />

                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => this.setState({ modalVisible: !modalVisible })}>
                                    <Text style={styles.textStyle}>Done</Text>
                                </Pressable>

                            </View>
                        </View>
                    </Modal>
                </View >
            </View >
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    Iconleft: {
        position: 'absolute',
        top: 0,
        left: 0,
        marginLeft: 15,
        marginTop: 10,
    },
    Icon: {
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 15,
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#075e54',
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 30,

    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        left: 0,
        right: 0,
    },
    messageInput: {
        flex: 1,
        height: 43,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: 'light-grey',
        borderRadius: 20,
    },
    sendButton: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#128c7f',
        borderRadius: 20,
        alignSelf: 'flex-end', // added to move button to the right side
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
    chatBubble: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxWidth: '80%',
        marginBottom: 4, // added to create space between chat bubbles
    },
    leftBubble: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-start',
    },
    rightBubble: {
        backgroundColor: 'white',
        alignSelf: 'flex-end',
    },
    centeredView: {
        justifyContent: 'center',
        alignitems: 'stretch',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

    messageContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
    },
    leftMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
    },
    rightMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C5',
    },
});

// sort chat out, able to see chat but need to sort it foir when another user sends you a message
// sort out removing a memeber
