import axios from "axios";

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = "stabilityai/stable-diffusion-2-1"; // can change if you like

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // we expect image bytes
      }
    );

    // Convert to base64 for frontend
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.json({ imageUrl });
  } catch (error) {
    console.error("Hugging Face error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
};
