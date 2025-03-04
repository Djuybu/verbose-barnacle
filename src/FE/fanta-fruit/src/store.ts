import { configureStore } from '@reduxjs/toolkit'
import FruitCarsouelReducer from './store/fruitCarsouel.store'
import { fruitCarsouelApi } from './store/fruitCarsouel.service'
import { setupListeners } from '@reduxjs/toolkit/query/react'

export const store = configureStore({
    reducer: {
      carsouel: FruitCarsouelReducer,
      [fruitCarsouelApi.reducerPath]: fruitCarsouelApi.reducer
    },
    // Thêm api middleware để enable các tính năng như caching, invalidation, polling của rtk-query
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(fruitCarsouelApi.middleware)
  })
  
  // Optional, nhưng bắt buộc nếu dùng tính năng refetchOnFocus/refetchOnReconnect
  setupListeners(store.dispatch)
