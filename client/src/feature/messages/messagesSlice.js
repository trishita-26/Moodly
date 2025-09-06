import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState={
    messages:[]
}

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async ({token, userId}) => {
   const {data}= await api.post('/api/messgae/get',{to_user_id: userId},{
     headers: {Authorization:`Bearer ${token}`}
    })
    return data.success? data:null
})
const messagesSlice = createSlice({
    name:'messages',
    initialState,
    reducers:{
       setMessages:(state, action)=>{
        state.messages=action.payload;
       },
       addMessages : (state, action)=>{
        state.messages=[...state.messages, action.payload]
       },
       resentMessages : (state)=>{
        state.messages=[];
       },
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchMessages.fulfilled, (state, action)=>{
            if(action.payload){
                state.messages= action.payload.messages
            }
        })
    }
})

export const {setMessages,addMessages,resentMessages}= messagesSlice.actions;

export default messagesSlice.reducer