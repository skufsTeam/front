import { Injectable, inject } from '@angular/core';
import { URL_TOKEN } from '../tokens/url.token';
import { Observable } from 'rxjs';
import { ICompanyV2, ICompanyV2Request } from '../interfaces/company.interface';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RequestCompanyService {

    private _url: string = inject(URL_TOKEN);
    private _httpClient: HttpClient = inject(HttpClient);

    public getCompanyById(id: string): Observable<ICompanyV2Request> {
        return this._httpClient.get<ICompanyV2Request>(`${this._url}/company/${id}`);
    }

    public updateCompany(company: ICompanyV2): Observable<void> {
        return this._httpClient.put<void>(`${this._url}/company`, company);
    }
}
