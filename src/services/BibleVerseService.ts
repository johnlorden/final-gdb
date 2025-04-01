interface BibleVerse {
  verse: string;
  reference: string;
}

const backgroundColors = [
  "bg-blue-100", "bg-green-100", "bg-indigo-100", "bg-purple-100", 
  "bg-pink-100", "bg-yellow-100", "bg-red-100", "bg-orange-100",
  "bg-emerald-100", "bg-teal-100", "bg-cyan-100", "bg-sky-100",
  "bg-violet-100", "bg-fuchsia-100", "bg-rose-100", "bg-amber-100"
];

const gradients = [
  "bg-gradient-to-r from-blue-200 to-cyan-200",
  "bg-gradient-to-r from-violet-200 to-pink-200",
  "bg-gradient-to-r from-yellow-200 to-orange-200",
  "bg-gradient-to-r from-green-200 to-emerald-200",
  "bg-gradient-to-r from-indigo-200 to-purple-200",
  "bg-gradient-to-r from-rose-200 to-red-200",
  "bg-gradient-to-r from-amber-200 to-yellow-200",
  "bg-gradient-to-r from-teal-200 to-cyan-200",
  "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100",
  "bg-gradient-to-br from-green-100 via-teal-100 to-blue-100",
  "bg-gradient-to-bl from-pink-100 via-rose-100 to-amber-100",
  "bg-gradient-to-bl from-indigo-100 via-purple-100 to-pink-100",
  "bg-gradient-to-tr from-emerald-100 via-green-100 to-lime-100",
  "bg-gradient-to-tr from-sky-100 via-blue-100 to-indigo-100",
  "bg-gradient-to-tl from-amber-100 via-orange-100 to-red-100",
  "bg-gradient-to-tl from-cyan-100 via-sky-100 to-blue-100"
];

let bibleVersesCache: BibleVerse[] | null = null;

const parseXML = (xmlString: string): BibleVerse[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const verseElements = xmlDoc.querySelectorAll("verse");
  
  const verses: BibleVerse[] = [];
  
  verseElements.forEach((verseElement) => {
    const textElement = verseElement.querySelector("text");
    const referenceElement = verseElement.querySelector("reference");
    
    if (textElement && referenceElement) {
      verses.push({
        verse: textElement.textContent || "",
        reference: referenceElement.textContent || ""
      });
    }
  });
  
  return verses;
};

const loadBibleVerses = async (): Promise<BibleVerse[]> => {
  if (bibleVersesCache) {
    return bibleVersesCache;
  }
  
  try {
    const response = await fetch('/data/bible-verses.xml');
    if (!response.ok) {
      throw new Error('Failed to load Bible verses');
    }
    
    const xmlString = await response.text();
    const verses = parseXML(xmlString);
    
    // Cache the verses for future use
    bibleVersesCache = verses;
    return verses;
  } catch (error) {
    console.error('Error loading Bible verses:', error);
    // Return an empty array if there's an error
    return [];
  }
};

export const getRandomVerse = async (): Promise<BibleVerse> => {
  const verses = await loadBibleVerses();
  if (verses.length === 0) {
    // Return a default verse if no verses are available
    return {
      verse: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      reference: "John 3:16"
    };
  }
  
  const randomIndex = Math.floor(Math.random() * verses.length);
  return verses[randomIndex];
};

export const getRandomBackground = (): string => {
  // Prioritize gradients as they look better
  if (Math.random() > 0.2) { // 80% chance to get a gradient
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    return backgroundColors[randomIndex];
  }
};
