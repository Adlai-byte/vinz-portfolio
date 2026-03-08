import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, inquiryType, customerType, projectType, aiSuggestions, description, budget, timeframe } =
    await request.json();

  const isCollab = inquiryType === "Collaboration / Join My Team";
  const text = [
    isCollab ? `🤝 *New Collaboration Request*` : `📩 *New Quote Request*`,
    ``,
    `*Inquiry Type:* ${escapeMarkdown(inquiryType || "Project Quote")}`,
    `*Name:* ${escapeMarkdown(name)}`,
    `*Email:* ${escapeMarkdown(email)}`,
    `*Customer Type:* ${escapeMarkdown(customerType || "Not specified")}`,
    `*Project Type:* ${escapeMarkdown(projectType || "Not specified")}`,
    `*AI Suggestions:* ${escapeMarkdown(aiSuggestions || "None")}`,
    ``,
    `*Project Description:*`,
    escapeMarkdown(description),
    ``,
    `*Expected Budget:* ${escapeMarkdown(budget || "Not specified")}`,
    `*Timeframe:* ${escapeMarkdown(timeframe || "Not specified")}`,
  ].join("\n");

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Telegram API error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
