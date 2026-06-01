export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { category } = req.body;
  
    const categoryPrompts = {
      residential: "a homeowner who hired Dip Projects for residential construction management",
      commercial:  "a business owner who used Dip Projects for commercial project management",
      industrial:  "an industrial client who worked with Dip Projects on an infrastructure project",
      employer:    "a business partner reviewing Dip Projects as an organization",
      employee:    "an employee sharing their work experience at Dip Projects",
      general:     "a satisfied client giving a general review of Dip Projects PMC services",
    };
  
    const persona = categoryPrompts[category] || categoryPrompts.general;
  
    const prompt = `Write a short, genuine Google review (2–3 sentences, max 60 words) 
  from the perspective of ${persona}. Keep it natural, specific, and human. 
  Vary the tone and wording every time. 
  Do NOT include quotation marks, star ratings, or labels. Just the review text.`;
  
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
  
      const data = await geminiRes.json();
      const candidate = data.candidates && data.candidates[0];
      const part = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0];
      const text = part && part.text ? part.text.trim() : null;
  
      if (!text) return res.status(500).json({ error: "Empty response from Gemini" });
  
      return res.status(200).json({ review: text });
  
    } catch (error) {
      return res.status(500).json({ error: "Failed to generate review" });
    }
  }