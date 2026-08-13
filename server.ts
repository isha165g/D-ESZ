import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGenAIClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return aiClient;
  }

  // API Endpoint: Gemini AI Policy & Threat Risk Evaluation for D-ESZ
  app.post('/api/gemini/evaluate-esz', async (req, res) => {
    try {
      const { activeThreats, sensorCount, triggeredSensors, amoebaAreaSqKm, animalClusters } = req.body;

      const client = getGenAIClient();
      if (!client) {
        return res.status(200).json({
          status: 'fallback',
          message: 'GEMINI_API_KEY not configured, using local AIService reasoning.'
        });
      }

      const prompt = `
You are an expert GIS Wildlife Conservation Officer evaluating the Dynamic Corridor Eco-Sensitive Zone (D-ESZ) in Kaziranga-Bokakhat, Assam, India.

Current Real-time GIS Sensor Telemetry:
- Total AI Sensors Online: ${sensorCount}
- Triggered Sensors: ${JSON.stringify(triggeredSensors)}
- Active Wildlife Clusters: ${JSON.stringify(animalClusters)}
- Active Highway Threats: ${JSON.stringify(activeThreats)}
- Calculated Amoeba Geofence Polygon Area: ${amoebaAreaSqKm} sq km (vs static 10km radius of 314 sq km)

Generate a JSON object with this exact schema:
{
  "threatScore": number (0-100),
  "riskCategory": string ("NORMAL" | "WARNING" | "CRITICAL EMERGENCY"),
  "summary": string (brief 2-sentence executive summary),
  "recommendedSpeedLimit": string (e.g., "20 km/h on NH-37 Panbari stretch"),
  "impactedVillages": array of strings (names of nearby Assam villages needing SMS warning),
  "suggestedAction": string (actionable GIS mitigation directive),
  "reasoning": string (explanation comparing the amoeba dynamic boundary vs static 10km boundary)
}
Return ONLY valid JSON.
`;

      const response = await client.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const assessment = JSON.parse(cleanJsonStr);

      res.json({ status: 'success', assessment });
    } catch (error: any) {
      console.error('Gemini API Error in server.ts:', error);
      res.status(500).json({ error: error?.message || 'Failed to generate AI evaluation' });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', system: 'Dynamic Corridor Eco-Sensitive Zone (D-ESZ)' });
  });

  // Vite middleware in development vs Static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`D-ESZ Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start D-ESZ server:', err);
});
