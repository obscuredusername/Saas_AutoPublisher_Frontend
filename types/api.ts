export interface KeywordResponse {
  success: boolean;
  message: string;
  keyword: string;
  country: string;
  language: string;
  unique_links: string[];
  links_count: number;
  status: string;
}