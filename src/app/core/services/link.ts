import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateShortLinkRequest, CreateShortLinkResponse, Link} from '../../common/models/link.model';
import {map, Observable} from 'rxjs';
import {API_URLS} from '../../common/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class LinkService {

  constructor(private http: HttpClient) {}

  createShortLink(request: CreateShortLinkRequest): Observable<CreateShortLinkResponse> {
    return this.http.post<CreateShortLinkResponse>(API_URLS.SHORT_LINK.CREATE, request);
  }


  getOriginalUrl(code: string): Observable<string> {
    return this.http.get<{ originalUrl: string }>(API_URLS.SHORT_LINK.REDIRECT(code))
      .pipe(map(res => res.originalUrl));
  }

  getMyLinks(): Observable<Link[]> {
  return this.http.get<Link[]>(API_URLS.SHORT_LINK.MY_LINKS);
  }

}
