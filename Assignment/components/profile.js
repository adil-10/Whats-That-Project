import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component{


    async logout(){
        const navigation = this.props.navigation;
        console.log('logout')
        return fetch("http://127.0.0.1:3333/api/1.0.0/logout",{
        method: 'POST',
        headers: {
            "X-Authorization" : await AsyncStorage.getItem("@session_token")
        },
        })

        .then(async(response) => {
            if(response.status === 200){
                await AsyncStorage.removeItem("@session_token")
                await AsyncStorage.removeItem("@user_id")
                this.props.navigation.navigate('Login')
            }
            else if(response.status === 401){
                console.log('Unauthorised')
                await AsyncStorage.removeItem("@session_token")
                await AsyncStorage.removeItem("@user_id")
                this.props.navigation.navigate('Login')
            }
            else{
                throw 'Something went wrong'
            }
        })
        .catch((error) => {
            this.setState("error", error);
            this.setState("submitted", false);
        })
    }
    
    render(){
        return(
            <View style={styles.container}>

                <TextInput style={styles.inputBox}
                placeholder= "first name"
                placeholderTextColor="gray">
                {/* onChangeText={email => this.setState({ email })}
                value={this.state.email} */}
                </TextInput>

                <TextInput style={styles.inputBox}
                placeholder= "last name"
                placeholderTextColor="gray">
                {/* onChangeText={email => this.setState({ email })}
                value={this.state.email} */}
                </TextInput>

                <TextInput style={styles.inputBox}
                placeholder= "email"
                placeholderTextColor="gray">
                {/* onChangeText={email => this.setState({ email })}
                value={this.state.email} */}
                </TextInput>

                <TextInput style={styles.inputBox}
                placeholder= "Password"
                placeholderTextColor="gray">
                {/* onChangeText={email => this.setState({ email })}
                value={this.state.email} */}
                </TextInput>

                
                <TouchableOpacity style={styles.buttonDesign}
                onPress={() => this.logout()}> 
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default Profile;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        height: 50,
        marginVertical: '2%',
        paddingHorizontal: 5,
        color: 'black',
        textAlign: 'center',
        justifyContent: 'center',
      },

    buttonDesign:{
        marginVertical: 10,
        padding: 10,
        width: '75%',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: '#c8ada4',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
    }
})

// post method to show data of user needed 
// authstack needs doing for navigation\
// logoin post method needs finishiong
// compound didmound