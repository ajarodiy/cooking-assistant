'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChefHat, Send, Utensils, Coffee } from 'lucide-react'

type Message = {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (input.trim()) {
        const newMessage: Message = {
            id: messages.length + 1, 
            text: input,
            sender: 'user'
        };
        setMessages([...messages, newMessage]);
        setInput('');
        
        // Simulate bot response
        setTimeout(() => {
            setMessages(prev => [...prev, { id: prev.length + 1, text: "Here's a delicious recipe for you!", sender: 'bot' }]);
        }, 1000);
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 flex items-center"
      >
        <ChefHat className="mr-2" size={40} />
        Cooking Assistant
      </motion.div>
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <ScrollArea className="h-[60vh] p-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <Utensils className="inline-block mr-2" size={16} />
                  )}
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="p-4 bg-gray-700">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex space-x-2"
          >
            <Input
              type="text"
              placeholder="Ask about a recipe..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-gray-600 text-white placeholder-gray-400 border-gray-500"
            />
            <Button type="submit" variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Send className="mr-2" size={16} />
              Send
            </Button>
          </form>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 text-gray-400 flex items-center"
      >
        <Coffee className="mr-2" size={20} />
        Powered by AI Cooking Magic
      </motion.div>
    </div>
  )
}