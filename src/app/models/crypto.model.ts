export interface Crypto {
  id: number;
  externalId: string;
  name: string;
  symbol: string;
  priceUsd: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  priceChange24h: number;
}

export interface CryptoPageResponse {
  content: Crypto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CryptoFilter {
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
