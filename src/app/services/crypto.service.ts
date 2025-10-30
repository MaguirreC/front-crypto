import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryptoPageResponse, CryptoFilter } from '../models/crypto.model';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private apiUrl = 'http://localhost:8080/api/crypto';

  constructor(private http: HttpClient) {}

  getCryptos(
    page: number = 0,
    size: number = 10,
    filter?: CryptoFilter
  ): Observable<CryptoPageResponse> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (filter?.sortBy) {
      params = params.set('sortBy', filter.sortBy);
    }

    if (filter?.sortDirection) {
      params = params.set('direction', filter.sortDirection);
    }

    return this.http.get<CryptoPageResponse>(`${this.apiUrl}/list`, { params });
  }

  searchCryptos(
    query: string,
    page: number = 0,
    size: number = 10
  ): Observable<CryptoPageResponse> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<CryptoPageResponse>(`${this.apiUrl}/search`, { params });
  }

  filterCryptos(filter: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    minMarketCap?: number;
    maxMarketCap?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
  }): Observable<CryptoPageResponse> {
    let params = new HttpParams()
      .set('page', (filter.page || 0).toString())
      .set('size', (filter.size || 10).toString())
      .set('sortBy', filter.sortBy || 'marketCap')
      .set('direction', filter.direction || 'desc');

    if (filter.query && filter.query.trim() !== '') {
      params = params.set('query', filter.query);
    }

    if (filter.minPrice !== undefined && filter.minPrice !== null && !isNaN(filter.minPrice)) {
      params = params.set('minPrice', filter.minPrice.toString());
    }

    if (filter.maxPrice !== undefined && filter.maxPrice !== null && !isNaN(filter.maxPrice)) {
      params = params.set('maxPrice', filter.maxPrice.toString());
    }

    if (
      filter.minMarketCap !== undefined &&
      filter.minMarketCap !== null &&
      !isNaN(filter.minMarketCap)
    ) {
      params = params.set('minMarketCap', filter.minMarketCap.toString());
    }

    if (
      filter.maxMarketCap !== undefined &&
      filter.maxMarketCap !== null &&
      !isNaN(filter.maxMarketCap)
    ) {
      params = params.set('maxMarketCap', filter.maxMarketCap.toString());
    }

    return this.http.get<CryptoPageResponse>(`${this.apiUrl}/filter`, { params });
  }

  syncCryptos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sync`, {});
  }
}
