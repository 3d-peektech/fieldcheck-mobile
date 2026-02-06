// GeminiAIService.ts
// Complete Gemini AI Integration Service (FETCH VERSION - React Native Compatible)
// Location: src/services/GeminiAIService.ts

// IMPORTANTE: Reemplaza con tu API key de Google AI Studio
// Obtén tu key en: https://makersuite.google.com/app/apikey
const GEMINI_API_KEY = 'AIzaSyDwPutYourRealKeyHere'; // ← REEMPLAZA ESTO

const GEMINI_VISION_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const GEMINI_TEXT_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface AssetAnalysisResult {
  assetType: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  conditionScore: number;
  defectsFound: string[];
  maintenanceRecommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedRepairCost?: string;
  detailedAnalysis: string;
  safetyIssues: string[];
  replacementRecommended: boolean;
}

export interface VoiceAnalysisResult {
  transcription: string;
  summary: string;
  detectedIssues: string[];
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface FinancialPrediction {
  totalEstimatedCost: number;
  breakdown: {
    repairs: number;
    maintenance: number;
    replacement: number;
    labor: number;
  };
  timeline: string;
  roi: number;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

class GeminiAIService {
  
  /**
   * Analiza imagen de asset con Gemini Vision
   */
  async analyzeAssetImage(imageBase64: string): Promise<AssetAnalysisResult> {
    try {
      const prompt = `You are an expert industrial asset inspector. Analyze this image in detail and provide:
      
1. Asset Type: Identify what type of equipment/asset this is
2. Overall Condition: Rate as excellent/good/fair/poor/critical
3. Condition Score: Give a score from 0-100
4. Defects Found: List all visible defects, damages, or issues
5. Maintenance Recommendations: Specific actions needed
6. Safety Issues: Any immediate safety concerns
7. Urgency Level: low/medium/high/critical
8. Estimated Repair Cost: Rough estimate in USD
9. Replacement Recommended: Yes or No

Be specific, technical, and actionable. Focus on details that maintenance teams need.

Format your response as JSON with these exact fields:
{
  "assetType": "string",
  "condition": "excellent|good|fair|poor|critical",
  "conditionScore": number,
  "defectsFound": ["string"],
  "maintenanceRecommendations": ["string"],
  "urgency": "low|medium|high|critical",
  "estimatedRepairCost": "string",
  "detailedAnalysis": "string",
  "safetyIssues": ["string"],
  "replacementRecommended": boolean
}`;

      const response = await fetch(GEMINI_VISION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response (sometimes Gemini wraps it in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return result as AssetAnalysisResult;
      }
      
      throw new Error('Could not parse AI response');
      
    } catch (error) {
      console.error('Gemini Vision API Error:', error);
      throw new Error('Failed to analyze image. Please check your API key and try again.');
    }
  }

  /**
   * Analiza audio/voz con Gemini
   */
  async analyzeVoiceInspection(transcription: string): Promise<VoiceAnalysisResult> {
    try {
      const prompt = `You are an expert field inspector analyzing a voice inspection report.

Voice Inspection Transcript:
"${transcription}"

Analyze this inspection report and provide:
1. A clear summary of what was inspected
2. All issues or defects detected
3. Specific recommendations for repairs/maintenance
4. Urgency level (low/medium/high)
5. Confidence level in the assessment (0-100)

Format as JSON:
{
  "transcription": "original text",
  "summary": "brief summary",
  "detectedIssues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2"],
  "urgency": "low|medium|high",
  "confidence": number
}`;

      const response = await fetch(GEMINI_TEXT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return result as VoiceAnalysisResult;
      }
      
      throw new Error('Could not parse AI response');
      
    } catch (error) {
      console.error('Gemini Text API Error:', error);
      throw new Error('Failed to analyze voice inspection.');
    }
  }

  /**
   * Genera predicción financiera
   */
  async generateFinancialPrediction(
    assetData: {
      assetType: string;
      condition: string;
      age: number;
      defects: string[];
      maintenanceHistory: string[];
    }
  ): Promise<FinancialPrediction> {
    try {
      const prompt = `You are a financial analyst for industrial asset management.

Asset Details:
- Type: ${assetData.assetType}
- Condition: ${assetData.condition}
- Age: ${assetData.age} years
- Known Defects: ${assetData.defects.join(', ')}
- Maintenance History: ${assetData.maintenanceHistory.join(', ')}

Provide a detailed financial prediction including:
1. Total estimated cost for next 12 months
2. Cost breakdown (repairs, maintenance, replacement, labor)
3. Timeline for major expenses
4. Expected ROI if properly maintained
5. Specific recommendations to optimize costs
6. Risk level assessment

Format as JSON:
{
  "totalEstimatedCost": number,
  "breakdown": {
    "repairs": number,
    "maintenance": number,
    "replacement": number,
    "labor": number
  },
  "timeline": "string describing when expenses will occur",
  "roi": number (percentage),
  "recommendations": ["rec1", "rec2"],
  "riskLevel": "low|medium|high"
}`;

      const response = await fetch(GEMINI_TEXT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return result as FinancialPrediction;
      }
      
      throw new Error('Could not parse AI response');
      
    } catch (error) {
      console.error('Gemini Financial API Error:', error);
      throw new Error('Failed to generate financial prediction.');
    }
  }

  /**
   * Verifica si la API key está configurada
   */
  isConfigured(): boolean {
    return GEMINI_API_KEY !== 'AIzaSyDwPutYourRealKeyHere' && GEMINI_API_KEY.length > 0;
  }

  /**
   * Test de conexión con Gemini
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(GEMINI_TEXT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: "Hello, respond with OK" }]
          }]
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }
}

export default new GeminiAIService();