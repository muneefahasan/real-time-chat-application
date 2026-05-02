/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    //function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    //function to get message for selected user 
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        } 
    };
        
    //function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    //function to subscribe to message for selected user
    const subscribeToMessages = () => {
        if (!socket) return;
        socket.on("newMessage", (message) => {
            if (selectedUser && message.senderId === selectedUser._id) {
                message.seen = true;
                setMessages((prevMessages) => [...prevMessages, message]);
                axios.get(`/api/messages/mark/${message._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [message.senderId]: prevUnseenMessages[message.senderId] ? prevUnseenMessages[message.senderId] + 1 : 1
                }));
            }
        });
    };

    //function to unsubscribe from messages 
    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    };

    useEffect(() => {
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        };
    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        getMessages,
        getUsers,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};