import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BlockedContacts extends Component {


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      accountFound: null,
      user_id: '',
      userData: []
    };
  }

  displayContacts = async () => {
    try {
      const userId = await AsyncStorage.getItem('@user_id');
      let response = await fetch("http://127.0.0.1:3333/api/1.0.0/blocked", {
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

  unBlock = async (user_id) => {
    return fetch ("http://127.0.0.1:3333/api/1.0.0/user/" + user_id + "/block",{
      method: 'DELETE',
      headers: {
        'Content-Type' : 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
    .then((response) =>{
      this.displayContacts();
    })
    .then((response) =>{
      console.log("user unblocked");
    })
    .catch((error) =>{
      console.log(error);
    })
  }

render() {
  if(this.state.isLoading){
    return(
      <View>
        <ActivityIndicator />
      </View>
    );
  }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.userData}
          renderItem={({item}) =>(
            <View>
            <View style={styles.contactsView}>
                <View>
                <Text style={styles.textView} >{item.first_name} {item.last_name}</Text>
                <Text style={styles.textView}>{item.email}</Text>
                </View>
                <TouchableOpacity
                style={styles.blockButton}
                onPress={() =>this.unBlock(item.user_id)}>
                  <Text>UnBlock</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={({user_id}, index) => user_id}
          />
      </View>
    );
  }
}

export default BlockedContacts;
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

  contactsView: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 5,
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
  blockButton:{
    width: '20%',
    textAlign: 'center',
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 3,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#E5BA3E',
    fontSize: 12,
  },
});
