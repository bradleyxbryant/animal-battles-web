import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { z } from 'zod';
import prompt from '@/lib/card_prompt';
import { mockGenerate } from '@/lib/mock';

const Body = z.object({ imageUrl: z.string().url(), notes: z.string().optional() });

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error:'POST only' });
  const parse = Body.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error:'Bad body' });
  const { imageUrl, notes } = parse.data;

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    // fallback mock so you can use the app without a key
    return res.json({ card: mockGenerate(notes || '') });
  }

  try {
    const client = new OpenAI({ apiKey: key });
    // NOTE: Some SDKs use different shapes for vision. If this errors,
    // switch image content part to { type: "image_url", image_url: { url: imageUrl } }.
    const resp = await client.responses.create({
      model: "gpt-4o-mini",
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: prompt + (notes ? `\n\nUser notes: ${notes}` : "") },
          { type: "input_image", image_url: imageUrl }
        ]
      }]
    });

    const text = (resp as any).output_text
      || (resp as any)?.choices?.[0]?.message?.content
      || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in model output");
    const card = JSON.parse(match[0]);
    return res.json({ card });
  } catch (e:any) {
    // graceful fallback
    return res.json({ card: mockGenerate(notes || ''), warning: e?.message || 'fallback used' });
  }
}
