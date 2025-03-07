import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import TagType from '../type/tagtype.type'

export const tagTypeApi = createApi({
    reducerPath: 'tagTypeApi', // Tên field trong Redux state
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
      getTagTypeList: build.query<TagType[], void>({
        query: () => "/tagtype"
      })
      
    })
})

export const {useGetTagTypeListQuery} = tagTypeApi