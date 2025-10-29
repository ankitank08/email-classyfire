import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const { accessToken } = req.query;

    // 🧩 Validate token
    if (!accessToken) {
      console.error("❌ Missing access token in request query");
      return res.status(400).json({ error: "Missing access token" });
    }

    console.log("🟢 Gmail API called with token:", accessToken.slice(0, 20));

    // 🔐 Initialize OAuth2 with environment credentials
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    console.log("📨 Fetching emails from Gmail API...");

    const { data } = await gmail.users.messages.list({
      userId: "me",
      maxResults: 15, // you can adjust this number
    });

    const messages = [];
    for (const msg of data.messages || []) {
      const msgData = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });
      const subject = msgData.data.payload.headers.find(
        (h) => h.name === "Subject"
      )?.value;
      messages.push({ id: msg.id, subject });
    }

    console.log("✅ Emails fetched successfully:", messages.length);
    res.status(200).json({ emails: messages });
  } catch (err) {
    console.error("❌ Gmail API Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
}
