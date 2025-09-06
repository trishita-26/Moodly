import { configureStore} from '@reduxjs/toolkit'
import userReducer from '../feature/user/userSlice.js'
import connectionsReducer from '../feature/connections/connectionSlice.js'
import messagesReducer from '../feature/messages/messagesSlice.js'

export const store = configureStore({
    reducer:{
        user:userReducer,
        connections: connectionsReducer,
        messages: messagesReducer
    }
})