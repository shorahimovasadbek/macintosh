import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, timer, throwError } from "rxjs";
import { env } from "../../environments/environment";
import { map, switchMap, tap, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Ability, PureAbility } from "@casl/ability";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: "root",
})

export class AuthService {
  readonly baseUrl;
  private readonly JWT_TOKEN = "SD";
  private loggedUser: string;
  ability: Ability;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
    this.baseUrl = env.apiUrl;
    this.ability = new PureAbility()
  }

  sanctum() {
    return this.httpClient.get(env.apiUrl + '/sanctum/csrf-cookie')
  }


  login(data): Observable<boolean> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/login`, data).pipe(
      tap((token) => this.storeTokens(token)),
      map((res) => {
        
        localStorage.setItem('permissions', JSON.stringify(res.permissions))
        this.updatePermissions(res.permissions)
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  

  updatePermissions(permissions: any[]): void {
    this.ability.update(permissions);
  }

  getPermissions(): Ability {
    this.updatePermissions(JSON.parse(localStorage.getItem('permissions') || ''));
    return this.ability;
  }

  refreshToken(token: string) {
    return this.httpClient.post(this.baseUrl + '/api/auth/refresh-token', {
      access_token: token
    }, httpOptions);
  }

  isAuthenticated() {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  logout() {
    this.loggedUser = '';
    this.removeTokens();
    this.router.navigate(["/"]);
    this.ability.update([]);
  }

  getToken(): any {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  storeTokens(tokens:any) {
    localStorage.setItem(this.JWT_TOKEN, tokens);
  }

  removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem('permissions')
  }
}
