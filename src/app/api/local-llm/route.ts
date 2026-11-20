import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();

    const response = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const duration = Date.now() - startTime;
      logger.api('/api/local-llm', 'POST', response.status, duration, undefined, `LM Studio error: ${errorText}`);
      return NextResponse.json(
        { error: "LM Studio request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const duration = Date.now() - startTime;
    logger.api('/api/local-llm', 'POST', 200, duration);
    return NextResponse.json(data);
  } catch (err) {
    const duration = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    logger.api('/api/local-llm', 'POST', 500, duration, undefined, errorMessage);
    return NextResponse.json(
      { error: "Failed to connect to LM Studio. Ensure it's running on port 1234." },
      { status: 500 }
    );
  }
}