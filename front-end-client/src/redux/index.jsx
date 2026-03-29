import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Chọn công cụ lưu trữ của bạn
import mainReducer from "./reducer/index";
const persistConfig = {
  key: "auth",
  storage,
  // Specify the reducers you want to persist
  whitelist: ["user"],
};
const persistedReducer = persistReducer(persistConfig, mainReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
