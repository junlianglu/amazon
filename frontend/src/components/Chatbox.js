import React, { useState, useRef, useEffect } from 'react';
import './Chatbox.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Chatbox = ({ product }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi, this is our virtual assistant!👋" },
    { role: 'assistant', content: "Tell us how we can help." }
  ]);
  const [input, setInput] = useState('');
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const keywords = product
  ? ["category", "brand", "price"] // Product-specific keywords
  : ["How can I track my order?", "What is the return policy?", "How do I change my shipping address?"]; // General keywords

  const handleSendMessage = async (messageContent) => {
    let scope = '';
    if (product) {
      scope = `${product.name}.  ${product.description}.  The current price for this product is ${product.price}.  The product is categorized as: ${product.category}.  ` + (product.brand 
        ? `The product's brand is: ${product.brand}.  `
        : `The product has no brand.  `) + `Given the above information, answer the following question for user: `;
    }
    const userMessage = { role: 'user', content: scope + messageContent || (scope + input) };
    setMessages((prev) => [...prev, { role: 'user', content: messageContent || input }]);
    setInput('');

    // Handle product-specific questions
    // if (product && detectProductQuery(userMessage.content)) {
    //   setMessages((prev) => [...prev, { role: 'assistant', content: formatProductResponse(userMessage.content) }]);
    //   return;
    // }

    // Send to OpenAI or other backend service if it's a general question
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [userMessage],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.choices[0]?.message?.content || 'No response' }]);
      } else {
        alert('Error sending message');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I couldn't get a response." }]);
    }
  };

  const handleKeywordClick = (keyword) => {
    handleSendMessage(keyword);
  };

  function detectProductQuery(query) {
    return keywords.some(keyword => query.toLowerCase().includes(keyword));
  }
  
  function formatProductResponse(query) {
    if (query.toLowerCase().includes("category")) {
      return `The product is categorized as: ${product.category}.`;
    }
    
    if (query.toLowerCase().includes("brand")) {
      return product.brand 
        ? `The product's brand is: ${product.brand}.`
        : `The product has no brand.`
    }
    
    if (query.toLowerCase().includes("price")) {
      return `The current price for this product is $${product.price}.`;
    }

    return '';
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatboxOpen) {
      scrollToBottom();
    }
  }, [messages, isChatboxOpen]);

  return (
    <div>
      {!isChatboxOpen && (
        <button onClick={() => setIsChatboxOpen(true)} className="contact-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24px"
            height="24px"
            style={{ marginRight: '8px' }}
          >
            <path d="M12 3C7.03 3 3 6.91 3 11.5c0 2.38 1.09 4.54 2.91 6.05L3 21l3.64-1.06C8.32 20.31 10.13 21 12 21c4.97 0 9-3.91 9-8.5S16.97 3 12 3zm0 15c-1.48 0-3.04-.53-4.31-1.38l-.6-.43L6 17l.52-.65-.27-.21C5.04 14.9 4 13.3 4 11.5 4 7.91 7.13 5 12 5s8 2.91 8 6.5-3.13 6.5-8 6.5z"/>
          </svg>
          Contact Us
        </button>
      )}

      {isChatboxOpen && (
        <div className="chatbox-wrapper">
          <div className="chat-container">
            <div className="header">
              <span>Chat with us</span>
              <button onClick={() => setIsChatboxOpen(false)} className="close-button">X</button>
            </div>
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="message"
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.role === 'user' ? '#DCF8C6' : '#E8E8E8',
                  }}
                >
                  {msg.content}
                </div>
              ))}
              {/* Display clickable keywords only after the last bot response */}
              {messages[messages.length - 1]?.role === 'assistant' && (
                <div className="keywords-container" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {keywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleKeywordClick(keyword)}
                      className="keyword-button"
                      style={{
                        padding: '5px 10px',
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        backgroundColor: '#f1f1f1'
                      }}
                    >
                      {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="input"
              />
              <button onClick={() => handleSendMessage()} className="send-button">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
