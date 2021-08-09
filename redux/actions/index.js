import firebase from "firebase";
import { USER_POST_STATE_CHANGE, USER_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POST_STATE_CHANGE, CLEAR_DATA, USERS_LIKE_STATE_CHANGE, USERS_LIKE_COUNT_STATE_CHANGE } from "../constants/index";
import { SnapshotViewIOSComponent } from 'react-native';
require('firebase/firestore');

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser(){
    return((dispatch) => {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then((snapshot) => {
            if(snapshot.exists){
                dispatch({type : USER_STATE_CHANGE, currentUser: snapshot.data()})
            }
            else{
                console.log('does not exist')
            }
        })
    })
}

export function fetchUserPosts(){
    return((dispatch) => {
        //map function iterate through docs
        firebase.firestore().collection("posts").doc(firebase.auth().currentUser.uid).collection("userPosts").orderBy("creation", "asc").get().then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return{id, ...data}
            })
            dispatch({type : USER_POST_STATE_CHANGE, posts: posts});
            //dispatch({type : USER_POST_STATE_CHANGE, posts})//if variable names match to the parameter we need to update then the variable can be written directly without two point it to parameter
        })
    })
}


export function fetchUserFollowing(){
    return((dispatch) => {
        //map function iterate through docs
        firebase.firestore().collection("following").doc(firebase.auth().currentUser.uid).collection("userFollowing").onSnapshot((snapshot) => {
            let following = snapshot.docs.map(doc => {
                const id = doc.id;
                return id
            })
            dispatch({type : USER_FOLLOWING_STATE_CHANGE, following: following});
            for(let i = 0; i < following.length; i++){
                dispatch(fetchUsersData(following[i], true));
            }
        })
    })
}
//getState returns the state of the current redux store 
export function fetchUsersData(uid, getPosts){
    return((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        if(!found){
            firebase.firestore().collection("users").doc(uid).get().then((snapshot) => {
                if(snapshot.exists){
                    let user = snapshot.data();
                    user.uid = snapshot.id;

                    dispatch({type : USERS_DATA_STATE_CHANGE, user: user});
                    if(getPosts){
                        dispatch(fetchUsersFollowingPosts(user.uid));
                    }
                    
                }
                else{
                    console.log('does not exist')
                }
            })
        }
    })
}

export function fetchUsersFollowingPosts(uid){
    return((dispatch, getState) => {
        //map function iterate through docs
        firebase.firestore().collection("posts").doc(uid).collection("userPosts").orderBy("creation", "asc").get().then((snapshot) => {
            let loop_runner = true;
            let uid = "";
            for (var key in snapshot.query) {
                if(key==='segments'){
                    uid = snapshot.query[key][1];
                    loop_runner = false;
                }
                if(!loop_runner){
                    break;
                }
                for (var key2 in snapshot.query[key]){
                    if(key2==='segments'){
                        uid = snapshot.query[key][key2][1];
                        loop_runner = false;
                    }
                    if(!loop_runner){
                        break;
                    }
                    for (var key3 in snapshot.query[key][key2]){
                        if(key3==='segments'){
                            uid = snapshot.query[key][key2][key3][1];
                            loop_runner = false;
                        }
                        if(!loop_runner){
                            break;
                        }
                        for (var key4 in snapshot.query[key][key2][key3]){
                            if(key4==='segments'){
                                uid = snapshot.query[key][key2][key3][key4][1];
                                loop_runner = false;
                            }
                            if(!loop_runner){
                                break;
                            }
                        }
                        if(!loop_runner){
                            break;
                        }
                    }
                    if(!loop_runner){
                        break;
                    }
                }
                if(!loop_runner){
                    break;
                }
            }
            const user = getState().usersState.users.find(el => el.uid === uid);

            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return {id, ...data, user}
            })
            dispatch({type : USERS_POST_STATE_CHANGE, posts: posts});  
            for(let i = 0; i < posts.length; i++){
                dispatch(fetchUsersFollowingLikes(uid, posts[i].id));
                dispatch(fetchUsersFollowingLikesChange(uid, posts[i].id));
            }  
        })
    })
}

