export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/tutor") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405);
      }

      const AI_API_KEY = env.GROQ_API_KEY || env.OPENAI_API_KEY;
      if (!AI_API_KEY) {
        return json({ error: "The AI service key is not configured on this Worker." }, 503);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Please send a valid question." }, 400);
      }

      const level = String(body.level || "4");
      const message = String(body.message || "").trim().slice(0, 2000);
      const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
      const image = typeof body.image === "string" ? body.image : null;

      if (!message && !image) {
        return json({ error: "Please type a question or attach a photo." }, 400);
      }

      const input = [];
      for (const item of history) {
        if (!item || !["user", "assistant"].includes(item.role)) continue;
        if (typeof item.content !== "string") continue;
        input.push({ role: item.role, content: item.content.slice(0, 4000) });
      }

      const content = [];
      if (message) content.push({ type: "input_text", text: message });
      if (image && /^data:image\/(jpeg|png|webp);base64,/.test(image)) {
        content.push({ type: "input_image", image_url: image });
      }

      input.push({ role: "user", content });

      let aiResponse;
      try {
        aiResponse = await fetch("https://api.groq.com/openai/v1/responses", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + AI_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: env.GROQ_MODEL || "openai/gpt-oss-20b",
            instructions:
              "You are Nathi, a patient Mathematics tutor for South African NC(V) learners at Levels 2, 3 and 4. " +
              "Teach step by step in clear, simple English. Explain the mathematical reason for each step. " +
              "Do not merely give the final answer. Use correct mathematical notation, check calculations, " +
              "and ask one short guiding question when the learner has not supplied enough information. " +
              "Respect the selected level: NC(V) Level " + level + ". If an image is provided, read the question carefully. " +
              "If any part is unclear, say exactly what cannot be read rather than guessing.",
            input,
            max_output_tokens: 1200
          })
        });
      } catch {
        return json({ error: "Could not reach the AI service. Please try again." }, 502);
      }

      const result = await aiResponse.json().catch(() => ({}));
      if (!aiResponse.ok) {
        const message = result && result.error && result.error.message
          ? result.error.message
          : "The AI service rejected the request. Check API billing and model access.";
        return json({ error: message }, aiResponse.status);
      }

      const answer = (result.output || [])
        .flatMap(item => item.content || [])
        .filter(item => item.type === "output_text")
        .map(item => item.text)
        .join("\n")
        .trim();

      if (!answer) {
        return json({ error: "The AI service returned an empty answer. Please try again." }, 502);
      }

      return json({ answer });
    }

    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Nathi & Maths assets are not configured on this Worker.", { status: 404 });
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
