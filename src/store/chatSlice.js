import { createSlice } from "@reduxjs/toolkit";

const oneChatSlice = createSlice({
  name: "chat",
  initialState: null,
  reducers: {
    setChat: (state, action) => action.payload,
  },
});

export const { setChat } = oneChatSlice.actions;
export default oneChatSlice.reducer;
