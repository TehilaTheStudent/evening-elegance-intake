import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const backgrounds = [
      "a clean pure white studio backdrop with soft gradient shadows on the floor — minimal, high-end e-commerce style",
      "a luxury outdoor event garden with lush greenery, string lights, and elegant floral arrangements — all in beautiful soft bokeh blur behind the mannequin",
      "a grand marble hotel lobby with warm golden chandeliers and arched columns — softly blurred in the background with rich bokeh",
    ];

    const selectedBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    const prompt = `Transform this clothing image using the GHOST MANNEQUIN technique for a premium fashion catalog:

1. GHOST MANNEQUIN: Remove the person entirely (face, hands, skin, body). Display the garment on an invisible/ghost mannequin so the dress appears to float naturally in its correct 3D shape, as if worn by an invisible figure. No visible mannequin parts — just the garment holding its shape.

2. STUDIO LIGHTING: Use warm, soft, professional studio lighting that highlights the fabric texture, draping, stitching details, and true color of the garment. The lighting should be flattering and even, with subtle shadows for depth.

3. BACKGROUND: ${selectedBackground}. The background should complement and enhance the garment's color palette.

4. QUALITY: The final image should look like a professional fashion e-commerce / luxury catalog photo. Sharp garment details, beautiful color reproduction, premium aspirational feel.

5. CRITICAL: No person, no face, no hands, no skin visible. Only the garment in ghost mannequin style. Return only the transformed image.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }],
          generationConfig: {
            responseModalities: ["image", "text"]
          }
        })
      }
    );

    const data = await response.json();

    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('Gemini API error:', data.error);
      return res.json({ processedImage: null, error: data.error.message || 'Gemini API error' });
    }

    if (data.candidates?.[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          return res.json({ processedImage: part.inlineData.data });
        }
        if (part.inline_data?.data) {
          return res.json({ processedImage: part.inline_data.data });
        }
      }
    }

    return res.json({
      processedImage: null,
      message: 'AI processing did not return an image',
      debug: data
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ error: 'Failed to process image' });
  }
}
