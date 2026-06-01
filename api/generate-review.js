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
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.GEMINI_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 150,
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );
      
      const data = await res.json();
      console.log("Full response:", JSON.stringify(data));
      
      const text = data.content && data.content[0] && data.content[0].text
        ? data.content[0].text.trim()
        : null;
  
      const data = await geminiRes.json();
      console.log("Full Gemini response:", JSON.stringify(data));
  
      const candidate = data.candidates && data.candidates[0];
      const part = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0];
      const text = part && part.text ? part.text.trim() : null;
  
      if (!text) return res.status(500).json({ error: "Empty response from Gemini" });
  
      return res.status(200).json({ review: text });
  
    } catch (error) {
      console.log("Catch error:", error);
      return res.status(500).json({ error: "Failed to generate review" });
    }
  }