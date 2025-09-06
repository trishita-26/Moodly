// File: controller/aiController.js
import axios from "axios";

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = "prompthero/openjourney-v4";

console.log('🔑 HF_API_KEY loaded:', HF_API_KEY ? 'YES' : 'NO');

export const generateImage = async (req, res) => {
  console.log('🎯 generateImage function called');
  console.log('📝 Request body:', req.body);
  
  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.log('❌ No prompt provided');
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`🎨 Generating image for: "${prompt}"`);

    // Increase timeout significantly and add retry logic
    let attempts = 0;
    const maxAttempts = 2;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`🔄 Attempt ${attempts}/${maxAttempts}`);
      
      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/${HF_MODEL}`,
          { 
            inputs: prompt,
            parameters: {
              num_inference_steps: 20, // Reduce steps for faster generation
              guidance_scale: 7.5,
            }
          },
          {
            headers: {
              Authorization: `Bearer ${HF_API_KEY}`,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
            timeout: 120000, // 2 minutes timeout
          }
        );

        console.log('📊 Response status:', response.status);
        console.log('📊 Response size:', response.data.length, 'bytes');
        
        // Check if we got HTML instead of image data
        const responseText = response.data.toString('utf8', 0, 100);
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
          console.log('❌ Received HTML error page, attempt:', attempts);
          
          if (attempts >= maxAttempts) {
            return res.status(503).json({ 
              error: "AI model is currently loading. Please wait 2-3 minutes and try again." 
            });
          }
          
          // Wait before retry
          console.log('⏳ Waiting 10 seconds before retry...');
          await new Promise(resolve => setTimeout(resolve, 10000));
          continue;
        }

        // Check if response is too small (likely an error)
        if (response.data.length < 5000) {
          console.log('❌ Response too small:', response.data.length, 'bytes');
          console.log('📄 Response content:', response.data.toString('utf8').substring(0, 200));
          
          if (attempts >= maxAttempts) {
            return res.status(503).json({ 
              error: "AI service returned invalid response. Please try again." 
            });
          }
          
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }

        const base64Image = Buffer.from(response.data, "binary").toString("base64");
        const imageUrl = `data:image/png;base64,${base64Image}`;

        console.log('✅ Image generated successfully on attempt', attempts);
        return res.json({ 
          imageUrl,
          attempts,
          model: HF_MODEL
        });
        
      } catch (attemptError) {
        console.log(`❌ Attempt ${attempts} failed:`, attemptError.message);
        
        if (attemptError.code === 'ECONNABORTED' && attempts < maxAttempts) {
          console.log('⏳ Timeout occurred, waiting before retry...');
          await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds
          continue;
        }
        
        if (attempts >= maxAttempts) {
          throw attemptError; // Re-throw on final attempt
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Final error:", error.message);
    console.error("❌ Error code:", error.code);

    // Handle timeout specifically
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ 
        error: "The AI model is taking too long to respond. This usually means it's loading or very busy. Please try again in 2-3 minutes." 
      });
    }

    // Handle other axios errors
    if (error.response) {
      console.error("❌ Response status:", error.response.status);
      
      if (error.response.status === 503) {
        return res.status(503).json({ 
          error: "AI model is currently unavailable. Please try again in a few minutes." 
        });
      }
      
      if (error.response.status === 429) {
        return res.status(429).json({ 
          error: "Rate limit exceeded. Please wait before trying again." 
        });
      }
    }

    res.status(500).json({ 
      error: "Failed to generate image. The AI service might be overloaded. Please try again later." 
    });
  }
};