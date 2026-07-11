import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const SYSTEM_PROMPT = `You are Nova, the friendly and helpful AI shopping assistant for Nav-eCOM — a modern e-commerce platform. Your personality is warm, enthusiastic, and knowledgeable.

KEY INFORMATION ABOUT Nav-eCOM:
- Website: Nav-eCOM (formerly Z Shop) — "Shop smarter, live better"
- Free shipping on orders over $99
- 30-day returns, no questions asked
- Secure 256-bit payment encryption
- Promo codes: WELCOME15 (15% off), SAVE10 (10% off), FESTIVE20 (20% off), ZPRIME25 (25% off), FREESHIP (free shipping)
- Currencies supported: USD, EUR, GBP, CNY, JPY
- Customer support email: support@navecom.com
- Phone: 1-800-NECOM-01
- Based in San Francisco, CA
- Categories: Electronics, Computers, Audio, Home & Kitchen, Fashion, Books, Sports, Beauty, Toys & Games, Grocery
- Loyalty program available, gift cards available
- Users can compare up to 3 products at a time

YOUR BEHAVIOR:
- Always be helpful, concise, and conversational
- Use emojis occasionally to be friendly (👋 🎉 ✨ 🛒 📦 🚚)
- When asked about products, give helpful shopping advice
- When asked about orders, explain how to track them in their account
- When asked about shipping, mention the free $99+ threshold and typical delivery times
- When asked about returns, explain the 30-day no-questions-asked policy
- When asked about deals, mention available promo codes
- If you don't know something specific, be honest and direct them to support@navecom.com
- Keep responses concise (2-4 sentences unless more detail is needed)
- Never make up product prices or specific inventory details
- If asked about things unrelated to shopping/e-commerce, briefly answer if you can but guide the conversation back to helping with Nav-eCOM`

// In-memory session storage (simple approach for demo)
const sessions = new Map<string, { history: Array<{ role: string; content: string }> }>()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, sessionId, history } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build conversation history for context
    const sessionHistory = history || []
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...sessionHistory.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 512,
      top_p: 0.9,
    })

    const response = completion.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again."

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error('Chat API error:', error?.message || error)

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'AI service authentication failed. Please check the API key.' },
        { status: 503 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { response: "I'm getting too many requests right now. Please wait a moment and try again. 🕐" },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    )
  }
}

// Clear chat session
export async function DELETE(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId')
  if (sessionId) {
    sessions.delete(sessionId)
  }
  return NextResponse.json({ ok: true })
}
