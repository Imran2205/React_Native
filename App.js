import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from 'firebase' ;
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import Reducer from './redux/reducers';
import thunk from 'redux-thunk';
import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import MainScreen from './components/Main';
import Login from './components/auth/Login';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
import CommentScreen from './components/main/Comment';


const store = createStore(Reducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyATjKuiBRsFEOeQYW6IGbk8wjYFPGrW0gU",
  authDomain: "insta-demo-2f376.firebaseapp.com",
  projectId: "insta-demo-2f376",
  storageBucket: "insta-demo-2f376.appspot.com",
  messagingSenderId: "230983341495",
  appId: "1:230983341495:web:8689dca1de4434a86e0432",
  measurementId: "G-13S7NCZ3LB"
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }
      else{
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="Login" component={Login}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Add+" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider> 
    );
  }
}


export default App

