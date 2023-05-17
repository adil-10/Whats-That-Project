import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal } from 'react-native';
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
            message: '',
            chatData: [],
            userData: [],
            expanded: false,
            isModalVisible: false,
            modalMessage: ''
        };
        this.sendText = this.sendText.bind(this);
    }

    //toggle open and close modal
    closeModal = () => {
        this.setState({ isModalVisible: false });
    };

    showModal = (message) => {
        this.setState({
            isModalVisible: true,
            modalMessage: message,
        });
        setTimeout(() => {
            this.setState({ isModalVisible: false });
        }, 2000);
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    //call get chat at intervals of 5 seconds and get chat and display contacts upon loading page
    componentDidMount() {
        this.getChat();
        this.displayContacts();
        this.interval = setInterval(() => this.getChat(), 5000);
    }

    //get method to display single chat info
    getChat = async () => {
        try {
            //user id of sender
            const userId = await AsyncStorage.getItem('@user_id');
            this.setState({ userId });
            //data (item) that was passed from previous page 
            const item = this.props.route.params;
            //getting the chat id from item, passing it into url
            let response = await fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id, {
                method: 'GET',
                headers: {
                    'X-Authorization': await AsyncStorage.getItem('@session_token'),
                },
            });
            //responses
            if (response.status === 401) {
                this.showModal('Unauthorised');
                return false;
            }
            else if (response.status === 403) {
                this.showModal('Forbidden');
                return false;
            }
            else if (response.status === 404) {
                this.showModal('User not found');
                return false;
            }
            else if (response.status === 500) {
                this.showModal('Network error');
                return false;
            }
            else if (response.status === 200) {
                let json = await response.json();
                this.setState({
                    isLoading: false,
                    chatData: json,
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    // patch update user info
    updateChatinfo = async () => {
        //data (item) that was passed from previous page 
        const item = this.props.route.params;

        let toSend = {
            name: this.state.name,
        };
        //getting the chat id from item, passing it into url
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
            body: JSON.stringify(toSend)
        })
            .then((response) => {
                //responses
                if (response.status === 400) {
                    this.showModal('Bad request');
                    return false;
                }
                else if (response.status === 401) {
                    this.showModal('Unauthorised');
                    return false;
                }
                else if (response.status === 403) {
                    this.showModal('Forbidden');
                    return false;
                }
                else if (response.status === 404) {
                    this.showModal('User not found');
                    return false;
                }
                else if (response.status === 500) {
                    this.showModal('Network error');
                    return false;
                }
                else if (response.status === 200) {
                    this.showModal('Update Complete');
                    return false;
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //Post to add contact to chat, retriving the user_id as a param
    addContact = async (user_id) => {
        //data (item) that was passed from previous page 
        const item = this.props.route.params;
        //getting the chat id from item, passing it into url
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/user/" + user_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
        })
            .then((response) => {
                //response
                if (response.status === 400) {
                    this.showModal('Bad request');
                    return false;
                }
                else if (response.status === 401) {
                    this.showModal('Unauthorised');
                    return false;
                }
                else if (response.status === 403) {
                    this.showModal('Forbidden');
                    return false;
                }
                else if (response.status === 404) {
                    this.showModal('User not found');
                    return false;
                }
                else if (response.status === 500) {
                    this.showModal('Network error');
                    return false;
                }
                else if (response.status === 200) {
                    //call getchat to rerender all chats on page showing new message sent
                    this.getChat();
                    this.showModal('Member added');
                    return false;
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //delete method to remove contact from chat,  retriving the user_id as a param
    removeContact = async (user_id) => {
        //data (item) that was passed from previous page 
        const item = this.props.route.params;
        //getting the chat id from item, passing it into url, passing user_id into url too
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/user/" + user_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
        })
            //response
            .then((response) => {
                if (response.status === 401) {
                    this.showModal('Unauthorised');
                    return false;
                }
                else if (response.status === 403) {
                    this.showModal('Forbidden');
                    return false;
                }
                else if (response.status === 404) {
                    this.showModal('User not found');
                    return false;
                }
                else if (response.status === 500) {
                    this.showModal('Network error');
                    return false;
                }
                else if (response.status === 200) {
                    this.getChat();
                    this.showModal('User removed');
                    return false;
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //post to send message
    sendText = async () => {
        //data (item) that was passed from previous page
        const item = this.props.route.params;
        let toSend = {
            message: this.state.message
        };
        //getting the chat id from item, passing it into url
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/message", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
            //sending message to api 
            body: JSON.stringify(toSend)
        })
            //response
            .then((response) => {
                if (response.status === 400) {
                    this.showModal('Bad request');
                    return false;
                }
                else if (response.status === 401) {
                    this.showModal('Unauthorised');
                    return false;
                }
                else if (response.status === 403) {
                    this.showModal('Forbidden');
                    return false;
                }
                else if (response.status === 404) {
                    this.showModal('User not found');
                    return false;
                }
                else if (response.status === 500) {
                    this.showModal('Network error');
                    return false;
                }
                else if (response.status === 200) {
                    this.getChat();
                    console.log('successs')
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //delete message, passing the message id as a param from the selected message
    deleteChat = async (message_id) => {
        //data (item) that was passed from previous page
        const item = this.props.route.params;
        //getting the chat id from item, passing it into url
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/message/" + message_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token'),
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    this.showModal('Unauthorised');
                    return false;
                }
                else if (response.status === 403) {
                    this.showModal('Forbidden');
                    return false;
                }
                else if (response.status === 404) {
                    this.showModal('User not found');
                    return false;
                }
                else if (response.status === 500) {
                    this.showModal('Network error');
                    return false;
                }
                else if (response.status === 200) {
                    this.getChat();
                    console.log('successs')
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // update user info passing the message id as a param from the selected message
    updateChat = async (message_id) => {
        //data (item) that was passed from previous page
        const item = this.props.route.params;

        let toSend = {
            message: this.state.message,
        };
        //getting the chat id from item, passing it into url, passing message_id across too
        return fetch("http://127.0.0.1:3333/api/1.0.0/chat/" + item.item.chat_id + "/message/" + message_id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
            body: JSON.stringify(toSend)
        })
            .then((response) => {
                if (response.status === 400) {
                    this.showModal('Bad request');
                    return false;
                }
                else if (response.status === 401) {
                    this.showModal('Unauthorised');
                    return false;
                }
                else if (response.status === 403) {
                    this.showModal('Forbidden');
                    return false;
                }
                else if (response.status === 404) {
                    this.showModal('User not found');
                    return false;
                }
                else if (response.status === 500) {
                    this.showModal('Network error');
                    return false;
                }
                else if (response.status === 200) {
                    this.getChat();
                    this.showModal('Message updated');
                    return false;
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //display all conntacts so user can add them
    displayContacts = async () => {
        try {
            let response = await fetch("http://127.0.0.1:3333/api/1.0.0/contacts", {
                method: 'GET',
                headers: {
                    //check users session token in async story
                    'X-Authorization': await AsyncStorage.getItem('@session_token'),
                },
            });
            if (response.status === 401) {
                this.showModal('Unauthorised');
                return false;
            }
            else if (response.status === 500) {
                this.showModal('Network Error');
                return false;
            }
            else if (response.status === 200) {
                let json = await response.json();
                console.log('ok it worked')
                this.setState({
                    //store resulting data in array
                    isLoading: false,
                    userData: json,
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    };


    //Method to expand and collapse message
    toggleExpanded(messageId) {
        const { chatData, userId } = this.state;

        // fins index of message with gicen messageId in the messages array inside chatData.
        const index = chatData.messages.findIndex((item) => item.message_id === messageId);

        //enables editable of message at the given index
        chatData.messages[index].editable = !chatData.messages[index].editable;

        // Check if the current user is the sender before allowing the message to be expanded
        const isSentByCurrentUser = parseInt(chatData.messages[index].author.user_id) === parseInt(userId);

        //if message was send by current user, expands or collapse
        if (isSentByCurrentUser) {
            //Sets state, creates new copy of chatdata, updates its message using map (creates new array with same elements as origional)
            // expanded toggles with message id
            this.setState({
                chatData: {
                    ...chatData,
                    messages: chatData.messages.map((message) => {
                        if (message.message_id === messageId) {
                            return {
                                ...message,
                                expanded: !message.expanded,
                            };
                        }
                        return message;
                    }),
                },
            });
        }
    }

    render() {
        const { modalVisible } = this.state;
        //set state of item to be the item from the previous page that was passed to chat page
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
                    {/* toggle modal on click */}
                    <View style={styles.Icon}>
                        <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
                            <Text style={{ fontSize: 25 }}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.chatContainer}>
                    <FlatList
                        //revser order
                        inverted
                        data={chatData.messages}
                        renderItem={({ item }) => {
                            //extract user id
                            const { userId } = this.state;
                            //extract user id from author pproperty
                            const sender = item.author.user_id;
                            //checks if sender valuer os the same as the user id, convert both to integers
                            const isSentByCurrentUser = parseInt(sender) === parseInt(userId);
                            //if true style messages to right indicating user logged in sent the messages, else style messages to left 
                            const messageStyle = isSentByCurrentUser ? styles.rightMessage : styles.leftMessage;

                            return (
                                <View>
                                    {/* if not expanded render the message author name as texts, uneditable */}
                                    {!item.expanded ? (
                                        <TouchableOpacity onPress={() => this.toggleExpanded(item.message_id)}>
                                            <View style={[styles.messageContainer, messageStyle]}>
                                                <Text style={styles.messageText}>{item.message}</Text>
                                                <View style={styles.stampStyle}>
                                                    <Text style={styles.authorText}>
                                                        {item.author.first_name} {item.author.last_name}
                                                    </Text>
                                                    {/* if sent by current user give open to expand and collapse */}
                                                    {isSentByCurrentUser && (
                                                        <Text style={styles.expandButton}>
                                                            {!item.expanded ? '+' : '-'}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ) :
                                        // if expanded render as textinput so user can edit data
                                        (
                                            <View style={[styles.messageContainer, messageStyle]}>
                                                <TextInput
                                                    style={styles.messageText}
                                                    placeholder={item.message}
                                                    onChangeText={(text) => this.setState({ message: text })}
                                                />
                                                <View style={styles.stampStyle}>
                                                    <Text style={styles.authorText}>
                                                        {item.author.first_name} {item.author.last_name}
                                                    </Text>
                                                    {/* if sent by current user give open to expand and collapse */}
                                                    {isSentByCurrentUser && (
                                                        <Text style={styles.expandButton}>
                                                            {!item.expanded ? '+' : '-'}
                                                        </Text>
                                                    )}
                                                </View>

                                                <View>
                                                    <TouchableOpacity onPress={() => this.updateChat(item.message_id, this.state.message)}>
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
                        keyExtractor={(item) => item.message_id}
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

                {/* if modal visible model View */}
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
                                    {/* chat name rendered in textinput, save button to update */}
                                    <TextInput
                                        style={styles.modelViewText}
                                        placeholder={item.item.name}
                                        placeholderTextColor="gray"
                                        onChangeText={name => this.setState({ name })} />
                                    <TouchableOpacity style={styles.saveButton} onPress={this.updateChatinfo}>
                                        <Text style={styles.buttonText}>Save changes</Text>
                                    </TouchableOpacity>
                                </View>


                                {/* display users contacts to add to chat */}
                                <Text style={{ fontSize: 20 }} >My contacts</Text>
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
                                {/* display users in chat to remove */}
                                <View style={{ marginBottom: 5 }} />
                                <Text style={{ fontSize: 20 }}>Existing Users in chat</Text>
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

                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => this.setState({ modalVisible: !modalVisible })}>
                                    <Text style={styles.textStyle}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View >

                <Modal visible={this.state.isModalVisible} animationType='slide' transparent={true}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{this.state.modalMessage}</Text>
                    </View>
                </Modal>

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
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
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
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
        backgroundColor: '#333',
        borderRadius: 10,
    },
});