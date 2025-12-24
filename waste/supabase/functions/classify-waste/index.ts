/// <reference path="../deno-types.d.ts" />


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WASTE_CATEGORIES = [
  "organic",
  "recyclable",
  "non-recyclable",
  "e-waste",
  "hazardous",
  "medical",
  "construction"
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Starting waste classification with AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert waste classification AI. Analyze images and classify waste into exactly one of these categories:
- organic: Food scraps, plant matter, biodegradable materials
- recyclable: Paper, cardboard, glass, metal cans, plastic bottles
- non-recyclable: Mixed plastics, styrofoam, contaminated materials
- e-waste: Electronics, batteries, cables, appliances
- hazardous: Chemicals, paints, solvents, pesticides, fluorescent bulbs
- medical: Syringes, bandages, medications, medical devices
- construction: Concrete, bricks, wood, tiles, drywall

You MUST respond with valid JSON only, no other text. Use this exact format:
{"category": "category_name", "confidence": 85, "items_detected": ["item1", "item2"], "reasoning": "Brief explanation"}

The confidence should be a number between 60-99 based on how certain you are.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Classify the waste in this image. Respond with JSON only."
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI classification failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI Response:", content);

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No classification result from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response from AI
    let classification;
    try {
      // Remove any markdown code block formatting if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      classification = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, content);
      return new Response(
        JSON.stringify({ error: "Failed to parse classification result" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the category
    const category = classification.category?.toLowerCase();
    if (!WASTE_CATEGORIES.includes(category)) {
      console.error("Invalid category returned:", category);
      return new Response(
        JSON.stringify({ error: "Invalid waste category identified" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Classification successful:", classification);

    return new Response(
      JSON.stringify({
        category: category,
        confidence: Math.min(99, Math.max(60, classification.confidence || 85)),
        items_detected: classification.items_detected || [],
        reasoning: classification.reasoning || ""
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in classify-waste function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
