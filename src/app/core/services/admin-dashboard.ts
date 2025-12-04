import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CreateShortLinkRequest, CreateShortLinkResponse, Link} from '../../common/models/link.model';
import {map, Observable} from 'rxjs';
import {API_URLS} from '../../common/constants/api.constants';
import {PageResponse} from '../../common/models/response/page-response';
import {LinkResponse} from '../../common/models/response/link-response';
import {LinkSearchRequest} from '../../common/models/request/link-request';
import {UpdateLinkRequest} from '../../common/models/request/update-link-request';
import {LinkClickLogResponse} from '../../common/models/response/link-click-log.response';
import {AdminDailyClickResponse} from '../../common/models/response/daily-click-response';
import {AdminDashboardResponse} from '../../common/models/response/admin-dashboard-response';

@Injectable({
  providedIn: 'root',
})
export class AdminAnalyzeService {

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(API_URLS.ADMIN.DASHBOARD);
  }

  getChartData(): Observable<AdminDailyClickResponse[]> {
    return this.http.get<AdminDailyClickResponse[]>(API_URLS.ADMIN.CHART7DAYS);
  }

  getLinks(body: LinkSearchRequest, params: HttpParams): Observable<PageResponse<LinkResponse>> {
    return this.http.post<PageResponse<LinkResponse>>(
      API_URLS.ADMIN.LINKS,
      body,
      { params }
    );
  }
}
