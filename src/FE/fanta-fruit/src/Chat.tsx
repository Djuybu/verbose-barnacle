import { useDispatch, useSelector } from "react-redux";
import {
  useInitializeChatQuery,
  usePushRequestMutation,
} from "./store/chat.service";
import { addChatToHistory, setChatId } from "./store/chat.store";
import { useEffect, useState } from "react";

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const chatData = useSelector((state) => state);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const { data: id, isFetching: isFetchingId } = useInitializeChatQuery();
  const [pushMessage, pushMessageResult] = usePushRequestMutation();
  useEffect(() => {
    if (pushMessageResult.data !== undefined && pushMessageResult.isSuccess) {
      dispatch(
        addChatToHistory({
          id: pushMessageResult.data.id,
          content: pushMessageResult.data.content,
          role: "Assistant",
        })
      );
    }
  }, [pushMessageResult]);
  if (!isFetchingId && id !== undefined) {
    dispatch(setChatId(id));
  }
  return (
    <>
      <input
        type="text"
        name=""
        id=""
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setCurrentMessage(e.target.value);
        }}
      />
      <button
        onClick={() => {
          const newMessage = {
            id: id ? id : "",
            content: currentMessage,
            role: "Customer",
          };
          dispatch(addChatToHistory(newMessage));
          pushMessage(newMessage);
        }}
      >
        Chat
      </button>
    </>
  );
};

export default Chat;
