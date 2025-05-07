import styles from "./css/Home.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faGear,
  faUser,
  faUserGroup,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import astronaut from "../assets/astronaut.png";
import { getChats, sendMessage } from "../api/chats";
import ChatLabel from "../components/ChatLabel";
import Message from '../components/Message';

const Home = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;
      try {
        const chatsData = await getChats(user.id);
        console.log("Chats data: ",chatsData);
        const chatsFormatted = chatsData.map((chat) => ({
          id: chat.id,
          name: chat.name,
          isGroup: chat.isGroup,
          participants: chat.participants.filter(
            (id) => id.user.id !== user.id
          ),
          messages: chat.messages,
        }));
        console.log("Formatted chats: ",chatsFormatted);
        setChats(chatsFormatted);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
    fetchChats();
  }, [user?.id]);

  const handleChatClick = (i) => {
    setActiveChatIndex(i);
    setSelectedChat(chats[i]);
  };

  const handleMessageSend = async () => {
    try {
      const newMessage = await sendMessage(newMsg, user.id, selectedChat.id);
      if(newMessage) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        }));
      };
    } catch (error) {
      console.error('Error sending message:', error)
    };
  };

  return (
    <section className={styles.home_cont}>
      <div
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        className={`${styles.mobile_menu_btn} ${
          mobileMenuOpen && styles.mobile_menu_btn_open
        }`}
      >
        <FontAwesomeIcon icon={mobileMenuOpen ? faArrowLeft : faArrowRight} />
      </div>
      <ul
        className={`${styles.mobile_menu} ${
          mobileMenuOpen && styles.mobile_menu_open
        }`}
      >
        {chats.length > 0 ? (
          chats.map((chat, index) => (
            <ChatLabel
              active={activeChatIndex === index}
              key={chat.id}
              chat={chat}
              handleClick={handleChatClick}
              index={index}
            />
          ))
        ) : (
          <span className={styles.empty_subtitle}>No chats Available</span>
        )}
        <button className={styles.add_btn}>+</button>
      </ul>
      <FontAwesomeIcon
        onClick={() => {
          navigate("/settings");
        }}
        icon={faGear}
        className={styles.settings_icon}
      />
      <div className={styles.chat_cont}>
      {!selectedChat ? (
          <>
            <img src={astronaut} alt="hi" className={styles.astronaut} />
            <p className={styles.empty_title}>No chat selected!</p>
            <p className={styles.empty_subtitle}>
              Select one from the chats menu!
            </p>
          </>
        ) : (
          <section className={styles.active_chat}>
            <div className={styles.contact_info}>
              <FontAwesomeIcon
                className={styles.icon}
                icon={selectedChat.isGroup ? faUserGroup : faUser}
              />
              <h2>
                {selectedChat.isGroup
                  ? selectedChat.name
                  : selectedChat.participants[0].user.username}
              </h2>
            </div>
            <ul className={styles.messages_cont}>
              {selectedChat.messages.map((msg) => (
                <Message
                  key={msg.id}
                  content={msg.content}
                  senderId={msg.senderId}
                  time={msg.createdAt}
                  isOwn={msg.senderId === user.id}
                />
              ))}
            </ul>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleMessageSend();
                setNewMsg('');
              }}
              className={styles.send_message_cont}
            >
              <input
                type="text"
                className={styles.send_message}
                placeholder="Send message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
              />
              <button disabled={!newMsg}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </section>
        )}
      </div>
    </section>
  );
};

export default Home;
