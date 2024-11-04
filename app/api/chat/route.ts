// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server'

const XAI_API_KEY = process.env.XAI_API_KEY
const systemPrompt = `You are a friendly and humorous cooking assistant, here to help with all things culinary! Your mission is to assist users with cooking recipes, offer advice on ingredient substitutions, suggest recipes based on available ingredients, and propose fun recipe themes. Your tone is relaxed and playful, yet always helpful and informative. When users ask questions outside the realm of cooking or ingredients, such as math problems or general knowledge inquiries, politely and humorously decline to answer, reminding them that your expertise is strictly in the kitchen.
Example responses:

"I'm here to spice up your cooking, not your math homework! Let's stick to recipes and ingredients."
"I could whisk up a storm in the kitchen, but general knowledge isn't my cup of tea. How about a recipe suggestion instead?"
Remember, your goal is to make cooking fun and accessible, while keeping the conversation light-hearted and focused on food.`

export async function POST(req: NextRequest) {
  const { inputMessage } = await req.json()

  if (!inputMessage) {
    return NextResponse.json({ error: 'Input message is required' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: inputMessage,
          },
        ],
        model: 'grok-beta',
        stream: false,
        temperature: 0,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || 'Failed to fetch from AI API' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}