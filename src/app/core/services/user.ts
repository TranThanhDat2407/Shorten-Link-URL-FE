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
import {UserRequest} from '../../common/models/request/user-request';
import {UserResponse} from '../../common/models/response/user-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(params: HttpParams): Observable<PageResponse<UserResponse>> {
    return this.http.get<PageResponse<UserResponse>>(
      API_URLS.ADMIN.GET_USERS,
      { params }
    );
  }


}
