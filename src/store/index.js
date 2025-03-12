import { configureStore } from "@reduxjs/toolkit";
import publi from "./publicacionSlice";
import oneChat from "./chatSlice"

const store = configureStore({
  reducer: {
    publi,
    oneChat
  },
});

export default store;
