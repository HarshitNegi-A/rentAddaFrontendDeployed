import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const API ="https://rentaddabackenddeployed.up.railway.app"

const ChatRoom = () => {
  const { bookingId } = useParams();
  const { token } = useContext(AuthContext);

  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [messageInput, setMessageInput] = useState("");
  const scrollRef = useRef();

  // ✅ Step 1: Get chat room ID for this booking
  const fetchChatRoom = async () => {
    const res = await axios.get(`${API}/chat/room/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setChatRoomId(res.data.chatRoomId);
  };

  // ✅ Step 2: Poll for messages every 2 seconds
  const fetchMessages = async () => {
    if (!chatRoomId) return;

    const res = await axios.get(`${API}/chat/messages/${chatRoomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessages(res.data.messages);
  };

  // ✅ First get chatRoomId
  useEffect(() => {
    fetchChatRoom();
  }, [token]);

  // ✅ Polling — runs only when chatRoomId exists
  useEffect(() => {
    if (!chatRoomId) return;

    fetchMessages(); // initial load

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [chatRoomId]);

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    await axios.post(
      `${API}/chat/send`,
      {
        chatRoomId,
        content: messageInput,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessageInput("");
    fetchMessages(); // refresh immediately
  };

  if (chatRoomId === null)
    return <p className="p-6">Chat not available yet. Waiting for acceptance…</p>;

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col border rounded-xl shadow-lg p-4 bg-white">
      
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
        Chat Room (Booking #{bookingId})
      </h2>

      {/* ✅ Messages Area */}
      <div className="flex-1 overflow-y-scroll p-3 border rounded-lg bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${
              msg.senderId === Number(localStorage.getItem("userId"))
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-2 max-w-xs rounded-lg shadow ${
                msg.senderId === Number(localStorage.getItem("userId"))
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={scrollRef}></div>
      </div>

      {/* ✅ Input Box */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border p-3 rounded-lg"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
