// Azure Static Web Apps - Serverless API Proxy for Azure OpenAI
// API 키를 서버측에서 안전하게 관리

module.exports = async function (context, req) {
    context.log('Metal Analysis API called');

    // CORS preflight
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
        return;
    }

    // POST만 허용
    if (req.method !== 'POST') {
        context.res = {
            status: 405,
            body: { error: 'Method not allowed' }
        };
        return;
    }

    try {
        const { artist, song } = req.body;

        if (!artist || !song) {
            context.res = {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: { error: 'Artist and song are required' }
            };
            return;
        }

        // 환경 변수에서 API 설정 로드 (Azure Portal에서 설정)
        const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
        const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
        const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
        const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

        if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY) {
            context.log.error('Azure OpenAI configuration missing');
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: { error: 'Server configuration error' }
            };
            return;
        }

        const systemPrompt = `
You are the "ZEORBIG Metal Analysis Engine". Your goal is to analyze a song and provide structured data.

Perform the following steps based on the user's Artist Name and Song Title:

1. **Genre Check**: Determine if this artist/song is primarily Metal or a Metal subgenre (e.g., Thrash, Death, Power, Heavy Metal). Set "isMetal" boolean accordingly.
2. **Get Original Lyrics**: Retrieve the full, original English lyrics.
3. **Translate Lyrics**: Translate these lyrics into fluent, emotional Korean.
4. **Artist Info**: Retrieve the artist's discography/bio and translate it into natural Korean (keep proper nouns in English).
5. **Song Interpretation**: Analyze the song's meaning, themes, and context. Explain it in Korean using Markdown.
6. **Walkthrough**: Write a brief Korean intro guiding the user through the content.
7. **Image Prompt**: Create a vivid, dynamic English image prompt for a header image. If Metal, use dark/gritty metal aesthetic. If not Metal, use an aesthetic appropriate for the genre.
8. **External Links**: 
   - **Metal Archives**: ONLY if "isMetal" is true, find the URL on 'metal-archives.com'. Otherwise set to null.
   - **Metal Music Archives**: ONLY if "isMetal" is true, find the URL on 'metalmusicarchives.com'. Otherwise set to null.
   - **Wikipedia**: Provide a relevant Wikipedia URL.
   - **YouTube**: Generate a YouTube search URL for the song.

**CRITICAL OUTPUT INSTRUCTION**:
Output strictly valid JSON. No markdown formatting.
Structure:
{
  "isMetal": boolean,
  "lyricsOriginal": "String",
  "lyricsKorean": "String",
  "artistInfo": "String",
  "songInterpretation": "String",
  "walkthrough": "String",
  "imagePrompt": "String",
  "externalLinks": {
    "metalArchives": "URL String or null",
    "metalMusicArchives": "URL String or null",
    "wikipedia": "URL String or null",
    "youtube": "URL String"
  }
}
        `;

        const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;

        context.log(`Calling Azure OpenAI: ${AZURE_OPENAI_DEPLOYMENT}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': AZURE_OPENAI_API_KEY
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Artist: ${artist}, Song: ${song}` }
                ],
                temperature: 0.7,
                max_tokens: 4000
            })
        });

        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || '60';
            context.res = {
                status: 429,
                headers: { 
                    'Content-Type': 'application/json',
                    'Retry-After': retryAfter
                },
                body: { error: 'Rate limit exceeded', retryAfter: parseInt(retryAfter) }
            };
            return;
        }

        if (!response.ok) {
            const errorText = await response.text();
            context.log.error(`Azure OpenAI error: ${response.status} - ${errorText}`);
            context.res = {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
                body: { error: `API error: ${response.status}` }
            };
            return;
        }

        const data = await response.json();
        let textContent = data.choices?.[0]?.message?.content;

        if (!textContent) {
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: { error: 'No content generated' }
            };
            return;
        }

        // JSON 추출
        const jsonStart = textContent.indexOf('{');
        const jsonEnd = textContent.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
            textContent = textContent.substring(jsonStart, jsonEnd + 1);
        }

        let parsedData;
        try {
            parsedData = JSON.parse(textContent);
        } catch (e) {
            context.log.error('JSON parse error:', e.message);
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: { error: 'Invalid JSON from AI model' }
            };
            return;
        }

        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: parsedData
        };

    } catch (error) {
        context.log.error('Unexpected error:', error.message);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: { error: error.message || 'Unexpected error occurred' }
        };
    }
};
