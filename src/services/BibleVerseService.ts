
interface BibleVerse {
  verse: string;
  reference: string;
}

const bibleVerses: BibleVerse[] = [
  {
    verse: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
    reference: "Jeremiah 29:11"
  },
  {
    verse: "Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    reference: "Proverbs 3:5-6"
  },
  {
    verse: "I can do all things through him who strengthens me.",
    reference: "Philippians 4:13"
  },
  {
    verse: "Be strong and courageous. Do not fear or be in dread of them, for it is the LORD your God who goes with you. He will not leave you or forsake you.",
    reference: "Deuteronomy 31:6"
  },
  {
    verse: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    reference: "John 3:16"
  },
  {
    verse: "The LORD is my shepherd; I shall not want.",
    reference: "Psalm 23:1"
  },
  {
    verse: "But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
    reference: "Isaiah 40:31"
  },
  {
    verse: "Jesus said to him, "I am the way, and the truth, and the life. No one comes to the Father except through me."",
    reference: "John 14:6"
  },
  {
    verse: "Come to me, all who labor and are heavy laden, and I will give you rest.",
    reference: "Matthew 11:28"
  },
  {
    verse: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.",
    reference: "Philippians 4:6"
  },
  {
    verse: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
    reference: "Romans 8:28"
  },
  {
    verse: "The LORD is my light and my salvation; whom shall I fear? The LORD is the stronghold of my life; of whom shall I be afraid?",
    reference: "Psalm 27:1"
  },
  {
    verse: "Let all that you do be done in love.",
    reference: "1 Corinthians 16:14"
  },
  {
    verse: "Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you.",
    reference: "1 Thessalonians 5:16-18"
  },
  {
    verse: "He has told you, O man, what is good; and what does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God?",
    reference: "Micah 6:8"
  },
  {
    verse: "But seek first the kingdom of God and his righteousness, and all these things will be added to you.",
    reference: "Matthew 6:33"
  },
  {
    verse: "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.",
    reference: "John 14:27"
  },
  {
    verse: "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
    reference: "Ephesians 4:32"
  },
  {
    verse: "The LORD bless you and keep you; the LORD make his face to shine upon you and be gracious to you; the LORD lift up his countenance upon you and give you peace.",
    reference: "Numbers 6:24-26"
  },
  {
    verse: "Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way; it is not irritable or resentful; it does not rejoice at wrongdoing, but rejoices with the truth.",
    reference: "1 Corinthians 13:4-6"
  }
];

const backgroundColors = [
  "bg-blue-100", "bg-green-100", "bg-indigo-100", "bg-purple-100", 
  "bg-pink-100", "bg-yellow-100", "bg-red-100", "bg-orange-100",
  "bg-emerald-100", "bg-teal-100", "bg-cyan-100", "bg-sky-100",
  "bg-violet-100", "bg-fuchsia-100", "bg-rose-100", "bg-amber-100"
];

const gradients = [
  "bg-gradient-to-r from-blue-100 to-green-100",
  "bg-gradient-to-r from-purple-100 to-pink-100",
  "bg-gradient-to-r from-yellow-100 to-orange-100",
  "bg-gradient-to-r from-green-100 to-teal-100",
  "bg-gradient-to-r from-indigo-100 to-purple-100",
  "bg-gradient-to-r from-red-100 to-pink-100",
  "bg-gradient-to-r from-amber-100 to-yellow-100",
  "bg-gradient-to-r from-teal-100 to-cyan-100"
];

export const getRandomVerse = (): BibleVerse => {
  const randomIndex = Math.floor(Math.random() * bibleVerses.length);
  return bibleVerses[randomIndex];
};

export const getRandomBackground = (): string => {
  // Choose between solid colors and gradients
  if (Math.random() > 0.5) {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    return backgroundColors[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  }
};

// Optionally, we could add a real API fetching function here
// For now, we're using the hardcoded verses
// export const fetchVerseFromAPI = async (): Promise<BibleVerse> => {
//   try {
//     const response = await fetch('https://bible-api.com/john+3:16');
//     const data = await response.json();
//     return {
//       verse: data.text,
//       reference: data.reference
//     };
//   } catch (error) {
//     console.error('Error fetching Bible verse:', error);
//     return getRandomVerse(); // Fallback to random verse
//   }
// };
