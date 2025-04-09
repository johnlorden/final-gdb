export interface VerseResult {
  text: string;
  reference: string;
  categories?: string[];
  category?: string;
}

export interface XmlDocPromises {
  [key: string]: Promise<Document> | null;
}
