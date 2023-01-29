import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import bot from "../assets/ropot.png";
import user from "../assets/user.png";
import { FaLocationArrow } from "react-icons/fa";
import ReactTypingEffect from "react-typing-effect";

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [stop, setStop] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [prompt, setPrompt] = useState("");
  const refChat = useRef(null);
  const refTextArea = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStop(false); // set  stop false

    // Store the textarea value in the messages state
    setMessages([...messages, { isAi: false, value: prompt }]);
    try {
      const response = await axios.post("https://ai-pxtt.onrender.com", {
        prompt: prompt,
      });
      // add the AI response to the messages array
      setMessages([
        ...messages,
        { isAi: false, value: prompt },
        { isAi: true, value: response.data.bot.trim() },
      ]);
      // empty prompt
      setPrompt("");
      stops(response.data.bot.trim()); // execute stops function after the AI response
    } catch (err) {
      setMessages([...messages, { isAi: true, value: "Something went wrong" }]);
      alert(err);
    }
  };
  const stops = (value) => {
    // this function to stop typing effect after text finsh
    const typingSpeed = 70;
    const text = value;
    const typingTime = text.length * typingSpeed;
    setTimeout(() => {
      setStop(true);
    }, typingTime);
  };

  //update value of scrollHeight state when messages array changes and make intervel to update value of scrollHeight
  useEffect(() => {
    const intervel = setInterval(() => {
      setScrollHeight(refChat.current.scrollHeight);
    }, 4000);
    return () => {
      clearInterval(intervel);
    };
  }, [messages]);

  useEffect(() => {
    // scroll to bottom when scrollHeight changes
    refChat.current.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    });
  }, [scrollHeight]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };
// focus on input field when loud site
  useEffect(()=>{
    refTextArea.current.focus()
  },[])
  return (
    <>
      <div id="chat_container" ref={refChat}>
        {messages.map((message, index) => (
          <div className="wrapper" key={index}>
            <div className={`chat ${message.isAi ? "ai" : "user"}`}>
              <div className="profile">
                <img
                  src={message.isAi ? bot : user}
                  alt={message.isAi ? "bot" : "user"}
                />
              </div>
              <div className="message">
                {message.isAi ? ( // if the message is ai applay type effect
                  index === messages.length - 1 && !stop ? ( // aplay effect on last message
                    <ReactTypingEffect
                      text={message.value}
                      speed={70}
                      repeat={"false"}
                    />
                  ) : (
                    // if stop is true then stop typing effect by replacing by default message
                    message.value
                  )
                ) : (
                  // if message is user then display with in effect
                  message.value.trim()
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} onKeyDown={(e) => handleKeyDown(e)}>
        <textarea
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          ref={refTextArea}
        ></textarea>
        <button type="submit">
          <FaLocationArrow size={22} />
        </button>
      </form>
    </>
  );
}

export default ChatContainer;
