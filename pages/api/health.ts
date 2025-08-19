import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY; // optional
  return res.status(200).json({ hasSupabaseUrl, hasAnon, hasOpenAI, ok: hasSupabaseUrl && hasAnon });
}
