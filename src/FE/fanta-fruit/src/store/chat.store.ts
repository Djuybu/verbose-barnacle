import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../type/message.type";

interface ChatState {
    id: string,
    ChatHistory: Message[]
}

const initialState: ChatState = {
    id: "",
    ChatHistory: []
}

const ChatSlice = createSlice({
    name: "Chat",
    initialState,
    reducers: {
        setChatId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        addChatToHistory: (state, action: PayloadAction<Message>) => {
            state.ChatHistory.push(action.payload)
        }
    }
})

const chatSliceReducer = ChatSlice.reducer
export const {setChatId, addChatToHistory} = ChatSlice.actions
export default chatSliceReducer