import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Ability } from "@casl/ability";
import { Admin } from "src/app/role";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './data.html'
})

export class HeaderComponent implements OnInit {
  isAuthenticated: boolean;
  currentUser: any;
  currentUserPer: any;
  siteUrl: string;
  is_access: boolean;
  permissions: Ability;
  is_access__admin: boolean = false;

  constructor(
    private AuthApi: AuthService,
    private router: Router,
    private authServices: AuthService

  ) {
    // if (localStorage.getItem('user'))
    //   this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('user') as any))));
    
    // const adminInstance = new Admin();
    // if (localStorage.getItem('role') === 'SuperAdmin') {
    //   this.is_access = true;
    //   this.is_access__admin = true;
    // }
    router.events.subscribe((e: any) => {
      const navSuccess = e instanceof NavigationEnd;
      if (navSuccess) {
        this.isAuthenticated = this.AuthApi.isAuthenticated();
      }
    })
  }
  ngOnInit() { 
    this.permissions = this.authServices.getPermissions();
  }
}  