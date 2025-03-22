import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from './local-storage.service';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpRequestsService {

    public hostUrl = environment.API_URL;

    constructor(
        private http: HttpClient,
        private router: Router,
        private toastr: ToastrService,
        private localstorege: LocalStorageService,
    ) { }

    private getHeader(headerOptions: any, doNotSendAuthorizationParam: boolean) {
        const headerParams: any = {};
        if (!doNotSendAuthorizationParam) {
            headerParams['authorization'] = this.localstorege.getLocalStore('atoken');
        }
        if (headerOptions) {
            Object.assign(headerParams, headerOptions);
        }
        const headers = new HttpHeaders(headerParams);
        return { headers };
    }

    post(
        url: string,
        body: any,
        doNotSendAuthorizationParam: boolean = false,
        headerOptions: any = {},
    ) {
        return new Promise((resolve, reject) => {
            const options = this.getHeader(headerOptions, doNotSendAuthorizationParam);
            this.http.post(`${this.hostUrl}${url}`, body, options).subscribe((res) => {
                resolve(res);
            }, (err) => {
                if (!this.handleError(err)) {
                    reject(err);
                }
            });
        });
    }

    uploadWithProgress(
        url: string,
        body: any,
        doNotSendAuthorizationParam: boolean = false,
        headerOptions: any = {},
    ) {

        const options = this.getHeader(headerOptions, doNotSendAuthorizationParam);
        return this.http.post(`${this.hostUrl}${url}`, body, {
            ...options, reportProgress: true,
            observe: 'events'
        })
            .pipe(
                catchError(this.errorMgmt)
            );
    }

    errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }

    get(url: string, params: any = {}, doNotSendAuthorizationParam: boolean = false, headerOptions: any = {}) {
        return new Promise((resolve, reject) => {
            const options = this.getHeader(headerOptions, doNotSendAuthorizationParam) as any;
            options.params = params;
            this.http.get(`${this.hostUrl}${url}`, options).pipe(map((res) => {
                return res;
            }))
                .subscribe((res) => {
                    resolve(res);
                }, (err) => {
                    this.handleError(err);
                    reject(err);
                });
        });
    }

    put(url: any, body: any, headerOptions: any = {}, doNotSendAuthorizationParam: boolean = false) {
        return new Promise((resolve, reject) => {
            const options = this.getHeader(headerOptions, doNotSendAuthorizationParam);
            this.http.put(`${this.hostUrl}${url}`, body, options).pipe(map((res) => {
                return res;
            })).subscribe((res) => {
                resolve(res);
            }, (err) => {
                this.handleError(err);
                reject(err);
            });
        });
    }

    delete(url: string, headerOptions: any = {}, doNotSendAuthorizationParam: boolean = false) {
        return new Promise((resolve, reject) => {
            const options = this.getHeader(headerOptions, doNotSendAuthorizationParam);
            this.http.delete(`${this.hostUrl}${url}`, options).pipe(map((res) => {
                return res;
            })).subscribe((res) => {
                resolve(res);
            }, (err) => {
                this.handleError(err);
                reject(err);
            });
        });
    }

    handleError(err: { error: { error: any; err: any; msg: any; message: any; }; status: number; }) {
        const error = err.error.error || err.error.err || err.error.msg || err.error.message || 'Internal server error!';
        if (err.status === 400) {
            this.toastr.error(error, 'Error');
            return true;
        } else if (err.status === 403) {
            this.toastr.error(error, 'Duplicate data');
            return true;
        } else if (err.status === 404) {
            this.toastr.error(error, 'Error');
            return true;
        } else if (err.status === 401) {
            this.toastr.error(error, 'Error');
            this.router.navigate(['/login']);
            return true;
        } else if (err.status === 500) {
            this.toastr.error(error, 'Error');
            return true;
        } else if (err.status === 504) {
            this.toastr.error(error, 'Error');
            return true;
        } else if (err.status === 0) {
            this.toastr.error('There is no network connection right now. Please try again later.',
                'Error');
            return true;
        } else {
            return false;
        }
    }
}