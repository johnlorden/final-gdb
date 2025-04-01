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
    verse: "Jesus said to him, \"I am the way, and the truth, and the life. No one comes to the Father except through me.\"",
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
  },
  {
    verse: "The fear of the LORD is the beginning of wisdom, and the knowledge of the Holy One is insight.",
    reference: "Proverbs 9:10"
  },
  {
    verse: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God.",
    reference: "Ephesians 2:8"
  },
  {
    verse: "Every good gift and every perfect gift is from above, coming down from the Father of lights, with whom there is no variation or shadow due to change.",
    reference: "James 1:17"
  },
  {
    verse: "This is the day that the LORD has made; let us rejoice and be glad in it.",
    reference: "Psalm 118:24"
  },
  {
    verse: "Be still, and know that I am God. I will be exalted among the nations, I will be exalted in the earth!",
    reference: "Psalm 46:10"
  },
  {
    verse: "Greater love has no one than this, that someone lay down his life for his friends.",
    reference: "John 15:13"
  },
  {
    verse: "The name of the LORD is a strong tower; the righteous man runs into it and is safe.",
    reference: "Proverbs 18:10"
  },
  {
    verse: "Your word is a lamp to my feet and a light to my path.",
    reference: "Psalm 119:105"
  },
  {
    verse: "Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs, with thankfulness in your hearts to God.",
    reference: "Colossians 3:16"
  },
  {
    verse: "Cast your burden on the LORD, and he will sustain you; he will never permit the righteous to be moved.",
    reference: "Psalm 55:22"
  },
  {
    verse: "For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, nor powers, nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord.",
    reference: "Romans 8:38-39"
  },
  {
    verse: "The grass withers, the flower fades, but the word of our God will stand forever.",
    reference: "Isaiah 40:8"
  },
  {
    verse: "Blessed are the pure in heart, for they shall see God.",
    reference: "Matthew 5:8"
  },
  {
    verse: "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control; against such things there is no law.",
    reference: "Galatians 5:22-23"
  },
  {
    verse: "Count it all joy, my brothers, when you meet trials of various kinds, for you know that the testing of your faith produces steadfastness.",
    reference: "James 1:2-3"
  }
];

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

export const getRandomVerse = (): BibleVerse => {
  const randomIndex = Math.floor(Math.random() * bibleVerses.length);
  return bibleVerses[randomIndex];
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
