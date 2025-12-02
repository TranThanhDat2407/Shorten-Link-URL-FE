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

@Injectable({
  providedIn: 'root',
})
export class LinkService {

  constructor(private http: HttpClient) {}

  createShortLinkPublic(request: CreateShortLinkRequest): Observable<CreateShortLinkResponse> {
    return this.http.post<CreateShortLinkResponse>(API_URLS.SHORT_LINK.CREATE_PUBLIC, request);
  }

  createShortLink(request: CreateShortLinkRequest): Observable<CreateShortLinkResponse> {
    return this.http.post<CreateShortLinkResponse>(API_URLS.SHORT_LINK.CREATE, request);
  }

  getMyLinks(body: LinkSearchRequest, params: HttpParams): Observable<PageResponse<LinkResponse>> {
    return this.http.post<PageResponse<LinkResponse>>(
      API_URLS.SHORT_LINK.MY_LINKS,
      body,
      { params }
    );
  }

  deleteLink(linkId: number): Observable<any> {
    return this.http.delete(API_URLS.SHORT_LINK.DELETE(linkId));
  }

  updateLink(body: UpdateLinkRequest, linkId: number): Observable<any> {
    const url = API_URLS.SHORT_LINK.UPDATE(linkId);
    return this.http.put(url, body);
  }

  getLinkDetails(id: number): Observable<LinkResponse> {
    return this.http.get<LinkResponse>(API_URLS.SHORT_LINK.DETAILS(id));
  }

  getLinkClickLogs(id: number, params: HttpParams): Observable<PageResponse<LinkClickLogResponse>> {
    return this.http.get<PageResponse<LinkClickLogResponse>>(API_URLS.SHORT_LINK.LOGS(id), { params });
  }
}
