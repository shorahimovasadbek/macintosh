import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Ability } from "@casl/ability";
import { AbilityService } from "@casl/angular";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { DailyService } from "src/app/services/daily.service";
import { AuthService } from "src/app/services/auth.service";


@Component({
  selector: 'daily',
  templateUrl: './daily.html',
  styleUrls: []
})
export class DailyComponent implements OnInit {
  permissions: Ability;
  loading: boolean;
  data: any;


  constructor(
    private DataApi: DailyService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authServices: AuthService
  ) {
  }

  ngOnInit() {
    this.permissions = this.authServices.getPermissions();
    this.getData()
    this.getDataMonthly()
    this.getDataWeek()
    this.getDataYearly()
  }

  getData(){
    this.loading = true;
    this.spinner.show();
    this.DataApi.getDaily().subscribe((res: any) => {
      if (res) {
        console.log(res, 'bu daily royxat...');
        this.spinner.hide();
        this.data = res.data;
        this.loading = false;
      }
    }, error => {
      this.spinner.hide()
      this.toastr.error(error.message);
      this.loading = false;
    }
    )
  }

  getDataWeek(){
    this.loading = true;
    this.spinner.show();
    this.DataApi.getWeekly().subscribe((res: any) => {
      if (res) {
        console.log(res, 'bu weekly royxat...');
        this.spinner.hide();
        this.data = res.data;
        this.loading = false;
      }
    }, error => {
      this.spinner.hide()
      this.toastr.error(error.message);
      this.loading = false;
    }
    )
  }

  getDataMonthly(){
    this.loading = true;
    this.spinner.show();
    this.DataApi.getMonthly().subscribe((res: any) => {
      if (res) {
        console.log(res, 'bu monthtly royxat...');
        this.spinner.hide();
        this.data = res.data;
        this.loading = false;
      }
    }, error => {
      this.spinner.hide()
      this.toastr.error(error.message);
      this.loading = false;
    }
    )
  }

  getDataYearly(){
    this.loading = true;
    this.spinner.show();
    this.DataApi.getYearly().subscribe((res: any) => {
      if (res) {
        console.log(res, 'bu yearly royxat...');
        this.spinner.hide();
        this.data = res.data;
        this.loading = false;
      }
    }, error => {
      this.spinner.hide()
      this.toastr.error(error.message);
      this.loading = false;
    }
    )
  }

}
