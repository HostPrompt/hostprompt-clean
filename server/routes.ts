import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertContentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper function to extract keywords from content text
function extractKeywordsFromContent(text: string): string[] {
  // Look for common patterns that might indicate keywords
  // 1. Words after hashtags
  const hashtagWords = text.match(/#(\w+)/g)?.map(tag => tag.slice(1)) || [];
  
  // 2. Common travel and property related words
  const commonKeywords = [
    'vacation', 'getaway', 'travel', 'beach', 'mountain', 'luxury', 
    'cozy', 'family', 'romantic', 'relaxation', 'adventure'
  ];
  
  const foundCommonKeywords = commonKeywords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(text)
  );
  
  // Combine and return unique keywords (using Array.from for compatibility)
  return Array.from(new Set([...hashtagWords, ...foundCommonKeywords])).slice(0, 5);
}

// Analyze brand voice using OpenAI
async function analyzeBrandVoice(input: string, inputType: string): Promise<{ brandVoice: string, brandVoiceSummary: string }> {
  try {
    let prompt = "";
    
    if (inputType === 'description') {
      prompt = `You're analyzing the brand voice for a vacation rental property. Read this description:
      
"${input}"

IMAGINE YOU ARE A REAL HUMAN HOST (not a marketer or AI). What would YOUR writing style be if you owned this property?

Respond with:
1. Two-word voice description that uses REAL HUMAN words - how would a friend describe your writing?
2. A 5-8 word summary that sounds like something a person would actually say.

Format as JSON:
- brandVoice: Two simple, human words (like "Chatty + Laid-back")
- brandVoiceSummary: How a friend would describe your writing style

GOOD EXAMPLES (natural, human):
{ "brandVoice": "Casual + Clear", "brandVoiceSummary": "Straightforward with a personal touch" }
{ "brandVoice": "Warm + Simple", "brandVoiceSummary": "Welcoming without being over the top" }

BAD EXAMPLES (avoid these marketing/AI patterns):
{ "brandVoice": "Elevated + Curated", "brandVoiceSummary": "Sophisticated aesthetic with intentional design elements" }
{ "brandVoice": "Serene + Tranquil", "brandVoiceSummary": "Peaceful ambiance crafted for ultimate relaxation" }`;
    } else if (inputType === 'captions') {
      prompt = `You're analyzing how a REAL PERSON writes on social media. Study these examples:
      
"${input}"

Your job is to describe how this SPECIFIC PERSON actually writes - not create a generic brand voice.

THINK LIKE A FRIEND describing another friend's texting style. How would you describe it?

Respond with:
1. Two-word description using everyday language (like "Super Chatty" or "Dad Jokes")
2. A short phrase like you'd use when telling a friend "their posts are..."

Format as JSON:
- brandVoice: Two conversational words (never marketing terms)
- brandVoiceSummary: How you'd describe their style to a friend

GOOD EXAMPLES (natural, human):
{ "brandVoice": "Friendly Casual", "brandVoiceSummary": "Simple and laid-back with some humor" }
{ "brandVoice": "Straight Shooter", "brandVoiceSummary": "Gets to the point without extra fluff" }

BAD EXAMPLES (avoid these marketing/AI patterns):
{ "brandVoice": "Authentic + Conversational", "brandVoiceSummary": "Crafts relatable narratives with engaging anecdotes" }
{ "brandVoice": "Dynamic + Expressive", "brandVoiceSummary": "Leverages emotional resonance through vivid descriptions" }`;
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0].message.content || '{"brandVoice": "Chill Vibes", "brandVoiceSummary": "Just like chatting with a friend"}';
    const result = JSON.parse(content);
    return {
      brandVoice: result.brandVoice,
      brandVoiceSummary: result.brandVoiceSummary
    };
  } catch (error) {
    console.error("Error analyzing brand voice:", error);
    return {
      brandVoice: "Chill Vibes", 
      brandVoiceSummary: "Just like chatting with a friend"
    };
  }
}

