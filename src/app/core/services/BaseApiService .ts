import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../model/api-response.model';
import { ApiError } from '../model/ApiError.model';
import { PageResult } from '../model/api-page-response.model';

@Injectable({ providedIn: 'root' })
export class BaseApiService {

  protected baseUrl = 'http://localhost:5083/api';

  constructor(protected http: HttpClient) {}

  get<T>(url:string):Observable<T>{
    return this.http.get<ApiResponse<T>>(
      `${this.baseUrl}/${url}`
    ).pipe(map(res =>{
      if (!res.Success) {
              throw new ApiError(res.StatusCode, res.Message);
        }
        return res.Data;
    }))
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(
      `${this.baseUrl}/${url}`,
      body
    ).pipe(
      map(res => {
        if (!res.Success) {
              throw new ApiError(res.StatusCode, res.Message);
        }
        return res.Data;
      })
    );
  }

  getpage<T>(url: string, params?: any): Observable<PageResult<T>> {
    
  return this.http.get<PageResult<T>>(
    `${this.baseUrl}/${url}`,{ params: params }
  ).pipe(
    map(res => {
      if (!res.Success) {
        throw new ApiError(res.StatusCode, res.Message);
      }
      return res;
    })
  );
}
}