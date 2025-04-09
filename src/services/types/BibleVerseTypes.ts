
export interface VerseResult {
  text: string;
  reference: string;
  categories?: string[];
  category?: string;
}

export interface XmlDocPromises {
  [key: string]: Promise<Document> | null;
}

export type CachedVerses = Map<string, VerseResult[]>;
export type CachedAllVerses = VerseResult[] | null;

export interface SearchCaches {
  [key: string]: Map<string, VerseResult[]>;
}
