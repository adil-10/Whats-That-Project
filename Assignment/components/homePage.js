import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
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
      console.log(this.state.userData)
    }
    catch (error) {
      console.log(error);
    }
  };

  renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>

        <View style={styles.Icon}>
          <MenuProvider style={{ flexDirection: 'column', padding: 25 }}>
            <Menu>
              <MenuTrigger text='...' customStyles={{ triggerText: { fontSize: 20, fontWeight: 'bold' } }} />                                <MenuOptions>
                <MenuOption onSelect={() => navigation.navigate('NewChat')} text='New Chat' />
              </MenuOptions>
            </Menu>
          </MenuProvider>
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
      </View >
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  Icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 10
  },
  contactsView: {
    paddingTop: 20,

    width: 370,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatView: {
    marginTop: 40,
  },
  textView: {
    fontSize: 20,
    maxWidth: '100%',
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
  separator: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingTop: 5,
    width: '100%',
  },
})

// // sort out when a new chat is made it instantly gets added
// // styling needs sorting

// import React, { Component } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

// export default class HomePage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       chats: [
//         {
//           name: 'John Doe',
//           lastMessage: 'Hey, what\'s up?',
//           time: '10:30 AM',

//         },
//         {
//           name: 'Jane Smith',
//           lastMessage: 'Can you send me that document?',
//           time: '9:15 AM',

//         },
//         // Add more chat objects here...
//       ],
//     };
//   }

//   renderChatItem = ({ item }) => {
//     return (
//       <TouchableOpacity style={styles.chatItem} onPress={() => this.props.navigation.navigate('Chat', { chat: item })}>

//         <View style={styles.chatDetails}>
//           <Text style={styles.name}>{item.name}</Text>
//           <Text style={styles.lastMessage}>{item.lastMessage}</Text>
//         </View>
//         <Text style={styles.time}>{item.time}</Text>
//       </TouchableOpacity>
//     );
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <FlatList
//           data={this.state.chats}
//           renderItem={this.renderChatItem}
//           keyExtractor={(item, index) => index.toString()}
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   chatItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   chatDetails: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },

//   time: {
//     fontSize: 12,
//     color: '#999',
//     marginLeft: 8,
//   },
// });
