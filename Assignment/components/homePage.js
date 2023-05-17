import React, { Component } from 'react';
import { Text, TextInput, View, Modal, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      chat_id: '',
      limit: 5,
      offset: 0,
      userData: [],
      chatData: [],
      isModalVisible: false,
      modalMessage: ''
    };
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

  //upon loading display all chats, set timer to call displaychat every 7 seconds
  componentDidMount() {
    console.log("HomePage mounted");
    this.displayChat()
    this.interval = setInterval(() => this.displayChat(), 7000);
    //check if user is logged in
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    //clear the timer
    clearInterval(this.interval);
    this.unsubscribe();
  }

  //check if user is logged in
  checkLoggedIn = async () => {
    const navigation = this.props.navigation;
    const value = await AsyncStorage.getItem('@session_token');

    if (value != null) {
      this.props.navigation.navigate('tabNav');
    }

    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };
  // api call display all chats, get method
  displayChat = async () => {
    try {
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/chat", {
        method: 'GET',
        headers: {
          //check if session token  is active from async storage
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
      //success, store chat data in userdata array
      else if (response.status === 200) {
        let json = await response.json();
        this.setState({
          isLoading: false,
          userData: json,
        });
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  render() {
    const navigation = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Whats That</Text>
        </View>
        <View style={styles.chatView}>
          <FlatList
            data={this.state.userData}
            renderItem={({ item }) => (
              <View style={styles.contactsView}>
                {/* pass data (item) to the Chat page, used to retrive that chat id */}
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', { item: item })}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.lastMessage}>{item.last_message.message}</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={({ chat_id }, index) => chat_id}
          />
        </View>

        <View style={styles.addStyleContainer}>
          <TouchableOpacity style={styles.addStyle} onPress={() => navigation.navigate('NewChat')}>
            <Image style={styles.imageStyle} source={require('/Users/adilbadat/Documents/MobileApp/Whats-That-Project/Assignment/assets/newChat.png')} />
          </TouchableOpacity>
        </View>

        <Modal visible={this.state.isModalVisible} animationType='slide' transparent={true}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{this.state.modalMessage}</Text>
          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
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
  contactsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 5,
    paddingLeft: 8,
    width: '100%',
  },
  chatView: {
    marginTop: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  addStyleContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  modalContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
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