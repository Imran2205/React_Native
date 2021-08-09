import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button, TextInput } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsersData } from '../../redux/actions/index';
require('firebase/firestore');

function Comment(props) {
    const [comments, setComments] = useState([]);
    const [postId, setPosdId] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        function matchUserToComments(comments){
            for(let i = 0; i < comments.length; i++){
                if(comments[i].hasOwnProperty('user')){
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator)
                if(user  === undefined){
                    props.fetchUsersData(comments[i].creator, false);
                }
                else{
                    comments[i].user = user;
                }
            }
            setComments(comments);
        }
        if(props.route.params.postId !== postId){
            firebase.firestore().collection("posts").doc(props.route.params.uid).collection("userPosts").doc(props.route.params.postId).collection("comments").get().then((snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                matchUserToComments(comments);
            })
            setPosdId(props.route.params.postId);
        }
        else{
            matchUserToComments(comments);
        }
    }, [props.route.params.postId, props.users])

    const commentSend = () => {
        firebase.firestore().collection("posts").doc(props.route.params.uid).collection("userPosts").doc(props.route.params.postId).collection("comments").add({
            creator: firebase.auth().currentUser.uid,
            text: text
        })
    }
    return (
        <View>
            <FlatList 
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => (
                    <View>
                        {item.user !== undefined ? 
                        <Text>{item.user.name}</Text>
                        : null }
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View>
                <TextInput
                    placeholder="write comment"
                    onChangeText={(text) => setText(text)}
                />
                <Button
                    onPress={() => commentSend()}
                    title="Send"
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment);
