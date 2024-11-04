'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChefHat, Send, Utensils, Coffee, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageCounter = useRef(0)

  // Create a stable message ID
  const createMessageId = () => {
    messageCounter.current += 1
    return `msg-${messageCounter.current}`
  }

  // Safe scroll to bottom
  const scrollToBottom = () => {
    if (typeof window !== 'undefined') {
      const timeoutId = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Safe focus input
  useEffect(() => {
    if (typeof window !== 'undefined') {
      inputRef.current?.focus()
    }
  }, [])

  // Add a welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage = "Hello! I'm your friendly cooking assistant. I can help you with recipes, suggest ingredients, and more. Let's get cooking!"
    addMessage(welcomeMessage, 'bot')
  }, [])

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [
      ...prev,
      { id: createMessageId(), text, sender }
    ])
  }

  const handleSend = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    setIsLoading(true)
    addMessage(trimmedInput, 'user')
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputMessage: trimmedInput }),
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error('Invalid response format from server')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API')
      }

      addMessage(data.choices[0].message.content, 'bot')
    } catch (error) {
      console.error('Chat error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to get response')
      addMessage("I'm sorry, I'm having trouble connecting right now. Please try again.", 'bot')
    } finally {
      setIsLoading(false)
      if (typeof window !== 'undefined') {
        inputRef.current?.focus()
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
          <AnimatePresence initial={false}>
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
                  } whitespace-pre-wrap`}
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
              ref={inputRef}
              type="text"
              placeholder="Ask about a recipe..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-grow bg-gray-600 text-white placeholder-gray-400 border-gray-500"
            />
            <Button 
              type="submit" 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2" size={16} />
              )}
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