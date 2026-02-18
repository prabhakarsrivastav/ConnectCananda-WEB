import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, agentType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Customize system prompt based on agent type
    const systemPrompts: Record<string, string> = {
      immigration: "You are an expert Canadian immigration consultant AI. Provide detailed, accurate guidance on Express Entry, PR applications, visa requirements, and immigration pathways. Be professional, empathetic, and cite official sources when possible.",
      career: "You are a professional career counselor specializing in the Canadian job market. Help with resume optimization, job search strategies, interview preparation, and career transitions. Provide actionable, specific advice.",
      business: "You are a business startup expert for Canada. Guide users through business registration, incorporation, business plans, regulatory compliance, and funding options. Be practical and detail-oriented.",
      settlement: "You are a settlement services expert for newcomers to Canada. Assist with housing, healthcare, banking, education, and daily essentials. Provide warm, helpful guidance for smooth integration into Canadian life.",
      legal: "You are a legal advisor specializing in Canadian law for newcomers. Provide guidance on tenant rights, employment law, consumer protection, and legal procedures. Be clear and practical.",
      finance: "You are a financial advisor for newcomers to Canada. Help with banking, credit building, taxes, investments, and financial planning. Provide actionable financial advice.",
      education: "You are an education counselor for Canadian schools and universities. Assist with school applications, credential assessment, student visa, and educational pathways. Be informative and supportive.",
      health: "You are a healthcare navigator for Canada's system. Guide users on OHIP, finding doctors, mental health services, and medical procedures. Be compassionate and informative.",
    };

    const systemPrompt = systemPrompts[agentType] || systemPrompts.immigration;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
