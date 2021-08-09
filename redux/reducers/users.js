import {USERS_DATA_STATE_CHANGE, USERS_POST_STATE_CHANGE, CLEAR_DATA, USERS_LIKE_STATE_CHANGE,USERS_LIKE_COUNT_STATE_CHANGE} from "../constants"

const initialState = {
    users: [],
    feed: [],
    usersLoaded: 0
}

export const users = (state = initialState, action) => {
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
            return{
                ...state,
                users: [...state.users, action.user]
            };
        case USERS_POST_STATE_CHANGE:
            return {
                ...state,
                usersLoaded: state.usersLoaded + 1,
                feed: [...state.feed, ...action.posts]
            };
        case USERS_LIKE_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map(post => post.id === action.postId ? 
                    {...post, currentUserLike: action.currentUserLike} : 
                    post)
            };
        case USERS_LIKE_COUNT_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map(post => post.id === action.postId ? 
                    {...post, likeCount: action.likeCount} : 
                    post)
            };
        case CLEAR_DATA:
            return initialState;
        default:
            return state;
    }
    
}

//users: state.users.map(user => user.uid === action.uid ?
//    {...user, posts: action.posts} : 
//    user)