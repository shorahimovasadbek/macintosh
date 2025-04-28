import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { env } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class DashboardService {
  constructor(private http: HttpClient) { }
  
  getBalance() {
    return this.http.get(env.apiUrl + "/api/dashboard/balance")
  }

   getIntervalDateDevices(data){

    if(data && data.report_type === 'month') {
      return this.http.get(env.apiUrl + '/api/dashboard/cash-report-monthly?date='+data.year + '-' +data.month + '&type=device')
    }

    if(data && data.report_type === 'year') {
      return this.http.get(env.apiUrl + '/api/dashboard/cash-report-yearly?year='+data.year + '&type=device')
    }

    if(data && data.report_type === 'period') {
      return this.http.get(env.apiUrl + '/api/dashboard/cash-report-interval?date='+data.from + ' - ' + data.to + '&type=device')
    }
    else {
      return of([null])
    }
  }

  getIntervalDate(data){

    if(data && data.report_type === 'month') {
      return this.http.get(env.apiUrl + '/api/dashboard/cash-report-monthly?date='+data.year + '-' +data.month + '&type=accessory')
    }

    if(data && data.report_type === 'year') {
      return this.http.get(env.apiUrl + '/api/dashboard/cash-report-yearly?year='+data.year + '&type=accessory')
    }

    if(data && data.report_type === 'period') {
      return this.http.get(env.apiUrl + '/api/dashboard/cash-report-interval?date='+data.from + ' - ' + data.to + '&type=accessory')
    }
    else {
      return of([null])
    }
  }

  getExpense(data) {
    if(data && data.report_type === 'all') {
      return this.http.get(env.apiUrl + '/api/dashboard/expense')
    }

    if(data && data.report_type === 'month') {
      return this.http.get(env.apiUrl + '/api/dashboard/expense-monthly?date='+data.year + '-' +data.month)
    }

    if(data && data.report_type === 'year') {
      return this.http.get(env.apiUrl + '/api/dashboard/expense-yearly?year='+data.year)
    }

    if(data && data.report_type === 'period') {
      return this.http.get(env.apiUrl + '/api/dashboard/expense-interval?date='+data.from + ' - ' + data.to)
    }
    else {
      return of([null])
    }  }

  getReport(data) {
    if(data && data.report_type === 'all') {
      return this.http.get(env.apiUrl + '/api/dashboard/report')
    }

    if(data && data.report_type === 'month') {
      return this.http.get(env.apiUrl + '/api/dashboard/report-monthly?date='+data.year + '-' +data.month)
    }

    if(data && data.report_type === 'year') {
      return this.http.get(env.apiUrl + '/api/dashboard/report-yearly?year='+data.year)
    }

    if(data && data.report_type === 'period') {
      return this.http.get(env.apiUrl + '/api/dashboard/report-interval?date='+data.from + ' - ' + data.to)
    }
    else {
      return of([null])
    }
  }

}  