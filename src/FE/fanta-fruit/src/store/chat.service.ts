import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { build, initialize } from "esbuild";
import { Message } from "../type/message.type";

export const chatApi = createApi({
  reducerPath: "chatApi",
  tagTypes: ["Chat"],
  keepUnusedDataFor: 100,
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
  }),
  endpoints: (build) => ({
    initializeChat: build.query<string, void>({
      query: () => "chat",
    }),
    getResponse: build.query<Message, { id: string; request: string }>({
      query: ({ id, request }) => ({
        url: "chat/",
        params: { id, request },
      }),
    }),
    pushRequest: build.mutation<Omit<Message, "role">, Omit<Message,"role">>({
      query(body){
        return{
          url: "chat/",
          method: 'POST',
          body: body
        }
      }
    })
  }),
});

export const {useLazyGetResponseQuery, usePushRequestMutation ,useInitializeChatQuery} = chatApi