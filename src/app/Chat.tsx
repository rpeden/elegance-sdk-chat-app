import { useState, useEffect } from "react";
import { eleganceClient } from "@/services/eleganceClient";
import {
  MinChatUiProvider,
  MainContainer,
  MessageInput,
  MessageContainer,
  MessageList,
  MessageHeader,
} from "@minchat/react-chat-ui";


type ChatProps = {
  // The collection name that contains the embeddings
  collection: string;
};

type ChatMessage = {
    user: { name: "User" | "AI" },
    content: string
}

const Chat = ({ collection }: ChatProps) => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Define the chat completion hook using the Elegance SDK
  const chatCompletion = eleganceClient.hooks.useSearchChatCompletion();
  // Define the effect to generate text using ChatGPT
  useEffect(() => {
    if (input) {
      // Get the chat completion function from the hook
      const { execute: getChatCompletion } = chatCompletion;
      // Call the chat completion function with the input and the collection
      getChatCompletion({
        prompt: input,
        collection: collection,
        embeddingField: "embedding",
        textField: "text",
      });
    }
  }, [input, collection, chatCompletion]);

  // Define the effect to add the chat messages to the state
  useEffect(() => {
    if (chatCompletion.value) {
      // Create a new message object for the user input
      const userInputMessage: ChatMessage = {
        user: { name: "User" },
        content: input,
      };
      // Create a new message object for the chat completion
      const chatCompletionMessage: ChatMessage = {
        user: { name: "AI" },
        content: chatCompletion.value.content || "",
      };

      // Add the new messages to the state
      setMessages([...messages, userInputMessage, chatCompletionMessage]);
      // Clear the input state
      setInput("");
    }
  }, [chatCompletion.value, input, messages]);

  return (
    <MinChatUiProvider theme="#6ea9d7">
      <MainContainer>
        <MessageContainer>
          <MessageHeader />
          <MessageList
            currentUserId="user"
            messages={messages}
          />
          <MessageInput
            placeholder="Enter your question here..."
          />
        </MessageContainer>
      </MainContainer>
    </MinChatUiProvider>
  );
};

export default Chat;
