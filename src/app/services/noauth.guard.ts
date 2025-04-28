import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NoAuthGuard implements CanActivate {
  constructor(
    private AuthApi: AuthService,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.AuthApi.isAuthenticated()) {
        return true;
      }
      this.router.navigate(['/orders'], { queryParams: next.queryParams });
      return false;
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   if (!this.AuthApi.isAuthenticated()) {
  //     this.router.navigate([''], { queryParams: { returnUrl: state.url } });
  //     return false;
  //   }
  //   return true;
  // }

}
