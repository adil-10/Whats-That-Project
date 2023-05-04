import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal, Pressable } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

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
            userData: [],
            expandedMessageId: null,
            selectedMessageId: null,
            editText: '',
            expanded: false,
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
        this.displayContacts();
    }

    // update user info
    updateChatinfo = async () => {
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

    deleteChat = async (message_id) => {
        const item = this.props.route.params;
        console.log(message_id)
        const { chatData } = this.state;

        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/message/" + message_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
        })
            .then((response) => {
                console.log("chat deleted");
                this.getChat();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // update user info
    updateChat = async (message_id) => {
        console.log(this.state.message)
        const item = this.props.route.params;
        const message = this.state.message;
        const { chatData } = this.state;
        let toSend = {
            message: this.state.message,
        };

        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/message/" + message_id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
            body: JSON.stringify(toSend)
        })
            .then((response) => {
                console.log('chat updated')
                this.getChat();
                console.log(message)
            })

            .catch((error) => {
                console.log(error)
            })
    }

    //display user data
    displayContacts = async () => {
        try {
            let response = await fetch("http://127.0.0.1:3333/api/1.0.0/contacts", {
                method: 'GET',
                headers: {
                    'X-Authorization': await AsyncStorage.getItem('@session_token'),
                },
            });
            let json = await response.json();
            this.setState({
                isLoading: false,
                userData: json,
            });
        }
        catch (error) {
            console.log(error);
        }
    };

    toggleExpanded(messageId) {
        const { chatData } = this.state;
        const index = chatData.messages.findIndex((item) => item.message_id === messageId);
        chatData.messages[index].editable = !chatData.messages[index].editable;
        this.setState({ chatData, expanded: !this.state.expanded });
    }



    render() {
        const navigation = this.props.navigation;
        const { modalVisible } = this.state;

        const { route } = this.props;
        const { expanded } = this.state;
        const chatName = route.params.chatName;
        const item = this.props.route.params;

        const { chatData } = this.state;

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
                        inverted
                        data={chatData.messages}
                        renderItem={({ item }) => {
                            const { userId } = this.state;
                            const sender = item.author.user_id;

                            const isSentByCurrentUser = parseInt(sender) === parseInt(userId);
                            const messageStyle = isSentByCurrentUser ? styles.rightMessage : styles.leftMessage;

                            const editText = item.message;

                            return (
                                <View>
                                    {!expanded ? (
                                        <TouchableOpacity onPress={() => this.toggleExpanded(item.message_id)}>
                                            <View style={[styles.messageContainer, messageStyle]}>
                                                <Text style={styles.messageText}>{editText}</Text>
                                                <View style={styles.stampStyle}>
                                                    <Text style={styles.authorText}>
                                                        {item.author.first_name} {item.author.last_name}
                                                    </Text>
                                                    <Text style={styles.expandButton}>
                                                        {expanded ? '' : ''}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={[styles.messageContainer, messageStyle]}>
                                            <TextInput
                                                style={styles.messageText}
                                                placeholder={editText}
                                                onChangeText={(text) => this.setState({ message: text })}
                                            />
                                            <View style={styles.stampStyle}>
                                                <Text style={styles.authorText}>
                                                    {item.author.first_name} {item.author.last_name}
                                                </Text>
                                                <Text style={styles.expandButton}>
                                                    {expanded ? '' : ''}
                                                </Text>
                                            </View>
                                            <View>
                                                <TouchableOpacity onPress={() => this.updateChat(item.message_id, this.state.editText)}>
                                                    <Text>Save</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.deleteChat(item.message_id)}>
                                                    <Text>Delete</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
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
                        <View style={[styles.centeredView, { flex: 1 }]}>

                            <View style={styles.modalView}>
                                <View style={styles.inputViewContainer}>
                                    <TextInput
                                        style={styles.modelViewText}
                                        placeholder={item.item.name}
                                        placeholderTextColor="gray"
                                        onChangeText={name => this.setState({ name })} />
                                    <TouchableOpacity style={styles.saveButton} onPress={this.updateChatinfo}>
                                        <Text style={styles.buttonText}>Save changes</Text>
                                    </TouchableOpacity>
                                </View>


                                {/* display contacts */}
                                <Text style={{ fontSize: 20 }} >Contacts</Text>
                                <FlatList
                                    data={this.state.userData}
                                    renderItem={({ item }) => {
                                        console.log(item)
                                        return (
                                            <View>
                                                <View style={styles.contactsView}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                                        <Text style={styles.ContactsText}>{item.first_name} {item.last_name}</Text>
                                                        <TouchableOpacity style={styles.addButton} onPress={() => this.addContact(item.user_id)}>
                                                            <MaterialIcons name="add" size={24} color="black" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                            </View>
                                        );
                                    }}
                                    keyExtractor={({ user_id }, index) => user_id}
                                />

                                <View style={{ marginBottom: 5 }} />
                                <Text style={{ fontSize: 20 }}>Existing Users</Text>
                                <FlatList
                                    data={this.state.chatData.members}
                                    renderItem={({ item }) => (

                                        <View style={styles.existingContactsContainer}>
                                            <Text style={styles.existingContactsText}>{item.first_name} {item.last_name}</Text>
                                            <TouchableOpacity style={styles.trashButton} onPress={() => this.removeContact(item.user_id)}>
                                                <FontAwesome name="trash-o" size={24} color="black" />
                                            </TouchableOpacity>
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
        alignSelf: 'flex-end',
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
        marginBottom: 4,
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
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    },
    modalView: {
        flex: 1,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 35,
        // padding: 35,
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
    saveButton: {
        alignSelf: 'center',
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'Black',
        textAlign: 'center',
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
        fontSize: 20,
    },
    leftMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
    },
    rightMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C5',
    },
    stampStyle: {
        alignSelf: 'flex-end',
    },
    authorText: {
        fontSize: 13,
        color: 'grey',
    },
    modelViewText: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    contactsView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,

    },
    ContactsText: {
        flex: 1,
        fontSize: 16,
    },
    addButton: {
        marginLeft: 10,
    },

    existingContactsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    existingContactsText: {
        flex: 1,
        fontSize: 16,
    },
    trashButton: {
        marginLeft: 10,
    },
    inputViewContainer: {
        padding: 10
    },

});

// sort chat out, able to see chat but need to sort it foir when another user sends you a message
// sort out removing a memeber