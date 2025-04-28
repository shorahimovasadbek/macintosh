import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CodeInputComponent } from "angular-code-input";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "src/app/services/account.service";
import { AuthService } from "src/app/services/auth.service";
import { env } from "src/environments/environment";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  loginData: any;
  data: any;
  siteUrl: string;
  fileUrl: string;
  loading: boolean;
  seconds: any;
  languages: any;
  confirmCode: boolean;
  langSwitch: boolean;
  show: boolean = false;
  password: any = 'password';
  phone: boolean = true;

  constructor(
    private router: Router,
    private AuthApi: AuthService,
    private AccountApi: AccountService,
    private toastr: ToastrService,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.siteUrl = env.apiUrl;
    this.langSwitch = true;
    this.loginData = { email: '', phone1: '', password: '' };
    this.data = { code: '', resend: false, resend_count: 0 }
  }

  loginAuth() {
    this.loading = true;
    this.AuthApi.sanctum().subscribe((res: any) => { })
    this.AuthApi.login(this.loginData).subscribe((res: any) => {
      if (res) {        
        this.loading = false;
        this.data.email = this.loginData.email;
        this.data.password = this.loginData.password;
        this.data.phone = this.loginData.phone1;
        this.AuthApi.storeTokens(res.token);
        this.verifyPhone();
      }
    },
      error => {
        this.loading = false;
        if (error.error.message)
          this.toastr.error(error.error.message);
      });
  }

  verifyPhone() {
    this.loading = true;
    this.AccountApi.getData().subscribe((res: any) => {
      if (res) {
        localStorage.setItem('user', btoa(encodeURIComponent(JSON.stringify(res.name))))
        this.loading = false;        
        this.router.navigate(['/orders']);
      }
    },
      error => {
        this.loading = false;
        if (error.error && error.error.message)
          this.toastr.error(error.error.message);
      })
  }

  onCodeCompleted(event) {
    this.data.code = event;
  }

  showPassword() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  withPhone() {
    this.phone = !this.phone;
  }

}

@Component({
  selector: 'admin-page-not-found',
  templateUrl: './page-not-found.html',
  styleUrls: []
})
export class PageNotFoundComponent implements OnInit {

  siteUrl: string;

  constructor() { }

  ngOnInit() {
    this.siteUrl = env.apiUrl;
  }

}

@Component({
  selector: 'admin-terms-condition',
  templateUrl: './terms-condition.html',
  styleUrls: []
})
export class TermsConditionComponent implements OnInit {

  siteUrl: string;
  page: any;

  constructor(
    private Account: AccountService,
  ) { }

  ngOnInit() {
    this.siteUrl = env.apiUrl;
    var slug = 'terms-of-conditions';
    this.Account.getPage(slug).subscribe((res: any) => {
      if (res)
        this.page = res.result;
    })
  }

}
