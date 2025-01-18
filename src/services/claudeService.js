import { Anthropic } from '@anthropic-ai/sdk';

export const generateAffirmations = async (goal) => {
  const claude = new Anthropic({
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const response = await claude.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    temperature: 0.7,
    system: "Jsi expert na vytváření pozitivních afirmací. Odpovídej pouze samotnými afirmacemi, každou na novém řádku.",
    messages: [{
      role: "user",
      content: `Vytvoř 10 pozitivních afirmací pro tento cíl: ${goal}.`
    }]
  });

  return response.content[0].text.trim().split('\n');
};

export const validateAffirmations = async (affirmations) => {
  const claude = new Anthropic({
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const response = await claude.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    temperature: 0.7,
    system: "Jsi expert na kontrolu pozitivních afirmací. Tvým úkolem je zkontrolovat afirmace a vrátit JSON objekt s výsledkem kontroly.",
    messages: [{
      role: "user",
      content: `Zkontroluj tyto afirmace a vrať JSON objekt...`
    }]
  });

  return JSON.parse(response.content[0].text);
};