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
    const { profession, province, pathway } = await req.json();
    
    // Map inputs to Coursera search keywords
    const keywords = buildSearchKeywords(profession, province, pathway);
    
    // Fetch courses from Coursera API
    const courseraUrl = `https://www.coursera.org/api/courses.v1?q=search&query=${encodeURIComponent(keywords)}&limit=6`;
    
    console.log("Fetching from Coursera:", courseraUrl);
    
    const response = await fetch(courseraUrl);
    
    if (!response.ok) {
      console.error("Coursera API error:", response.status);
      // Return fallback results
      return new Response(
        JSON.stringify({ courses: getFallbackCourses(profession, pathway) }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }
    
    const data = await response.json();
    
    // Transform Coursera results
    const courses = (data.elements || []).slice(0, 6).map((course: any) => ({
      title: course.name || "Course Title",
      provider: "Coursera",
      description: course.description 
        ? course.description.substring(0, 100) + (course.description.length > 100 ? "..." : "")
        : "Enhance your skills with this professional course.",
      link: `https://www.coursera.org/learn/${course.slug}`,
      tags: getCategoryTags(course.domainTypes || [], profession)
    }));
    
    return new Response(
      JSON.stringify({ courses: courses.length > 0 ? courses : getFallbackCourses(profession, pathway) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error fetching courses:", error);
    
    return new Response(
      JSON.stringify({ 
        courses: getFallbackCourses("general", "express-entry")
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  }
});

function buildSearchKeywords(profession: string, province: string, pathway: string): string {
  const keywords = ["Canada"];
  
  // Add profession-specific keywords
  const professionMap: Record<string, string[]> = {
    "healthcare": ["healthcare", "nursing", "medical"],
    "it": ["technology", "software", "programming"],
    "engineering": ["engineering", "technical"],
    "business": ["business", "management", "finance"],
    "education": ["teaching", "education"],
    "trades": ["trades", "skilled work"]
  };
  
  keywords.push(...(professionMap[profession] || [profession]));
  
  // Add pathway keywords
  if (pathway === "study") keywords.push("student");
  if (pathway === "express") keywords.push("professional", "immigration");
  
  return keywords.join(" ");
}

function getCategoryTags(domainTypes: string[], profession: string): string[] {
  const tags = [];
  
  // Map to skill categories
  if (domainTypes.includes("language-learning") || profession === "general") {
    tags.push("Language");
  }
  if (domainTypes.includes("computer-science") || profession === "it") {
    tags.push("IT & Tech");
  }
  if (domainTypes.includes("business") || profession === "business") {
    tags.push("Business");
  }
  if (domainTypes.includes("health") || profession === "healthcare") {
    tags.push("Healthcare");
  }
  
  if (tags.length === 0) tags.push("Life Skills");
  
  return tags;
}

function getFallbackCourses(profession: string, pathway: string): any[] {
  const baseCourses = [
    {
      title: "Canadian Workplace English Communication",
      provider: "Coursera",
      description: "Master professional communication skills essential for success in Canadian workplaces.",
      link: "https://www.coursera.org/search?query=canadian%20workplace%20english",
      tags: ["Language", "Life Skills"]
    },
    {
      title: "Introduction to Canadian Business Culture",
      provider: "Coursera",
      description: "Learn the unwritten rules and cultural nuances of Canadian professional environments.",
      link: "https://www.coursera.org/search?query=canadian%20business%20culture",
      tags: ["Business", "Life Skills"]
    },
    {
      title: "Digital Skills for the Modern Workplace",
      provider: "Coursera",
      description: "Develop essential digital competencies for today's Canadian job market.",
      link: "https://www.coursera.org/search?query=digital%20skills%20workplace",
      tags: ["IT & Tech", "Business"]
    },
    {
      title: "Financial Literacy for Newcomers",
      provider: "Coursera",
      description: "Navigate Canadian banking, taxes, and financial systems with confidence.",
      link: "https://www.coursera.org/search?query=financial%20literacy%20canada",
      tags: ["Business", "Life Skills"]
    },
    {
      title: "Professional Networking & Career Development",
      provider: "Coursera",
      description: "Build connections and advance your career in the Canadian professional landscape.",
      link: "https://www.coursera.org/search?query=professional%20networking",
      tags: ["Business", "Life Skills"]
    },
    {
      title: "Canadian Healthcare System Overview",
      provider: "Coursera",
      description: "Understand how to access and navigate healthcare services in Canada.",
      link: "https://www.coursera.org/search?query=canadian%20healthcare",
      tags: ["Healthcare", "Life Skills"]
    }
  ];
  
  return baseCourses;
}
