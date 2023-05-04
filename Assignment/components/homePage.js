import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      chat_id: '',
      limit: 20,
      offset: 0,
      userData: [],
      chatData: [],
    };
  }
  componentDidMount() {
    const navigation = this.props.navigation;
    console.log("HomePage mounted");
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.displayChat();
  }

  componentWillUnmount() {
    console.log("HomePage unmounted");
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const navigation = this.props.navigation;
    const value = await AsyncStorage.getItem('@session_token');

    if (value != null) {
      this.props.navigation.navigate('HomePage');
    }

    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  displayChat = async () => {
    try {
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/chat", {
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
      // console.log(this.state.userData)
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
            <Image style={styles.imageStyle} source={{ uri: "https://cdn-icons-png.flaticon.com/512/14/14558.png" }} />
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
  addStyle: {},
  imageStyle: {
    width: 50,
    height: 50,
  },
});


// // sort out when a new chat is made it instantly gets added
// // styling needs sorting