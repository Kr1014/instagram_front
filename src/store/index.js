import { configureStore } from "@reduxjs/toolkit";
import publi from "./publicacionSlice";

const store = configureStore({
  reducer: {
    publi,
  },
});

export default store;
