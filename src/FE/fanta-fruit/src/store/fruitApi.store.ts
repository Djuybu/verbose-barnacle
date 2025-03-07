import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Fruit } from "../type/fruit.type";
import { FruitDTO } from "../type/fruitCarsouel.type";

export const fruitApi = createApi({
  reducerPath: "fruitApi", // Tên field trong Redux state
  tagTypes: ["Posts"], // Những kiểu tag cho phép dùng trong blogApi
  keepUnusedDataFor: 10, // Giữ data trong 10s sẽ xóa (mặc định 60s)
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    prepareHeaders(headers) {
      headers.set("authorization", "Bearer ABCXYZ");
      return headers;
    },
  }),
  endpoints: (build) => ({
    // Generic type theo thứ tự là kiểu response trả về và argument
    getFruitList: build.query<FruitDTO[], { tag: string; limit: number }>({
      query: ({ tag, limit }) => {
        const params = new URLSearchParams();
        if (tag) params.append("tags", tag.toString());
        if (limit) params.append("limit", limit.toString());
        return `fruits?${params.toString()}`;
      },
    }),
    getFruit: build.query<Fruit, {id: string}>({
      query: ({id}) => {
        return `fruits/${id}`;
      }
    }),
    getFruitFromSearchQuery: build.query<FruitDTO[], {query: string}>({
      query: ({query}) => {
        const params = new URLSearchParams();
        if (query) params.append("query", query);
        return `fruits/search?${params.toString()}`
      }
    }),
  }),
});

export const {useGetFruitListQuery, useGetFruitQuery, useGetFruitFromSearchQueryQuery} = fruitApi