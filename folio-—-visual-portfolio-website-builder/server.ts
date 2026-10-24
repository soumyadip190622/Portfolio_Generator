import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Writing Assistant Endpoint
app.post('/api/ai/assist', async (req, res) => {
  const { action, input, profession = 'Professional', context = '' } = req.body || {};

  if (!action) {
    return res.status(400).json({ error: 'Missing AI action type.' });
  }

  const ai = getGenAIClient();

  // Smart fallback generator if API key is not configured or rate-limited
  const buildFallback = () => {
    const cleanInput = (input || '').trim();
    switch (action) {
      case 'write_bio':
        return {
          result: `I am a dedicated ${profession} focused on building high-impact, resilient digital experiences that bridge technical precision with human-centered design. ${cleanInput ? `Specializing in ${cleanInput}, ` : ''}I partner with ambitious teams to turn complex product challenges into clean, measurable outcomes.`,
          alternatives: [
            `As an experienced ${profession}, I combine architectural rigor with refined craft. My work centers on ${cleanInput || 'modern web systems, scalable interfaces, and thoughtful product strategy'}, delivering solutions that perform at scale.`,
            `${profession} with a passion for clarity, speed, and purposeful design. Over the past several years, I have helped organizations ship products around ${cleanInput || 'user-focused engineering and visual storytelling'}.`,
          ],
        };
      case 'improve_description':
        return {
          result: cleanInput
            ? `${cleanInput.replace(/\.$/, '')} — engineered for reliability, accessibility, and measurable user impact across modern devices.`
            : `Led end-to-end architecture and delivery of core product workflows, improving load performance by 38% and increasing user engagement.`,
          alternatives: [
            `Spearheaded the design and implementation of ${cleanInput || 'this initiative'}, reducing operational friction and establishing a reusable component foundation.`,
          ],
        };
      case 'suggest_skills':
        return {
          skills:
            profession.toLowerCase().includes('design')
              ? ['Design Systems', 'Figma', 'Prototyping', 'User Research', 'Interaction Design', 'Accessibility (WCAG)', 'Design Tokens', 'Visual Direction']
              : profession.toLowerCase().includes('photo')
              ? ['Editorial Lighting', 'Medium Format', 'Color Grading', 'Capture One', 'Architectural Composition', 'Art Direction', 'Studio Retouching', 'Exhibition Curation']
              : ['TypeScript', 'React', 'Next.js', 'Node.js', 'System Architecture', 'PostgreSQL', 'GraphQL', 'Cloud Infrastructure'],
        };
      case 'generate_taglines':
        return {
          taglines: [
            `${profession} crafting high-precision digital products & systems.`,
            `Turning complex ideas into clear, resilient human experiences.`,
            `Building thoughtful software and visual systems where craft meets scale.`,
          ],
        };
      case 'fix_grammar':
        return {
          result: cleanInput
            ? cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1).replace(/\s+/g, ' ')
            : 'Delivered high-impact solutions with measurable results and cross-functional collaboration.',
        };
      case 'project_description':
        return {
          result: `${cleanInput || 'Modern Web Platform'} — A production-grade application built with ${context || 'TypeScript, React, and scalable cloud architecture'}. Designed to streamline complex workflows with sub-100ms response times, accessible UI patterns, and real-time state synchronization.`,
        };
      default:
        return {
          result: cleanInput || `Crafted tailored ${profession} solutions with clarity and measurable impact.`,
        };
    }
  };

  if (!ai) {
    return res.json({ ...buildFallback(), source: 'smart-assistant' });
  }

  try {
    if (action === 'suggest_skills') {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Suggest 8 highly relevant professional skills for a ${profession}. Context/existing skills: ${input || 'none'}.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['skills'],
          },
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      return res.json({ skills: parsed.skills || buildFallback().skills, source: 'gemini' });
    }

    if (action === 'generate_taglines') {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Generate 3 distinct, compelling, concise portfolio headline taglines for a ${profession}. Keywords/context: ${input || profession}. Avoid clichés.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              taglines: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['taglines'],
          },
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      return res.json({ taglines: parsed.taglines || buildFallback().taglines, source: 'gemini' });
    }

    const promptMap: Record<string, string> = {
      write_bio: `Write a compelling, authentic 2-3 sentence professional portfolio bio for a ${profession}. Keywords/notes: "${input}". Context: "${context}". Also provide 2 alternative variations.`,
      improve_description: `Rewrite and elevate this portfolio description to sound clearer, more impactful, and professional without buzzword fluff: "${input}". Context: ${profession}. Provide main result and 1 alternative.`,
      fix_grammar: `Fix any grammar, spelling, or awkward phrasing in this text while keeping its authentic voice and making it crisp and professional: "${input}".`,
      project_description: `Write a concise, impressive 2-3 sentence portfolio project description. Project title/notes: "${input}". Tech stack / details: "${context}".`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptMap[action] || `Improve this portfolio text for a ${profession}: "${input}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            result: { type: Type.STRING },
            alternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['result'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      result: parsed.result || buildFallback().result,
      alternatives: parsed.alternatives || [],
      source: 'gemini',
    });
  } catch (err) {
    return res.json({ ...buildFallback(), source: 'fallback' });
  }
});

// 2. AI Resume Import Endpoint
app.post('/api/ai/parse-resume', async (req, res) => {
  const { resumeText } = req.body || {};
  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 10) {
    return res.status(400).json({ error: 'Please paste or upload valid resume text (at least 10 characters).' });
  }

  const ai = getGenAIClient();

  const buildFallbackResumeParse = (raw: string) => {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const name = lines[0] && lines[0].length < 50 ? lines[0] : 'Jordan Taylor';
    const emailMatch = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = raw.match(/(\+?\d[\d\s\-()]{7,}\d)/);

    return {
      profile: {
        name,
        headline: lines[1] && lines[1].length < 90 ? lines[1] : 'Senior Full-Stack Engineer & Product Architect',
        location: 'San Francisco, CA',
        email: emailMatch ? emailMatch[0] : 'jordan@example.com',
        phone: phoneMatch ? phoneMatch[0] : '+1 (555) 234-5678',
      },
      about: {
        bio: raw.slice(0, 360),
        quickFacts: [
          { label: 'Focus', value: 'Product Engineering & Architecture' },
          { label: 'Availability', value: 'Open to select roles' },
        ],
      },
      skills: [
        { name: 'TypeScript', category: 'Frontend', level: 92 },
        { name: 'React & Next.js', category: 'Frontend', level: 95 },
        { name: 'Node.js & APIs', category: 'Backend', level: 88 },
        { name: 'System Design', category: 'Architecture', level: 85 },
      ],
      experience: [
        {
          role: 'Senior Engineer / Lead',
          company: 'Extracted from Resume',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          location: 'Remote',
          bullets: [
            'Led core architecture and delivery of scalable customer-facing applications.',
            'Collaborated across product, design, and engineering to ship high-reliability features.',
          ],
        },
      ],
      education: [
        {
          institute: 'University of Technology',
          degree: 'B.S. in Computer Science',
          startDate: '2016',
          endDate: '2020',
          grade: 'Honors',
        },
      ],
      projects: [
        {
          title: 'Featured Portfolio Project',
          description: 'Key project highlighted from resume history with measurable performance and UX outcomes.',
          tags: ['TypeScript', 'React', 'Cloud'],
          liveUrl: 'https://example.com',
          githubUrl: 'https://github.com',
          featured: true,
          category: 'Web App',
        },
      ],
    };
  };

  if (!ai) {
    return res.json({ data: buildFallbackResumeParse(resumeText), source: 'smart-parser' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Extract structured portfolio data from the following resume text:\n\n${resumeText.slice(0, 12000)}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            profile: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                headline: { type: Type.STRING },
                location: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
              },
              required: ['name', 'headline'],
            },
            about: {
              type: Type.OBJECT,
              properties: {
                bio: { type: Type.STRING },
              },
              required: ['bio'],
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  level: { type: Type.NUMBER },
                },
                required: ['name', 'category', 'level'],
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  location: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['role', 'company'],
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institute: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  grade: { type: Type.STRING },
                },
                required: ['institute', 'degree'],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'description'],
              },
            },
          },
          required: ['profile', 'about'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ data: parsed, source: 'gemini' });
  } catch (err) {
    return res.json({ data: buildFallbackResumeParse(resumeText), source: 'fallback' });
  }
});

// 3. AI Portfolio Review Endpoint (Score + 5 concrete tips across Content, Design, SEO)
app.post('/api/ai/review-portfolio', async (req, res) => {
  const { portfolio } = req.body || {};
  if (!portfolio) {
    return res.status(400).json({ error: 'Missing portfolio object for review.' });
  }

  const ai = getGenAIClient();

  const buildDeterministicReview = () => {
    let score = 72;
    const tips: Array<{ category: 'Content' | 'Design' | 'SEO'; title: string; detail: string }> = [];

    const visibleSections = (portfolio.sections || []).filter((s: { visible?: boolean }) => s.visible);
    if (visibleSections.length >= 5) score += 8;
    if (portfolio.profile?.headline && portfolio.profile.headline.length > 20) score += 5;
    if (portfolio.seo?.title && portfolio.seo?.description && portfolio.seo.description.length >= 50) score += 8;
    if (portfolio.profile?.email) score += 4;

    tips.push({
      category: 'Content',
      title: 'Quantify project outcomes with concrete metrics',
      detail: 'Add measurable impact numbers (e.g., "+42% faster load time", "15k active users") to your top 2 featured project descriptions so recruiters immediately see real-world results.',
    });
    tips.push({
      category: 'Content',
      title: 'Sharpen your hero headline value proposition',
      detail: `Your current headline ("${portfolio.profile?.headline || 'Not set'}") can be strengthened by pairing your core role with the specific problem you solve for teams or clients.`,
    });
    tips.push({
      category: 'Design',
      title: 'Maintain visual rhythm across long sections',
      detail: 'Alternate dense text sections (Experience, About) with visual proof sections (Projects, Gallery, Testimonials) so visitors stay engaged while scrolling.',
    });
    tips.push({
      category: 'SEO',
      title: 'Optimize meta description length (120–155 characters)',
      detail:
        portfolio.seo?.description && portfolio.seo.description.length >= 80
          ? 'Your SEO description has good length. Include your primary location or specialization keyword near the beginning for better search click-through.'
          : 'Your SEO meta description is currently brief. Expand it to 120–155 characters summarizing your role, core stack, and availability.',
    });
    tips.push({
      category: 'SEO',
      title: 'Add descriptive alt text to all project visuals',
      detail: 'Descriptive alt text improves WCAG screen-reader accessibility and helps search engines index your portfolio case studies.',
    });

    return {
      score: Math.min(98, score),
      summary: `Strong portfolio foundation with ${visibleSections.length} active sections on the "${portfolio.layout?.templateId || 'minimal-clean'}" template. Addressing the 5 targeted improvements below will elevate conversion and search visibility.`,
      tips,
    };
  };

  if (!ai) {
    return res.json({ ...buildDeterministicReview(), source: 'smart-auditor' });
  }

  try {
    const compactSummary = {
      profile: portfolio.profile,
      templateId: portfolio.layout?.templateId,
      theme: portfolio.theme,
      seo: portfolio.seo,
      visibleSections: (portfolio.sections || [])
        .filter((s: { visible?: boolean }) => s.visible)
        .map((s: { type: string; title: string }) => ({ type: s.type, title: s.title })),
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Audit this personal portfolio configuration and provide an overall quality score (0-100), a 2-sentence executive summary, and exactly 5 specific, actionable improvement tips covering Content, Design, and SEO.\n\nPortfolio summary:\n${JSON.stringify(compactSummary)}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING },
                },
                required: ['category', 'title', 'detail'],
              },
            },
          },
          required: ['score', 'summary', 'tips'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.tips || !Array.isArray(parsed.tips) || parsed.tips.length === 0) {
      return res.json({ ...buildDeterministicReview(), source: 'fallback' });
    }
    return res.json({
      score: parsed.score || 85,
      summary: parsed.summary,
      tips: parsed.tips.slice(0, 5),
      source: 'gemini',
    });
  } catch (err) {
    return res.json({ ...buildDeterministicReview(), source: 'fallback' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FOLIO server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
