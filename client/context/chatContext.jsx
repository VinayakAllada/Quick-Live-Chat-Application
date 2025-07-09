import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from './AuthContext';
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({}); // {User id: count}

    const { socket, axios } = useContext(AuthContext);

    // Get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users');
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Send message to selected user (UPDATED)
    const sendMessages = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);

            if (data.success) {
                // Add to current user's chat window
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);

                // Emit to recipient using socket
                socket.emit("sendMessage", {
                    to: selectedUser._id,
                    message: data.newMessage
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Subscribe to socket messages
    const subscribeToMessages = () => {
        if (!socket) return;

        socket.off('newMessage'); // Prevent duplicate listeners

        socket.on('newMessage', (newMessage) => {
            // If the message is for the currently open chat
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                // Message is for another user — increment unseen count
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
                        ? prevUnseenMessages[newMessage.senderId] + 1
                        : 1
                }));
            }
        });
    }

    const unsubscribeFromMessages = () => {
        if (socket) socket.off('newMessage');
    }

    // Re-subscribe on socket/selectedUser change
    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser]);

    // Clear unseen count when opening chat
    useEffect(() => {
        if (selectedUser && unseenMessages[selectedUser._id]) {
            setUnseenMessages(prev => ({
                ...prev,
                [selectedUser._id]: 0
            }));
        }
    }, [selectedUser]);

    // Fetch messages on chat change
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        setMessages,
        sendMessages,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}
