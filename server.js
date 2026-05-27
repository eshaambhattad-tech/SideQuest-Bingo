import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, readFileSync } from 'fs'

// Load .env manually (no dotenv dep)
const envPath = join(dirname(fileURLToPath(import.meta.url)), '.env')
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach(line => {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
    })
}

const app = express()
app.use(cors())
app.use(express.json())

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.post('/api/generate', async (req, res) => {
  const { eventName, eventDescription } = req.body
  if (!eventName) return res.status(400).json({ error: 'eventName required' })

  const context = eventDescription ? `\nExtra context: ${eventDescription}` : ''

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Generate exactly 25 bingo square items for people attending: "${eventName}".${context}

Rules:
- Each item is a thing someone might SEE, HEAR, or DO at this event
- Keep each item SHORT (5 words max), punchy, and fun
- Make them specific to the event type — not generic
- Mix observation items ("Someone mentions AI") with action items ("Ask a speaker a question")
- Include at least 3 items that require the player to DO something
- One center square should be a FREE SPACE labeled "FREE SPACE"
- No duplicates

Return ONLY a JSON array of exactly 25 strings, no explanation, no markdown fences.
Example format: ["Item 1", "Item 2", ..., "FREE SPACE", ..., "Item 25"]`,
        },
      ],
    })

    const raw = message.content[0].text.trim()
    const items = JSON.parse(raw)

    if (!Array.isArray(items) || items.length !== 25) {
      return res.status(500).json({ error: 'AI returned wrong number of items' })
    }

    res.json({ items })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Serve built frontend in production
const distPath = join(dirname(fileURLToPath(import.meta.url)), 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (_, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
