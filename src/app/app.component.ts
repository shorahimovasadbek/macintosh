import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from './services/account.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  currentUser: any;
  isAuthenticated = false;
  sidebarToggle: boolean;
  settingsModal: boolean;
  isMobile: boolean;
  loading: boolean;
  data: any;

  constructor(
    private AuthApi: AuthService,
    private AccountApi: AccountService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.data = { password: '', current_password: '' };
    router.events.subscribe((e: any) => {
      const navSuccess = e instanceof NavigationEnd;
      if (navSuccess) {
        if (localStorage.getItem('user')) this.currentUser = JSON.parse(decodeURIComponent(atob(localStorage.getItem('user') as any)));
        
        if (!this.sidebarToggle)
          this.toogleMenu()
        this.isAuthenticated = this.AuthApi.isAuthenticated();

        if (e.url != '/' && e.url != '/terms-of-condition' && !localStorage.getItem('SD'))
          this.onLogout();
      }
    })
  }

  toogleMenu() {
    let body = document.getElementsByTagName('body')[0];
    this.sidebarToggle = !this.sidebarToggle;
    if (this.sidebarToggle)
      body.classList.add('enlarge-menu');
    if (!this.sidebarToggle)
      body.classList.remove('enlarge-menu');
  }

  onLogout() {
    localStorage.removeItem('SD');
    localStorage.removeItem('user');
    this.toastr.success('Siz tizimdan chiqdingiz.');
    this.AuthApi.logout();
  }

  onResize(event) {
    var width = event.target.innerWidth;
    if (width < 600) {
      this.isMobile = true
      this.sidebarToggle = false
    }
  }

  profileSettings() {
    this.settingsModal = true;
  }

  changeSettings(data) {
    this.AccountApi.changePassword(data.value).subscribe((res: any) => {
      if (res && res.status === true) {
        this.closeAlerPopup();
        this.toastr.success("Parol muvaffaqiyatli o'zgartirildi");
        this.data = { current_password: '', password: '' };
      }
    }, error => {
      this.toastr.error(error.message);
    })
  }

  closeAlerPopup() {
    this.settingsModal = false;
  }
}
