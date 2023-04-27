import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

class SearchContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      search_in: 'all',
      limit: 20,
      offset: 0,
      accountFound: null,
      user_id: '',
      userData: [],
      Message: ''
    };
  }

  // change so you can search first and last name too
  //needs validation for if email not found
  SearchUser = async () => {
    try {

      const user_id = this.state.user_id;
      const search = this.state.search;
      const search_in = this.state.search_in;
      const limit = this.state.limit;
      const offset = this.state.offset;
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/search?q=" + search + "&search_in=" + search_in + "&limit=" + limit + "&offset=" + offset, {
        method: 'GET',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      });
      let json = await response.json();
      console.log(json);
      this.setState({
        isLoading: false,
        userData: json,
      });
    }
    catch (error) {
      console.log(error);
    }
  };


  addContact = async (user_id) => {
    let toSend = {
      user_id: user_id,
    };

    return fetch("http://127.0.0.1:3333/api/1.0.0/user/" + user_id + "/contact", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(toSend)
    })
      .then(async (response) => {
        this.SearchUser();
      })
      .then(async (response) => {
        console.log('user added');
        this.setState({ Message: "user added" });
      })
      .catch((error) => {
        console.log('error:', error);
      })
  }



  render() {
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
          <View style={styles.Iconleft}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter email"
              placeholderTextColor="gray"
              onChangeText={(text) => this.setState({ search: text })} />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => this.SearchUser()}>
              <Text> Search</Text>
            </TouchableOpacity>
          </View>

          {this.state.Message ? <Text>{this.state.Message}</Text> : null}

          <FlatList
            data={this.state.userData}
            renderItem={({ item }) => (

              <View>
                <View style={styles.contactsView}>
                  <View>
                    <Text style={styles.textView}>{item.given_name} {item.family_name}</Text>
                    <Text style={styles.textView}>{item.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => this.addContact(item.user_id)}>
                    <Text>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={({ user_id }, index) => user_id}
          />
        </View>
      );
    }
  }
}
export default SearchContact;

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
  Iconleft: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 15,
    marginTop: 10,
  },
  //search box
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: 50,
    marginVertical: '2%',
    marginRight: 10,
    paddingHorizontal: 5,
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '25%',
    height: 45,
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#c8ada4',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
  },
  // contacts
  contactsView: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
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
  addButton: {
    width: '20%',
    textAlign: 'center',
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#72F3A6'
  },

});
