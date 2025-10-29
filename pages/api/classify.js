export default async function handler(req, res) {
  try {
    const { emails, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "API key is missing" });
    }

    if (!emails?.length) {
      return res.status(400).json({ error: "No emails provided" });
    }

    const prompt = `Classify the following email subjects into one of these categories: Important, Promotions, Social, Marketing, Spam, or General.\n\n${emails
      .map((e, i) => `${i + 1}. ${e.subject}`)
      .join("\n")}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // ✅ updated model
        messages: [
          {
            role: "system",
            content: "You are an email classification assistant.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    console.log("🔍 Full Groq API response:", JSON.stringify(data, null, 2));

    const categories =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "No categories returned.";

    res.status(200).json({ categories });
  } catch (error) {
    console.error("❌ Groq classify API error:", error);
    res.status(500).json({ error: error.message });
  }
}
