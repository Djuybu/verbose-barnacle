import { configureStore } from "@reduxjs/toolkit";
import FruitCarsouelReducer from "./store/fruitCarsouel.store";
import { fruitCarsouelApi } from "./store/fruitCarsouel.service";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { tagTypeApi } from "./store/tagType.service";
import { fruitApi } from "./store/fruitApi.store";
import chatSliceReducer from "./store/chat.store";
import { chatApi } from "./store/chat.service";

export const store = configureStore({
  reducer: {
    carsouel: FruitCarsouelReducer,
    chat: chatSliceReducer,
    [fruitCarsouelApi.reducerPath]: fruitCarsouelApi.reducer,
    [tagTypeApi.reducerPath]: tagTypeApi.reducer,
    [fruitApi.reducerPath]: fruitApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer
  },
  // Thêm api middleware để enable các tính năng như caching, invalidation, polling của rtk-query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(fruitCarsouelApi.middleware)
      .concat(tagTypeApi.middleware)
      .concat(fruitApi.middleware)
      .concat(chatApi.middleware)
});

// Optional, nhưng bắt buộc nếu dùng tính năng refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;