import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button, SnapshotViewIOS } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';

require('firebase/firestore');

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        //let posts = [];
        if(props.usersLoaded == props.following.length && props.following.length !== 0){
            /*for(let i = 0; i < props.following.length; i++){
                const user = props.users.find(el => el.uid === props.following[i]);
                if(user != undefined){
                    for(let j = 0; j < user.posts.length; j++){
                        posts = [...posts, user.posts[j]];
                    } 
                }
            }
            
            posts.sort(function(x, y) {
                return y.creation - x.creation;
            })*/
            props.feed.sort(function(x, y) {
                return y.creation - x.creation;
            })
            setPosts(props.feed);
        }
        //console.log(posts);
    }, [props.usersLoaded, props.feed])

    const like = (userId, postId) => {
        firebase.firestore().collection("posts").doc(userId).collection("userPosts").doc(postId).get().then((snapshot) => {
            if(snapshot.exists){
                let dat = snapshot.data();
                let likes = 0;
                if('likeCount' in dat){
                    likes = dat.likeCount + 1;
                }
                else{
                    likes = 1;
                }
                firebase.firestore().collection("posts").doc(userId).collection("userPosts").doc(postId).update({likeCount: likes});

            }
            else{
                console.log('does not exist')
            }
        });
        firebase.firestore().collection("posts").doc(userId).collection("userPosts").doc(postId).collection("likes").doc(firebase.auth().currentUser.uid).set({});
        
    }

    const dislike = (userId, postId) => {
        firebase.firestore().collection("posts").doc(userId).collection("userPosts").doc(postId).get().then((snapshot) => {
            if(snapshot.exists){
                let dat = snapshot.data();
                let likes = 0;
                if('likeCount' in dat){
                    likes = dat.likeCount - 1;
                }
                else{
                    likes = 0;
                }
                if(likes < 0){
                    likes = 0;
                }
                firebase.firestore().collection("posts").doc(userId).collection("userPosts").doc(postId).update({likeCount: likes});

            }
            else{
                console.log('does not exist')
            }
        });
        firebase.firestore().collection("posts").doc(userId).collection("userPosts").doc(postId).collection("likes").doc(firebase.auth().currentUser.uid).delete();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Recent Posts</Text>
            <View style={styles.postContainer}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={styles.imageContainer}>
                            <Text style={styles.text}>{item.user.name}</Text>
                            <Image
                                style={styles.image}
                                source={{uri: item.downloadURL}}
                            />
                            {item.likeCount ? 
                                (
                                    <Text>Likes: {item.likeCount}</Text>
                                ):
                                (
                                    <Text>Likes: 0</Text>
                                )
                            }
                            {item.currentUserLike ? 
                                (
                                    <Button 
                                        title="Dislike"
                                        onPress={() => dislike(item.user.uid, item.id)}
                                    />
                                ):
                                (
                                    <Button 
                                        title="Like"
                                        onPress={() => like(item.user.uid, item.id)}
                                    />
                                )
                            }
                            <Text onPress={() => props.navigation.navigate('Comment', {postId: item.id, uid: item.user.uid})}>
                                View Comments
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    infoContainer: {
        margin: 20,
        
    },
    postContainer: {
        flex: 1,
        margin: 20,
    },
    imageContainer: {
        flex: 1/3,
    },
    text: {
        marginTop: 10,
    },
    image: {
        flex: 1,
        aspectRatio: 1/1,
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersLoaded: store.usersState.usersLoaded,
})
//users: store.usersState.users,

export default connect(mapStateToProps, null)(Feed);
