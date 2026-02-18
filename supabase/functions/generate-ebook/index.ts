import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating e-book for topic:", topic);

    // Generate e-book content using Lovable AI
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
            content: "You are an expert content writer specializing in Canadian immigration and settlement. Create comprehensive, practical e-book content that helps newcomers succeed in Canada."
          },
          {
            role: "user",
            content: `Create a comprehensive e-book about "${topic}" for newcomers to Canada. Include:
            
1. An engaging title
2. A detailed description (2-3 sentences)
3. Complete e-book content with:
   - Introduction
   - 5-7 main chapters with practical advice
   - Step-by-step guides where applicable
   - Real-world tips and examples
   - Common mistakes to avoid
   - Resources and next steps
   - Conclusion

Format the response as JSON with this structure:
{
  "title": "E-book title",
  "description": "Brief description",
  "content": "Full formatted content with chapters"
}`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const ebookData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!ebookData) {
      throw new Error("Failed to parse AI response");
    }

    // Create e-book in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: ebook, error: dbError } = await supabase
      .from('ebooks')
      .insert({
        title: ebookData.title,
        description: ebookData.description,
        pdf_url: `ai-generated/${Date.now()}.txt`, // Placeholder for content
        is_free: true,
        price: 0,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Store the content in storage
    const contentBlob = new Blob([ebookData.content], { type: 'text/plain' });
    const fileName = `${ebook.id}.txt`;
    
    const { error: storageError } = await supabase.storage
      .from('ebook-files')
      .upload(fileName, contentBlob, {
        contentType: 'text/plain',
        upsert: true
      });

    if (storageError) {
      console.error("Storage error:", storageError);
    } else {
      // Update the pdf_url with the actual file path
      await supabase
        .from('ebooks')
        .update({ pdf_url: fileName })
        .eq('id', ebook.id);
    }

    console.log("E-book generated successfully:", ebook.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        ebook: {
          ...ebook,
          content: ebookData.content
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating e-book:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
