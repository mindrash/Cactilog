// Simple content filter for display names
const EXPLICIT_WORDS = [
  'fuck', 'shit', 'damn', 'hell', 'bitch', 'asshole', 'bastard', 'crap',
  'piss', 'whore', 'slut', 'cock', 'dick', 'pussy', 'tits', 'ass',
  'sex', 'porn', 'nude', 'naked', 'xxx', 'adult', 'escort', 'hooker',
  'nazi', 'hitler', 'racist', 'nigger', 'faggot', 'retard', 'gay',
  'kill', 'die', 'death', 'murder', 'suicide', 'rape', 'abuse'
];

export function validateDisplayName(displayName: string): { isValid: boolean; error?: string } {
  if (!displayName) {
    return { isValid: true }; // Empty display name is allowed - will fall back to user name
  }

  // Check length
  if (displayName.length > 20) {
    return { isValid: false, error: "Display name must be 20 characters or less" };
  }

  // Check for explicit content
  const lowerName = displayName.toLowerCase();
  for (const word of EXPLICIT_WORDS) {
    if (lowerName.includes(word)) {
      return { isValid: false, error: "Display name contains inappropriate content" };
    }
  }

  // Check for only whitespace
  if (displayName.trim().length === 0) {
    return { isValid: false, error: "Display name cannot be empty or only spaces" };
  }

  return { isValid: true };
}

export function sanitizeDisplayName(displayName: string): string {
  if (!displayName) return '';
  return displayName.trim().substring(0, 20);
}