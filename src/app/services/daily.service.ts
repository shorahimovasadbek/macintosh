import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { env } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class DailyService {
  constructor(private http: HttpClient) { }
  getDaily(){
    return this.http.get(env.apiUrl + '/api/reports/daily')
  }

  getWeekly(){
    return this.http.get(env.apiUrl + '/api/reports/weekly')
  }

  getMonthly(){
    return this.http.get(env.apiUrl + '/api/reports/monthly')
  }

  getYearly(){
    return this.http.get(env.apiUrl + '/api/reports/yearly')
  }
}
