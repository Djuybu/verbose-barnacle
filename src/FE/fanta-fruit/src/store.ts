import { configureStore } from "@reduxjs/toolkit";
import FruitCarsouelReducer from "./store/fruitCarsouel.store";
import { fruitCarsouelApi } from "./store/fruitCarsouel.service";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { tagTypeApi } from "./store/tagType.service";
import { fruitApi } from "./store/fruitApi.store";

export const store = configureStore({
  reducer: {
    carsouel: FruitCarsouelReducer,
    [fruitCarsouelApi.reducerPath]: fruitCarsouelApi.reducer,
    [tagTypeApi.reducerPath]: tagTypeApi.reducer,
    [fruitApi.reducerPath]: fruitApi.reducer,
  },
  // Thêm api middleware để enable các tính năng như caching, invalidation, polling của rtk-query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(fruitCarsouelApi.middleware)
      .concat(tagTypeApi.middleware)
      .concat(fruitApi.middleware),
});

// Optional, nhưng bắt buộc nếu dùng tính năng refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);
