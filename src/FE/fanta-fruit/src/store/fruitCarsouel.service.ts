import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { FruitCarsouel } from '../type/fruitCarsouel.type'

export const fruitCarsouelApi = createApi({
    reducerPath: 'blogApi', // Tên field trong Redux state
    tagTypes: ['Posts'], // Những kiểu tag cho phép dùng trong blogApi
    keepUnusedDataFor: 10, // Giữ data trong 10s sẽ xóa (mặc định 60s)
    baseQuery: fetchBaseQuery({
      baseUrl: 'http://localhost:3000/',
      prepareHeaders(headers) {
        headers.set('authorization', 'Bearer ABCXYZ')
        return headers
      }
    }),
    endpoints: (build) => ({
      // Generic type theo thứ tự là kiểu response trả về và argument
      getCarsouels: build.query<FruitCarsouel[], {limit: number}>({

        query: ({limit}) => {
            const params = new URLSearchParams();
            if (limit) params.append('limit', limit.toString());

            return `carsouel?${params.toString()}`
      },
        })
    })
})

export const {useGetCarsouelsQuery} = fruitCarsouelApi