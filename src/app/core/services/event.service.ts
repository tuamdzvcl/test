import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable, map, of } from 'rxjs'
import { EventModel } from '../model/event.model'
import { PageResult } from '../model/api-page-response.model';
import { BaseApiService } from './base-api.service';
import { EventRequest } from '../model/request/eventRequest.model';
import { ApiResponse } from '../model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseApiService {

  constructor(
    http: HttpClient
  ) {
    super(http);
  }

  GetEvents(pageIndex: number, pageSize: number, key: string) {
    const params: any = {
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    if (key) {
      params.key = key;
    }
    return this.getpage<EventModel>('event/page', params).pipe(
      map((res: PageResult<EventModel>) => {
        return {
          items: res.Items,
          pageIndex: res.PageIndex,
          pageSize: res.PageSize,
          totalRecords: res.TotalRecords,
          totalPages: res.TotalPages
        }
      })
    )
  }

  CreateEvent(data: EventRequest) {
    return this.post<ApiResponse<EventModel>>('event', data);
  }
}