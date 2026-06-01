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

const prompt = `Write a single short Google review in ONE paragraph, maximum 2-3 sentences and under 40 words.
from the perspective of ${persona}.
The company is Dip Projects — a professional Project Management Consultancy (PMC) firm specializing in civil construction projects including residential buildings, commercial complexes, and industrial infrastructure in India.
They provide services like project planning, site supervision, contractor coordination, quality control, and timely delivery.
Be specific to civil construction project management. No quotation marks, no star ratings, no labels. Just the review text.`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 150,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    console.log("Full Groq response:", JSON.stringify(data));

    const text = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content.trim()
      : null;

    if (!text) return res.status(500).json({ error: "Empty response" });

    return res.status(200).json({ review: text });

  } catch (error) {
    console.log("Catch error:", error);
    return res.status(500).json({ error: "Failed to generate review" });
  }
}