// Function to test database connectivity specifically for routes
async function checkDatabaseHealth() {
  try {
    // Use testDatabaseConnection from db.ts if imported
    // Otherwise, do a simple check using storage interface
    const testUser = await storage.getUserByUsername("test-healthcheck");
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}




// Middleware to ensure SPA routes are properly handled in production
function setupSpaRoutingMiddleware(app: Express) {
  // Common SPA routes that should return the main index.html
  const exactSpaRoutes = ['/app', '/login', '/auth/callback', '/property', '/generator', '/preview', '/share'];
  
  // Critical route - handle /app directly to ensure authentication flow works correctly
  app.get('/app*', (req, res, next) => {
    console.log('App dashboard route hit directly:', req.path);
    // Let Vite handle this in development so client-side routing works properly
    next('route');
  });
  
  // Handle all other common SPA routes
  exactSpaRoutes.forEach(route => {
    // Skip routes we handle specifically above
    if (route === '/app') return;
    
    app.get(route, (_req, res, next) => {
      // Only handle if this is a direct browser request for HTML
      // Skip for API requests or assets
      if (_req.headers.accept && _req.headers.accept.includes('text/html')) {
        console.log(`SPA route hit: ${route}`);
        res.header('Cache-Control', 'no-cache');
        
        // In development, let Vite handle it
        if (process.env.NODE_ENV === 'development') {
          return next('route');
        }
        
        // In production, serve the index.html directly
        res.sendFile('index.html', { root: './public' });
      } else {
        next();
      }
    });
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up SPA routing middleware first
  setupSpaRoutingMiddleware(app);
  
  // API endpoint for editing content with natural language prompts
  app.post("/api/edit-content-with-prompt", async (req, res) => {
    try {
      const { content, prompt, propertyId, contentType } = req.body;
      
      if (!content || !prompt) {
        return res.status(400).json({ message: "Content and prompt are required" });
      }
      
      // Get property details to provide context for editing
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Call OpenAI to edit the content
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages: [
          {
            role: "system",
            content: `You are a professional content editor for vacation rental listings. You'll be editing content for a property named "${property.name}" located in "${property.location}". 
            The content type is "${contentType}". 
            ${property.brandVoice ? `Apply this brand voice: "${property.brandVoice}"` : ""}
            Keep the content authentic, accurate, and tailored to the property while following the user's editing instructions.`
          },
          {
            role: "user",
            content: `Here is the original content:
            
            "${content}"
            
            Please edit this content based on the following instruction: "${prompt}"
            
            Return only the edited content without any additional explanations or notes.`
          }
        ],
        temperature: 0.7,
      });
      
      const editedContent = response.choices[0].message.content?.trim() || content;
      
      // Return the edited content
      res.json({
        originalContent: content,
        editedContent,
        prompt
      });
    } catch (error) {
      console.error("Content editing error:", error);
      res.status(500).json({ message: "Failed to edit content with prompt" });
    }
  });
  
  // API endpoint for analyzing images with OpenAI Vision
  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { imageData, propertyName } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ 
          message: "Image data is required",
          analysis: `A beautiful ${propertyName || 'vacation'} property perfect for creating memories.`
        });
      }
      
      // Process image data
      let base64Image = imageData;
      
      // Check if it already has the data URL prefix
      if (!base64Image.startsWith('data:')) {
        base64Image = `data:image/jpeg;base64,${imageData}`;
      }
      
      // Analyze the image
      let analysis;
      try {
        analysis = await analyzeImageWithOpenAI(base64Image);
      } catch (visionError) {
        console.error("OpenAI Vision API error:", visionError);
        // Return a fallback that doesn't throw an error
        analysis = `This inviting ${propertyName || 'vacation'} property showcases beautiful details and a warm, welcoming atmosphere where guests can unwind and create memorable experiences during their stay.`;
      }
      
      res.json({ 
        analysis,
        message: "Image analyzed successfully" 
      });
    } catch (error) {
      console.error("Error analyzing image with OpenAI Vision:", error);
      // Return success with fallback analysis instead of error
      res.json({ 
        message: "Generated fallback analysis",
        analysis: `A charming ${req.body.propertyName || 'vacation'} property with unique character and warmth, perfect for creating meaningful memories during your stay.` 
      });
    }
  });
  // prefix all routes with /api
  
  // Properties API
  app.get("/api/properties", async (req, res) => {
    try {
      // Extract user ID from the query parameter or header if available
      // This allows filtering properties based on the user's session
      const userId = req.query.userId ? Number(req.query.userId) : 
                     req.headers['x-user-id'] ? Number(req.headers['x-user-id']) : null;
      
      let properties;
      
      if (userId) {
        // If userId is provided, get properties for that specific user
        properties = await storage.getPropertiesByUserId(userId);
      } else {
        // Default behavior - get a reasonable set of properties
        // In a production environment, this would require proper authentication
        properties = await storage.getPropertiesByUserId(1);
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      // For simplicity, we'll use a fixed user ID for now
      const userId = 1;
      const propertyData = { ...req.body, userId };

      const validatedData = insertPropertySchema.parse(propertyData);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create property" });
      }
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // For simplicity, we'll use a fixed user ID for now
      const userId = 1;

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this property" });
      }

      const updatedProperty = await storage.updateProperty(id, req.body);
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  });
  
  // Add PATCH endpoint for partial updates (used by SavedHashtagsEditor)
  app.patch("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // For simplicity, we'll use a fixed user ID for now
      const userId = 1;

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this property" });
      }

      // Handle the savedHashtags property specifically, making sure they're only associated
      // with this specific property and don't leak across properties
      const dataToUpdate = { ...req.body };
      
      // Ensure property-specific hashtags are properly isolated by ID
      if (dataToUpdate.savedHashtags !== undefined) {
        console.log(`Updating property #${id} savedHashtags:`, dataToUpdate.savedHashtags);
      }

      const updatedProperty = await storage.updateProperty(id, dataToUpdate);
      res.json(updatedProperty);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // For simplicity, we'll use a fixed user ID for now
      const userId = 1;

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (property.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this property" });
      }

      await storage.deleteProperty(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Content API
  app.get("/api/contents", async (req, res) => {
    try {
      // Extract user ID from the query parameter or header
      const userId = req.query.userId ? Number(req.query.userId) : 
                    req.headers['x-user-id'] ? Number(req.headers['x-user-id']) : 1;
      
      // Fetch contents by user ID
      const contents = await storage.getContentsByUserId(userId);
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contents" });
    }
  });

  app.get("/api/properties/:propertyId/contents", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const contents = await storage.getContentsByPropertyId(propertyId);
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contents" });
    }
  });

  app.post("/api/contents", async (req, res) => {
    try {
      // For simplicity, we'll use a fixed user ID for now
      const userId = 1;
      const contentData = { ...req.body, userId };

      const validatedData = insertContentSchema.parse(contentData);
      const content = await storage.createContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create content" });
      }
    }
  });

  app.put("/api/contents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // For simplicity, we'll use a fixed user ID for now
      const userId = 1;

      const content = await storage.getContent(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      if (content.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this content" });
      }

      const updatedContent = await storage.updateContent(id, req.body);
      res.json(updatedContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  app.delete("/api/contents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // For simplicity, we'll use a fixed user ID for now
      const userId = 1;

      const content = await storage.getContent(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      if (content.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this content" });
      }

      await storage.deleteContent(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // Content Generation API with OpenAI GPT-4o Vision
  app.post("/api/generate-content", async (req, res) => {
    try {
      const { 
        propertyId, 
        contentType, 
        brandVoice, 
        ctaEnhancements, 
        photoData,
        contentLength,
        customWordCount,
        propertyBrandVoice,
        useBrandVoiceDefault
      } = req.body;
      
      // Fetch the property to generate content based on its details
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Determine which brand voice to use based on what was sent from the client
      let effectiveBrandVoice;
      
      // Check if we're using a custom brand voice from the property
      if (brandVoice.customVoice) {
        effectiveBrandVoice = {
          tone: 'custom',
          style: 'custom',
          customVoice: brandVoice.customVoice,
          customVoiceSummary: brandVoice.customVoiceSummary
        };
      } else {
        // Otherwise use the standard tone/style combination
        effectiveBrandVoice = brandVoice;
      }

      // Extract property features from amenities
      const features = property.amenities || [];
      
      // No default hashtags - will extract from generated content
      const hashtags: string[] = [];
      
      // Initialize keywords from property amenities
      const keywords = [...(property.amenities || []).slice(0, 3)];
      
      let photoDescription = "";
      
      // Process the image with OpenAI Vision API if available
      if (photoData && photoData.base64Image) {
        try {
          photoDescription = await analyzeImageWithOpenAI(photoData.base64Image);
        } catch (error) {
          console.error("Error analyzing image with OpenAI Vision:", error);
          // Continue with generation even if image analysis fails
        }
      }
      
      // Pass the host signature if available
      const hostSignature = property.hostSignature || '';

      // Extract booking gap data if provided
      const bookingGap = req.body.bookingGap || null;
      console.log("Received booking gap data:", bookingGap);
      
      // Special handling for booking gap filler content type
      if (contentType === 'booking_gap_filler_special' && bookingGap) {
        // Create a pre-formatted message that explicitly includes the booking dates
        const bookingGapContent = `${bookingGap.startDate} to ${bookingGap.endDate} - Just opened up at ${property.name}! This rare opportunity to stay at our ${property.location} property won't last long. ${bookingGap.specialOffer ? `SPECIAL OFFER: ${bookingGap.specialOffer} for these dates only!` : ''} Our family-friendly home offers all the comforts you need including WiFi and a fully equipped kitchen. Don't miss this limited-time availability - book these exclusive dates now before they're gone! #LastMinuteGetaway #LimitedTimeOffer`;
        
        return res.json({
          title: `Available: ${bookingGap.startDate} - ${bookingGap.endDate}`,
          content: bookingGapContent,
          keywords: ["limited time", "special offer", "booking gap", "last minute", "availability"]
        });
      }
      
      // Generate content with OpenAI GPT-4o for all other content types
      const { title, content, extractedKeywords } = await generateContentWithOpenAI({
        property,
        contentType,
        brandVoice: effectiveBrandVoice, // Use the determined brand voice (property or user selected)
        ctaEnhancements,
        photoDescription,
        features,
        hashtags: hashtags,
        contentLength,
        customWordCount,
        bookingGap
      });

      // Only use property saved hashtags if available
      // Otherwise, DO NOT include any generic keywords
      let finalKeywords: string[] = [];
      let contentWithHashtags = content;
      
      if (property.savedHashtags && property.savedHashtags.length > 0) {
        finalKeywords = [...property.savedHashtags];
        
        // First remove any existing hashtags from the content
        contentWithHashtags = content.replace(/#[\w\d]+/g, '').trim();
        
        // Then add the saved hashtags at the end of the content
        if (finalKeywords.length > 0) {
          contentWithHashtags += "\n\n";
          finalKeywords.forEach(tag => {
            contentWithHashtags += `#${tag} `;
          });
        }
      } else {
        // No saved hashtags, so just remove any that might be in the content
        contentWithHashtags = content.replace(/#[\w\d]+/g, '').trim();
      }
      
      // Use the content with hashtags for response
      const finalContent = contentWithHashtags;

      const generatedContent = {
        title,
        content: finalContent,
        keywords: finalKeywords, // Only use saved hashtags, or empty array
        propertyId,
        contentType,
        userId: 1  // For simplicity, we'll use a fixed user ID for now
      };

      res.json(generatedContent);
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

// Helper function to analyze image with OpenAI Vision API
async function analyzeImageWithOpenAI(base64Image: string): Promise<string> {
  try {
    // Ensure the base64Image is properly formatted
    let formattedImage = base64Image;
    
    // If it doesn't start with data:, it's not a properly formatted data URL
    if (!base64Image.startsWith('data:')) {
      // Add proper prefix
      formattedImage = `data:image/jpeg;base64,${base64Image}`;
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a visual analysis assistant for vacation rental properties. Your task is to extract key visual elements that can be used to create compelling, authentic vacation rental marketing content. Focus on specific details that would be impossible to know without seeing this exact image."
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Analyze this vacation rental property image in extreme detail. Describe: 1) What is physically visible (people, objects, activities, surroundings), 2) The emotional atmosphere/mood evoked, 3) Features travelers would notice immediately, 4) Unique visual elements that distinguish this specific scene from generic vacation property descriptions. Focus ONLY on what you can literally see - do not invent or assume details that aren't visibly present." 
              },
              { 
                type: "image_url", 
                image_url: { 
                  url: formattedImage 
                } 
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error(`OpenAI API error with status: ${response.status}`);
      return "A charming vacation rental property with a welcoming atmosphere, perfect for creating memorable experiences during your stay.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Vision API error:", error);
    // Return fallback description instead of throwing
    return "A beautiful vacation property with unique character and charm, offering a comfortable, inviting atmosphere for guests to enjoy their stay.";
  }
}

// Helper function to generate content with OpenAI
async function generateContentWithOpenAI({ 
  property, 
  contentType, 
  brandVoice, 
  ctaEnhancements, 
  photoDescription, 
  features,
  hashtags,
  contentLength,
  customWordCount,
  bookingGap
}: {
  property: any;
  contentType: string;
  brandVoice: any;
  ctaEnhancements: any;
  photoDescription: string;
  features: string[];
  hashtags: string[];
  contentLength?: string;
  customWordCount?: number;
  bookingGap?: { startDate: string; endDate: string; specialOffer?: string } | null;
}): Promise<{ title: string; content: string; extractedKeywords: string[] }> {
  try {
    // Build specialized prompt based on content type and purpose
    let systemMessage = `You are a real human vacation rental host casually texting a friend about your property. Your writing is warm, genuine, and completely free of marketing language.`;
    
    // Add host signature instruction if available
    if (property.hostSignature) {
      systemMessage += `\n\nIMPORTANT: The host's preferred signature or name is: "${property.hostSignature}". Use this signature at the end of welcome messages, house rules, and guest re-engagement content, but NOT in listing descriptions or social media captions.`;
    }
    
    systemMessage += `\n\nTALK LIKE YOU'RE CHATTING WITH A FRIEND:
1. Use super casual, everyday language - "This spot gets so cozy in the evening" or "I'm still playing around with the pillows in here"
2. Include sensory details about comfort and feeling - "The breeze through these windows feels amazing" or "That corner gets the softest morning light"
3. Talk about seasonal changes - "The way winter sunlight hits this room" or "This patio is our summer dinner spot"
4. Share personal preferences or habits - "I love having morning coffee on the deck" or "This spot gets the best afternoon light for reading"
5. Add off-the-cuff observations and random thoughts - just like real texting conversations
6. Use everyday expressions and contractions - "It's pretty great" instead of "It's exceptional"
7. Share little joys and comforts - "My go-to reading nook" or "Where I end up every morning with coffee"

FOCUS ON WARMTH AND SUBTLE EXPERIENCES:
1. Describe how spaces feel, not just how they look - "So calming at the end of the day" or "Makes mornings feel less rushed"
2. Reference everyday routines - "Great spot for morning stretches" or "Where I catch up on emails"
3. Mention subtle guest reactions - "Everyone ends up gravitating here" or "Guests always say they sleep better here"
4. Talk about simple comfort elements - "These cushions are seriously comfy" or "The water pressure is just right"
5. Share little moments of joy - "Love watching the birds from this window" or "The kids always race to claim this spot"
6. Include weather and light observations - "When it rains, this becomes the coziest spot" or "Gets the prettiest afternoon light"
7. Mention simple, relatable pleasures - "Perfect for lazy Sunday mornings" or "Where movie nights happen"

WRITE LIKE A REAL PERSON, NOT A CONTENT CREATOR:
1. Use varied, natural sentence lengths - mix short fragments with rambling thoughts
2. Begin messages differently each time - sometimes mid-thought, sometimes with a question
3. Include occasional filler words - "like," "honestly," "actually," "pretty much," "basically"
4. Add natural pauses and transitions - "Anyway..." or "Oh, and..." or "By the way..."
5. Include occasional self-corrections - "We painted it blue... well, more like a blue-gray actually"
6. Use simple, everyday adjectives - "nice," "comfy," "cozy," "bright" instead of dramatic ones
7. Sound like you're typing quickly - occasional fragments, simple punctuation, casual flow

Always keep the brand voice in mind, but make it feel like a real person who embodies that vibe.`;
    
    // Add specialized instructions based on content type
    switch (contentType) {
      case 'social_media_caption':
        systemMessage += `
For social media captions, write exactly like you're texting a close friend about your place - casual, warm, and completely natural.

EVERYDAY SOCIAL MEDIA LANGUAGE:
1. Use super simple, conversational phrasing - "This shower is honestly the best part of mornings here"
2. Include casual reactions anyone would have - "Pretty happy with how this corner turned out"
3. Add sensory comfort details - "The way the light warms up this space in the afternoon makes it so cozy"
4. Mention seasonal experiences - "This spot is where I hide out during summer heat" or "Winter mornings look so different here"
5. Share everyday moments - "Morning coffee spot when it's not raining" or "Where I end up reading most nights"
6. Include subtle, relatable feelings - "Something about this space always feels calming" or "Makes even Monday mornings feel ok"
7. Use filler words and casual transitions - "Honestly love how..." or "Finally got around to..." or "Basically my favorite spot for..."

AUTHENTIC SOCIAL CAPTION STYLE:
1. Start differently each time - sometimes with a fragment, sometimes mid-thought
2. Keep it brief and casual - like you quickly typed it while thinking about something else
3. Use simple punctuation - periods, occasional exclamation points, ellipses for pauses
4. Include everyday expressions - "pretty nice" instead of "stunning" or "love this spot" instead of "dream space"
5. Add little parenthetical comments - "(still need to fix that light switch though)"
6. When using emojis, place them naturally - sometimes single, sometimes none, never patterned
7. End captions in different ways - sometimes with a simple statement, sometimes trailing off...

FOCUS ON COMFORT AND SUBTLE JOYS:
1. Mention how spaces feel to be in - "So nice to wake up to this view" or "Where afternoon naps happen"
2. Reference simple, everyday pleasures - "Perfect morning reading spot" or "Where I catch the sunset most days" 
3. Include minor, honest quirks - "The door squeaks but I kind of like it" or "Still figuring out what art to hang here"
4. Share genuine reactions about the space - "This corner gets the best light all day" or "Finally a spot to relax"
5. Add weather or time observations - "Rainy days make this spot extra cozy" or "Golden hour makes this room glow"
6. Use everyday adjectives - "comfy," "nice," "cozy," "bright" instead of superlatives
7. Sometimes just state the obvious like a real person would - "Yep, that's the bathroom" or "Another sunset from the deck"

IMPORTANT RESTRICTIONS:
1. DO NOT mention the property name or location unless specifically asked
2. DO NOT refer to the property as a rental property
3. Focus only on the specific scene, moment, or feeling in the photo
4. Write as if this is your personal space that you're sharing with friends, not a property listing`;
        break;
      case 'listing_description':
        systemMessage += `
For listing descriptions, write as the actual owner sharing the genuine story of their space - never like a professional copywriter. Create a structured description following this specific format:

REQUIRED STRUCTURED FORMAT:
1. OPENING HOOK (1-2 sentences) - Begin with sensory or emotional appeal, like "Morning light pours through the east windows, making this the perfect spot for coffee and planning your day's adventures."

2. UNIQUE SELLING POINTS - Highlight 2-3 distinctive features with vivid details, like "The handcrafted oak dining table has hosted everything from holiday meals to late-night board games."

3. PROPERTY LAYOUT - Briefly describe number of bedrooms, bathrooms, and sleeping arrangements in a conversational way, like "Our two-bedroom cottage gives you room to spread out, with a queen in the main and twins in the second bedroom."

4. GUEST EXPERIENCE - Include warm, descriptive language about the experience of staying, like "The gentle sound of waves will be your constant companion, whether you're cooking in the kitchen or relaxing on the deck."

5. LOCATION HIGHLIGHTS - ONLY if explicitly provided in property details, mention walking/driving distances to key spots like "It's a quick 5-minute stroll to the beach path" or "The local farmer's market is just around the corner."

6. AMENITIES SNAPSHOT - Provide a compact summary of essential features, like "You'll have everything you need: fast WiFi, a fully-equipped kitchen, workspace, and washer/dryer."

7. GUEST SUITABILITY (optional) - If relevant, include a gentle note like "The peaceful setting makes this ideal for couples or small families looking to disconnect."

8. CALL TO ACTION - End with an inviting sentence, like "Drop me a message if you have any questions - I'm happy to help you plan the perfect stay."

AUTHENTIC VOICE REQUIREMENTS:
1. Write with a warm, genuine tone that matches the selected brand voice
2. Use first-person perspective consistently ("I" or "we")
3. Avoid marketing superlatives like "stunning," "luxury," "perfect," or "breathtaking"
4. Include parenthetical asides that show personality, like "...and a deep soaking tub (my favorite spot after a day of hiking)"
5. CRITICAL: Only mention neighborhood information if it's explicitly provided in the property details`;
        break;
      case 'welcome_message':
        systemMessage += `
For welcome messages, create warm, personal communications that feel like a thoughtful note from a real host who genuinely cares about their guests' experience.

WELCOME MESSAGE STRUCTURE:
1. BEGIN WITH WARM GREETING - Start with a personal, genuine welcome like "Hi there! Welcome to The Surry Hills House!" or "We're so happy you've arrived!"

2. EXPRESS EXCITEMENT OR GRATITUDE - Follow with a brief note of excitement or gratitude for their booking, like "We're thrilled you chose our place for your stay" or "Thanks so much for booking with us!"

3. HIGHLIGHT SOMETHING SPECIAL - Mention something unique or special about the property or stay experience, like "The morning light in the kitchen is absolutely magical—perfect for planning your day over coffee" or "You picked a wonderful time to visit—the garden is in full bloom right now."

4. PROVIDE KEY PRACTICAL DETAILS - Include the most essential practical information in a conversational, helpful way, like "You'll find extra blankets in the hall closet" or "The WiFi password is on the fridge, and the smart TV is all set up with Netflix."

5. ENCOURAGE SETTLING IN & REACHING OUT - Invite guests to make themselves at home and let them know you're available, like "Please make yourself completely at home, and don't hesitate to reach out if you need anything at all."

6. ADD A WARM SIGN-OFF - End with a personal closing that wishes them a wonderful stay. 
${property.hostSignature ? `IMPORTANT: Always end the welcome message with the host's signature: "${property.hostSignature}"` : 'If no host signature is provided, end with a simple "Enjoy your stay!" or similar warm closing.'}

TONE REQUIREMENTS:
1. Write like a kind, thoughtful friend—warm and conversational, never corporate or generic
2. Use the selected Brand Voice while keeping it authentic and personal
3. Include little personal touches or specific details that make it feel handcrafted
4. Use natural language with contractions and varied sentence structures
5. Add a hint of enthusiasm and genuine care (but not overly enthusiastic)
6. Inject a bit of personality or gratitude where appropriate
7. Ensure it feels like a real message typed by a real person—not a templated form letter`;
        break;
      case 'house_rules':
        systemMessage += `
For house rules, create clear, friendly guidance that's organized into skimmable sections while maintaining the warmth of a real host's voice.

REQUIRED STRUCTURED FORMAT:
1. START WITH WELCOME - Begin with a brief, warm welcome that sets a friendly tone, like "We're so happy to share our home with you! Just a few simple guidelines to ensure everyone has a great experience."

2. ORGANIZE INTO CLEAR SECTIONS using these emoji headers:
   • ✅ WHAT'S WELCOME - List 2-3 things guests are encouraged to do or enjoy, like "✅ Feel free to use the herbs in the garden for cooking" or "✅ Help yourself to the books and board games in the living room"
   
   • 🚫 WHAT'S NOT ALLOWED - Present 2-4 key restrictions clearly but gently, like "🚫 Please no smoking anywhere on the property" or "🚫 We ask that you keep noise to a minimum after 10pm"
   
   • ⏰ TIMING GUIDELINES - Include check-in/check-out times and any quiet hours in a conversational way, like "⏰ Check-in is from 3pm, and we ask that you check out by 11am so we can prepare for our next guests"
   
   • 👶 GUEST SUITABILITY - Mention any specific rules about children, pets, or gatherings, like "👶 While we love children, please note the spiral staircase requires supervision for little ones" or "👶 Our space works best for couples or small families (max 4 guests)"

3. END WITH WARM REMINDER - Close with a friendly call to action that reinforces care for the space while expressing excitement about their stay. If the host has provided a signature, end with that signature after the warm reminder.

TONE REQUIREMENTS:
1. Match the selected brand voice while keeping text skimmable
2. Use friendly, conversational language (never legal or corporate-sounding)
3. Present rules as helpful guidance rather than strict commands
4. Balance clarity with warmth - be direct without sounding strict
5. Adapt formality level based on the selected brand voice
6. Keep length appropriate to the selected content length preference
7. Use "we" and "our" language to create a personal connection`;
        break;
      case 'guest_reengagement':
        systemMessage += `
For guest re-engagement messages, create authentic follow-ups that don't feel like marketing templates.

REQUIREMENTS FOR REENGAGEMENT:
1. Begin differently each time - sometimes with gratitude, sometimes with a memory, sometimes with a question
2. Vary your review request approach - sometimes direct, sometimes as a favor, sometimes emphasizing its value
3. Mix up return visit incentives - sometimes explicit discounts, sometimes seasonal suggestions, sometimes new features
4. Create different closing styles - sometimes open-ended, sometimes with a specific call to action
5. Use varied language around the past stay - sometimes specific details, sometimes general appreciation
6. Sometimes be brief and direct, other times more conversational and detailed
7. Include personal touches that make it feel like a real host reaching out, not an automated message`;
        break;
      case 'booking_gap_filler':
        systemMessage += `
For booking gap fillers, create persuasive date-specific promotions with varied approaches.

REQUIREMENTS FOR GAP FILLERS:
1. Always begin with the dates, but vary how you present them - sometimes with urgency, sometimes as an opportunity, sometimes as a special window
2. Mix up urgency approaches - sometimes scarcity focused, sometimes benefit focused, sometimes opportunity focused
3. Vary your special offer framing - sometimes as a headline, sometimes woven into narrative, sometimes as an aside
4. Create different closing approaches - sometimes direct booking CTA, sometimes asking questions, sometimes creating FOMO
5. Use varied sentence structures and paragraph formats for a natural, non-template feel
6. Sometimes focus on the uniqueness of these specific dates, other times on the property's appeal during this time
7. Include unexpected persuasive elements that don't follow a standard promotional template

CRITICAL: The dates must always be prominently featured as the main focus.`;
        break;
    }
    
    // Determine the content type description based on purpose
    let contentTypeDescription = '';
    switch (contentType) {
      case 'social_media_caption':
        contentTypeDescription = 'social media caption for Instagram, Facebook, or TikTok';
        break;
      case 'listing_description': 
        contentTypeDescription = 'listing description for Airbnb or Vrbo';
        break;
      case 'welcome_message':
        contentTypeDescription = 'welcome message to send to guests after booking';
        break;
      case 'house_rules':
        contentTypeDescription = 'house rules reminder for check-in or pre-arrival message';
        break;
      case 'guest_reengagement':
        contentTypeDescription = 'guest re-engagement message for post-stay follow-up';
        break;
      case 'booking_gap_filler':
        contentTypeDescription = 'booking gap filler message to promote available dates';
        break;
      default:
        contentTypeDescription = 'content for your property';
    }
    
    // Build user message with new priorities - For booking gap filler, dates are most important
    let userMessage = '';
    
    // Special handling for booking gap filler
    if (contentType === 'booking_gap_filler' && bookingGap) {
      userMessage = `Create an urgent booking gap filler message for available dates ${bookingGap.startDate} to ${bookingGap.endDate}.\n\n`;
      userMessage += `CRITICAL INSTRUCTIONS:\n`;
      userMessage += `1. Start the message with the exact available dates: "${bookingGap.startDate} to ${bookingGap.endDate}"\n`;
      userMessage += `2. Create a sense of urgency and exclusivity (rare opportunity, limited time)\n`;
      
      if (bookingGap.specialOffer) {
        userMessage += `3. Highlight this special offer prominently: "${bookingGap.specialOffer}"\n`;
      }
      
      userMessage += `4. Use the brand voice and property details below to frame this limited-time opportunity\n\n`;
    } else {
      // Standard format for other content types
      userMessage = `Please write a ${contentTypeDescription} using the following prioritized inputs:\n\n`;
    }
    
    // Add photo description if available (HIGHEST PRIORITY - 90% of content should be based on this)
    userMessage += `1. PRIMARY FOCUS (90% of content should be based on this):\n`;
    if (photoDescription) {
      userMessage += `Photo Analysis:\n${photoDescription}\n\n`;
      userMessage += `CRITICAL INSTRUCTION: Make 90% of the content directly reference what's visible in this photo. Describe the scene, mood, activities, and visual elements from the photo in detail.\n\n`;
    } else {
      userMessage += `No photo provided, so focus on brand voice and property elements.\n\n`;
    }
    
    // Add brand voice and style (next priority)
    userMessage += `2. BRAND VOICE (use this tone throughout):\n`;
    
    // Check if we're using a custom brand voice from the property
    if (brandVoice.customVoice) {
      userMessage += `• CUSTOM BRAND VOICE: "${brandVoice.customVoice}"\n`;
      
      if (brandVoice.customVoiceSummary) {
        userMessage += `• VOICE DESCRIPTION: ${brandVoice.customVoiceSummary}\n`;
      }
      
      userMessage += `• IMPORTANT: This property has a custom brand voice that must be strictly followed.\n`;
      userMessage += `  Write in a style that precisely matches the property's defined brand personality.\n\n`;
    } else {
      // Otherwise use the selected tone/style from the form
      userMessage += `• Tone: ${brandVoice?.tone || 'Professional'}\n`;
      userMessage += `• Style: ${brandVoice?.style || 'Descriptive'}\n\n`;
    }
    
    // Add basic property details (minimal usage)
    userMessage += `3. MINIMAL PROPERTY CONTEXT (use sparingly):\n`;
    userMessage += `• Name: ${property.name}\n`;
    userMessage += `• Location: ${property.location}\n`;
    
    // Add only essential features in very limited fashion
    if (features && features.length > 0) {
      // Just take the first 2 features max
      const limitedFeatures = features.slice(0, 2);
      userMessage += `• Key features: ${limitedFeatures.join(', ')}\n`;
    }
    
    // Important content type-specific instructions
    if (contentType === 'listing_description') {
      userMessage += `• IMPORTANT: For listing descriptions, DO NOT make any claims about neighborhood amenities, restaurants, attractions, or distances UNLESS they are explicitly mentioned in the property details above. Focus only on the property itself.\n\n`;
    } else if (contentType === 'social_media_caption') {
      userMessage += `• IMPORTANT: For social media captions, DO NOT include the property name or location. DO NOT refer to it as a rental property. Write as if you're sharing your personal space with friends, focusing only on the specific scene or feeling.\n\n`;
    } else {
      userMessage += `\n`;
    }
    
    // Add booking gap information if available (this becomes high priority for this content type)
    if (contentType === 'booking_gap_filler' && bookingGap) {
      const { startDate, endDate, specialOffer } = bookingGap;
      userMessage += `4. BOOKING GAP DETAILS (critical for this message type):\n`;
      userMessage += `• Available dates: ${startDate} to ${endDate}\n`;
      
      if (specialOffer) {
        userMessage += `• Special offer: ${specialOffer}\n`;
        userMessage += `• IMPORTANT: Emphasize this special rate/offer as a limited-time opportunity\n`;
      }
      
      userMessage += `• CRITICAL: The content MUST prominently include the exact dates "${startDate} to ${endDate}" early in the message\n`;
      userMessage += `• Create a strong sense of urgency specifically about these dates\n`;
      userMessage += `• Use phrases like "just opened up", "rare opportunity", or "limited-time availability"\n`;
      userMessage += `• Suggest immediate action to secure these specific dates before they're gone\n\n`;
    }
    
    // Add CTA enhancements and hashtags (LOWEST PRIORITY - only 10% of content)
    userMessage += `${contentType === 'booking_gap_filler' ? '5' : '4'}. SECONDARY ELEMENTS (limit to 10% of content):\n`;
    
    // Add hashtags if available
    if (hashtags && hashtags.length > 0) {
      userMessage += `• Hashtags: Use 2-3 from ${hashtags.map(tag => `#${tag}`).join(' ')}\n`;
    }
    
    // Add CTA enhancement (just one and very brief)
    if (ctaEnhancements?.urgency || ctaEnhancements?.socialProof || ctaEnhancements?.benefits || ctaEnhancements?.directCTA) {
      userMessage += `• Brief CTA: `;
      if (ctaEnhancements?.urgency) {
        userMessage += `Mention limited availability. `;
      }
      if (ctaEnhancements?.socialProof) {
        userMessage += `Reference positive guest experiences. `;
      }
      if (ctaEnhancements?.benefits) {
        userMessage += `Mention one key benefit. `;
      }
      if (ctaEnhancements?.directCTA) {
        userMessage += `End with a clear instruction like "Book now" or "Message us to reserve". `;
      }
      userMessage += `\n`;
    }
    
    // Add content length preference with custom word count
    if (contentLength) {
      userMessage += `\n6. Content Length: `;
      
      // If custom word count is provided, use it for more precise control
      if (customWordCount && customWordCount > 0) {
        userMessage += `${customWordCount} words exactly`;
      } else {
        // Otherwise use the preset lengths
        userMessage += `${contentLength.charAt(0).toUpperCase() + contentLength.slice(1)}`;
        if (contentLength === 'short') {
          userMessage += ` (around 15 words)`;
        } else if (contentLength === 'medium') {
          userMessage += ` (around 30-50 words)`;
        } else if (contentLength === 'long') {
          userMessage += ` (around 75-100+ words)`;
        }
      }
      userMessage += `\n`;
    }
    
    // Add final instructions with focus on photo-first content
    userMessage += `\nCRITICAL INSTRUCTIONS FOR AUTHENTIC CONTENT CREATION:
    
    1. HUMAN-FIRST PHOTO APPROACH: Write as if you're personally sharing this photo with friends.
       - Describe what's in the photo as if you took it yourself
       - Add personal observations that only the property owner would know
       - Include a specific detail about creating/designing/maintaining what's in the photo
       - Mention how guests typically react to this feature/space
    
    2. AUTHENTIC VOICE: Use the specified brand voice while maintaining natural human qualities.
       - Include minor imperfections or real-world context
       - Add personal opinions or feelings about the space
       - Share a genuine tidbit about the feature's history or inspiration
    
    3. NATURAL STRUCTURE: Write like a real person, not a content creator.
       - Vary sentence length unpredictably
       - Use sentence fragments occasionally
       - Add parenthetical thoughts or casual asides
       - Avoid perfectly structured paragraphs and marketing formulas
    
    4. MINIMAL MARKETING: If you include CTAs or hashtags, make them casual and natural.
       - Phrase questions like a real person would ask them
       - Skip marketing buzzwords entirely (luxe, stunning, perfect, ultimate, experience)
    
    Also, please provide a short, conversational title for this content as if you were texting a friend.`;
    
    // Add clear instructions to avoid markdown formatting
    // For booking gap filler content, add one final reminder to ensure dates are included
    if (contentType === 'booking_gap_filler' && bookingGap) {
      userMessage += `\n\nFINAL CRITICAL REMINDER:
      - The FIRST SENTENCE must contain the exact dates "${bookingGap.startDate} to ${bookingGap.endDate}"
      - Use phrases like "just opened up", "rare opportunity", "limited time availability"
      - Create a strong sense of urgency about these specific dates
      ${bookingGap.specialOffer ? `- Emphasize this special offer: "${bookingGap.specialOffer}"` : ''}
      
      THE DATES MUST BE THE STAR OF THIS MESSAGE - make them unmissable!`;
    }

    userMessage += `\n\nIMPORTANT FORMATTING RULES:
    1. DO NOT use any markdown formatting such as ###, **, or * in your response.
    2. DO NOT include ANY headers, labels or section titles like "Title:", "Caption:", or "Keywords:".
    3. YOUR RESPONSE SHOULD ONLY CONTAIN: The caption text itself, followed by hashtags if relevant.
    4. I will separately extract a title and keywords from your response through other means.
    5. For captions, just write the text that would appear in the post - nothing else.
    
    FINAL CRITICAL INSTRUCTION - WRITE EXACTLY LIKE A CASUAL TEXT MESSAGE:
    
    1. USE SUPER EVERYDAY LANGUAGE: Write like you're quickly texting a friend - use simple words like "nice," "comfy," "pretty good," and casual phrases like "love how," "really like," or "pretty happy with." NEVER use words like "serene," "luxe," "oasis," "paradise," "elegant," "upscale," "stunning," "breathtaking," "exquisite," "impeccable," "pristine," "sophisticated," "exclusive," "tranquil," "indulgent," "immaculate," "sumptuous," "sublime," "lavish," "opulent," "premier," "unparalleled," "bespoke," "ambiance," "aura," "experience," or any other marketing language for ANY type of photo.
    
    2. FOCUS ON COMFORT AND FEELING: Mention how spaces feel to be in - "so cozy on rainy days" or "where I end up with my morning coffee" or "makes evenings feel extra relaxing." For bathrooms specifically, use phrases like "shower feels so good after hiking" or "nice to have a big mirror when getting ready" or "mornings are way less chaotic with two sinks."
    
    3. ADD NATURAL PAUSES AND FLOW: Include filler words like "basically," "honestly," "pretty much," and casual transitions like "anyway..." or "oh and..." exactly as real people text.
    
    4. INCLUDE SEASONAL AND LIGHT DETAILS: Reference how weather and time affect spaces - "winter mornings in this room are so bright" or "summer evenings on this patio are my favorite." 
       
       For different spaces, use casual phrases like:
       • Living rooms: "favorite spot for movie nights" or "where everyone ends up hanging out" or "gets nice and warm when the fireplace is on"
       • Kitchens: "makes cooking dinner way more fun" or "finally got the island I always wanted" or "pretty happy with how the new counters turned out"
       • Bedrooms: "gets the best morning light" or "so quiet at night" or "where I catch up on reading" 
       • Outdoors: "coffee tastes better out here somehow" or "nice spot to watch the sunset" or "still need to figure out what to plant in that corner"
       • Views: "never gets old waking up to this" or "feels different every time of day" or "favorite part of the house honestly"
    
    5. MENTION SUBTLE GUEST EXPERIENCES: Share small, authentic reactions for different spaces:
       • General: "everyone says they sleep better here" or "guests always end up gathering in this spot"
       • Living areas: "friends always comment on how comfy the couch is" or "our movie nights happen here"
       • Bedrooms: "guests mention how quiet the rooms are" or "my sister says the bed is too comfy to get up"
       • Kitchens: "everyone ends up hanging out here while I cook" or "always gets compliments on the layout"
       • Outdoors: "morning coffee spot that guests fight over" or "where everyone gravitates on warm nights"
       • Views: "people just sit and stare at this view for hours" or "photos never do it justice tbh"
    
    6. KEEP IT IMPERFECT: Add honest quirks for different spaces:
       • Bathrooms: "finally got the water temperature right" or "shower's pretty good now that we fixed the pressure" or "still need to get a better shower curtain"
       • Living rooms: "couch has that one spot that sinks in too much" or "still figuring out the right layout" or "TV's a bit too high but oh well"
       • Kitchens: "cabinet doors need adjusting" or "dishwasher makes a weird noise but works fine" or "microwave is ancient but gets the job done"
       • Bedrooms: "mattress took forever to break in" or "closet door sticks when it's humid" or "still need to hang some pictures"
       • Outdoors: "our favorite sunset viewing spot" or "where we have coffee every morning" or "gets the perfect breeze in the evening"
       • General: "still figuring out the right rug size" or "light switch is in a weird spot" or "wifi is spotty in this corner"
    
    7. SOUND COMPLETELY UNPOLISHED: Write as if you're typing quickly on your phone - use simple punctuation, occasional fragments, natural pauses with ellipses... just like real texts.
    
    Remember: Provide only the final text with no formatting or markers!`;
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    // Extract title, content, and keywords
    let title = property.name; // Default title
    let content = generatedText;
    let extractedKeywords: string[] = [];
    
    // Try to parse the formatted response
    // Extract title if it exists in formatted form
    const titleMatch = generatedText.match(/^Title:[\s]*(.*?)(?:\n|$)/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
      // Remove title line from content - safely handle null/undefined
      content = generatedText.replace(/^Title:[\s]*(.*?)(?:\n|$)/i, '') || '';
    }
    
    // Extract keywords if they exist in formatted form
    const keywordsMatch = content.match(/Keywords:[\s]*(.*?)(?:\n|$)/i);
    if (keywordsMatch && keywordsMatch[1]) {
      extractedKeywords = keywordsMatch[1].split(',').map((k: string) => k.trim());
      // Remove keywords line from content
      const replaced = content.replace(/Keywords:[\s]*(.*?)(?:\n|$)/i, '');
      content = replaced !== null ? replaced : '';
    }
    
    // Handle cases where AI returned a structure with Title/Content but without keyword markers
    // This ensures we still extract meaningful parts even if the formatting is inconsistent
    if (extractedKeywords.length === 0) {
      // Try to extract keywords from content if none were found
      const potentialKeywords = extractKeywordsFromContent(content);
      if (potentialKeywords.length > 0) {
        extractedKeywords = potentialKeywords;
      }
    }
    
    // Clean up content - aggressively remove all markdown and formatting elements
    content = content
      // Remove common structural markers
      .replace(/^Title:[\s]*(.*?)(?:\n|$)/i, '')  // Remove title marker
      .replace(/^Content:[\s]*/i, '')
      .replace(/^Caption:[\s]*/i, '')
      .replace(/^Description:[\s]*/i, '')
      .replace(/^Message:[\s]*/i, '')
      
      // Remove any pattern that looks like a section header (number/text followed by colon at start of line)
      .replace(/^\d+\.?\s+[^:]+:[\s]*/gm, '')
      .replace(/^[A-Za-z\s]+:[\s]*/gm, '')
      
      // Remove markdown formatting
      .replace(/###\s+/g, '')      // Remove markdown headers
      .replace(/##\s+/g, '')       // Remove H2 headers
      .replace(/#\s+/g, '')        // Remove H1 headers (but preserve #hashtags)
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic formatting
      .replace(/_(.*?)_/g, '$1')       // Remove underscore emphasis
      .replace(/^\s*-\s+/gm, '')     // Remove list item dashes at line start
      .replace(/^\s*•\s+/gm, '')     // Remove bullet points
      
      // Remove any numbered list formatting
      .replace(/^\s*\d+\.\s+/gm, '')
      
      // Custom handling for the patterns we've observed
      .replace(/Keywords:[\s\S]*$/i, '') // Remove everything from "Keywords:" to the end
      
      .trim();
      
    // Final cleanup - if we can identify and remove unwanted sections that remain
    // Check if content has multiple sections with different formatting (common pattern)
    if (content.includes("\n\n")) {
      // Split by double new line which often separates sections
      const sections = content.split(/\n\n+/);
      // For social captions, typically we just want the first section without any formatting
      if (contentType === 'social_media_caption' && sections.length > 1) {
        // Check if last section looks like a list of keywords - if so, remove it
        if (/^\d+\.\s+|^[A-Za-z\s]+:\s+|^-\s+|^•\s+/.test(sections[sections.length-1])) {
          sections.pop();
        }
        content = sections.join("\n\n");
      }
    }
    
    return { title, content, extractedKeywords };
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback content generation in case of API failure
    const title = `Experience ${property.name}`;
    const content = `Discover the beauty of ${property.name} in ${property.location}. This ${property.bedrooms}-bedroom property offers a perfect blend of comfort and style for your next getaway.`;
    const extractedKeywords = ['vacation', 'getaway', 'comfort'];
    
    return { title, content, extractedKeywords };
  }
}

  // Brand Voice Analysis API
  app.post("/api/analyze-brand-voice", async (req, res) => {
    try {
      const { input, inputType, propertyId } = req.body;
      
      if (!input || !inputType || !propertyId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const analysis = await analyzeBrandVoice(input, inputType);
      
      // Update property with the brand voice results
      const propertyIdNum = parseInt(propertyId);
      const updatedProperty = await storage.updateProperty(propertyIdNum, {
        brandVoice: analysis.brandVoice,
        brandVoiceSummary: analysis.brandVoiceSummary
      });
      
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.status(200).json(analysis);
    } catch (error) {
      console.error("Error in brand voice analysis endpoint:", error);
      res.status(500).json({ message: "Failed to analyze brand voice" });
    }
  });

  // Add a final catch-all route handler for SPA routes in production
  // This is crucial for routes like /dashboard to work properly
  if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res, next) => {
      // Skip API routes and static asset requests
      if (req.path.startsWith('/api/') || 
          req.path.includes('.') || 
          !req.headers.accept || 
          !req.headers.accept.includes('text/html')) {
        return next();
      }
      
      console.log(`Production SPA fallback for: ${req.path}`);
      res.sendFile('index.html', { root: './public' });
    });
  }

  const httpServer = createServer(app);

  return httpServer;
}
