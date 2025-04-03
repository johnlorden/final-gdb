
/**
 * Formats verse text by adding proper quotation marks and styling.
 * @param text The verse text to format
 */
export function formatVerseText(text: string): string {
  // Remove any existing quotation marks
  let formattedText = text.replace(/["'"']/g, '');
  
  // Add proper quotation marks
  formattedText = `"${formattedText}"`;
  
  return formattedText;
}

/**
 * Creates a sharable text format for verses
 * @param verse The verse text
 * @param reference The verse reference
 */
export function createShareableText(verse: string, reference: string): string {
  return `"${verse}" - ${reference} | God's Daily Bread`;
}

/**
 * Extracts book name from a verse reference
 * @param reference Verse reference (e.g., "John 3:16")
 */
export function extractBookName(reference: string): string {
  // Extract the book name (everything before the first number)
  const match = reference.match(/^([^\d]+)/);
  return match ? match[1].trim() : '';
}

/**
 * Checks if a reference is valid by common biblical patterns
 * @param reference The verse reference to validate
 */
export function isValidReference(reference: string): boolean {
  // Basic pattern: BookName Chapter:Verse or BookName Chapter:Verse-Verse
  const referencePattern = /^[a-zA-Z\s]+\s\d+:\d+(-\d+)?$/;
  return referencePattern.test(reference);
}

/**
 * Groups verses by category for better organization
 * @param verses Array of verse objects
 */
export function groupVersesByCategory(verses: Array<{ 
  text: string; 
  reference: string; 
  category?: string;
}>): Record<string, typeof verses> {
  const groupedVerses: Record<string, typeof verses> = {};
  
  verses.forEach(verse => {
    const category = verse.category || 'Uncategorized';
    
    if (!groupedVerses[category]) {
      groupedVerses[category] = [];
    }
    
    groupedVerses[category].push(verse);
  });
  
  return groupedVerses;
}
