
export interface VerseResult {
  text: string;
  reference: string;
  categories?: string[];
  category?: string;
}

export type CachedVerses = Map<string, VerseResult[]>;
export type CachedAllVerses = VerseResult[] | null;
export type XmlDocPromises = Record<string, Promise<Document> | null>;
export type SearchCaches = Record<string, Map<string, VerseResult[]>>;
