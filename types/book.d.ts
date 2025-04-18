export interface Query {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface FilterQuery extends Query {
  search?: string;
  genre?: string;
  authorName?: string;
  publishedYear?: number;
}

export {}