export function fetchUsersFollowingLikes(uid, postId){
    return((dispatch, getState) => {
        //map function iterate through docs
        firebase.firestore().collection("posts").doc(uid).collection("userPosts").doc(postId).collection("likes").doc(firebase.auth().currentUser.uid).onSnapshot((snapshot) => {
            let loop_runner = true;
            let postId = "";
            let uid = "";

            for (var key in snapshot) {
                if(key==='segments'){
                    postId = snapshot[key][3];
                    uid = snapshot[key][1];
                    loop_runner = false;
                }
                if(!loop_runner){
                    break;
                }
                for (var key2 in snapshot[key]){
                    if(key2==='segments'){
                        postId = snapshot[key][key2][3];
                        uid = snapshot[key][key2][1];
                        loop_runner = false;
                    }
                    if(!loop_runner){
                        break;
                    }
                    for (var key3 in snapshot[key][key2]){
                        if(key3==='segments'){
                            postId = snapshot[key][key2][key3][3];
                            uid = snapshot[key][key2][key3][1];
                            loop_runner = false;
                        }
                        if(!loop_runner){
                            break;
                        }
                        for (var key4 in snapshot[key][key2][key3]){
                            if(key4==='segments'){
                                postId = snapshot[key][key2][key3][key4][3];
                                uid = snapshot[key][key2][key3][key4][1];
                                loop_runner = false;
                            }
                            if(!loop_runner){
                                break;
                            }
                        }
                        if(!loop_runner){
                            break;
                        }
                    }
                    if(!loop_runner){
                        break;
                    }
                }
                if(!loop_runner){
                    break;
                }
            }
            let currentUserLike = false;
            if(snapshot.exists){
                currentUserLike = true;
            }
            dispatch({type : USERS_LIKE_STATE_CHANGE, postId: postId, currentUserLike: currentUserLike, uid: uid});
        })
    })
}

export function fetchUsersFollowingLikesChange(uid, postId){
    return((dispatch, getState) => {
        //map function iterate through docs
        firebase.firestore().collection("posts").doc(uid).collection("userPosts").doc(postId).onSnapshot((snapshot) => {
            let loop_runner = true;
            let postId = "";
            let uid = "";

            for (var key in snapshot) {
                if(key==='segments'){
                    postId = snapshot[key][3];
                    uid = snapshot[key][1];
                    loop_runner = false;
                }
                if(!loop_runner){
                    break;
                }
                for (var key2 in snapshot[key]){
                    if(key2==='segments'){
                        postId = snapshot[key][key2][3];
                        uid = snapshot[key][key2][1];
                        loop_runner = false;
                    }
                    if(!loop_runner){
                        break;
                    }
                    for (var key3 in snapshot[key][key2]){
                        if(key3==='segments'){
                            postId = snapshot[key][key2][key3][3];
                            uid = snapshot[key][key2][key3][1];
                            loop_runner = false;
                        }
                        if(!loop_runner){
                            break;
                        }
                        for (var key4 in snapshot[key][key2][key3]){
                            if(key4==='segments'){
                                postId = snapshot[key][key2][key3][key4][3];
                                uid = snapshot[key][key2][key3][key4][1];
                                loop_runner = false;
                            }
                            if(!loop_runner){
                                break;
                            }
                        }
                        if(!loop_runner){
                            break;
                        }
                    }
                    if(!loop_runner){
                        break;
                    }
                }
                if(!loop_runner){
                    break;
                }
            }
            let like_count = 0;
            if(snapshot.data().likeCount !== undefined){
                like_count = snapshot.data().likeCount;
            }
            dispatch({type : USERS_LIKE_COUNT_STATE_CHANGE, postId: postId, uid: uid, likeCount: like_count});
        })
    })
}