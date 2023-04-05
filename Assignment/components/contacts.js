import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      search: '',
      search_in: 'all',
      limit: 20,
      offset: 0,
      accountFound: null,
      user_id: '',
      userData: []
    };
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

  componentDidMount() {
    this.displayContacts();
  }

  deleteContact = async (user_id) => {
    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + user_id + "/contact", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => {
        this.displayContacts();
      })
      .then((response) => {
        console.log("item deleted");
      })
      .catch((error) => {
        console.log(error);
      })
  }

  blockUser = async (user_id) => {
    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + user_id + "/block", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => {
        this.displayContacts();
      })
      .then(async (response) => {
        console.log('user blocked');
      })
      .catch((error) => {
        console.log('error:', error);
      })
  }


  // display search user in flat list
  render() {
    const navigation = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate("SearchContact")}>
            <Text> Click here to search</Text>
          </TouchableOpacity>

          <FlatList
            data={this.state.userData}
            renderItem={({ item }) => (
              <View>
                <View style={styles.contactsView}>
                  <View>
                    <Text style={styles.textView} >{item.first_name} {item.last_name}</Text>
                    <Text style={styles.textView}>{item.email}</Text>
                  </View>

                  <View style={styles.buttonView}>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => this.deleteContact(item.user_id)}>
                      <Text>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.blockButton}
                      onPress={() => this.blockUser(item.user_id)}>
                      <Text>Block</Text>
                    </TouchableOpacity>
                  </View>

                </View>
                <View style={styles.separator} />
              </View>
            )}
            keyExtractor={({ user_id }, index) => user_id}
          />
        </View>
      );
    }
  }
}

export default Contacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginBottom: 20,
    width: '100%',
    height: 30,
    textAlign: 'center',
    justifyContent: 'center',
  },
  contactsView: {
    paddingTop: 5,
    width: 370,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden', // set overflow to 'hidden'
  },
  textView: {
    fontSize: 15,
    maxWidth: '100%', // set a fixed maximum width for the text
    overflow: 'hidden', // set overflow to 'hidden'
    whiteSpace: 'nowrap', // prevent wrapping of text
    textOverflow: 'ellipsis', // show ellipsis (...) for truncated text
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#EE5249',
    padding: 7.5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 35
  },
  blockButton: {
    backgroundColor: '#DB56EB',
    padding: 7.5,
    marginLeft: 7.5,
    marginRight: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',

  },
  separator: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingTop: 5,
    width: '100%',
  }
});
