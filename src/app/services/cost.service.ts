import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { env } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CostService {
  constructor(private http: HttpClient) { }
  
  public getDataItems(data) {
    return this.http.get(env.apiUrl+'/api/costs?page='+data);
  }

  public getDataFilter(data) {
    if(data.from && data.to)
      return this.http.get(env.apiUrl+'/api/filter/costs?date='+data.from + ' - ' + data.to + '&amount='+data.amount+'&name='+data.name+'&type='+data.type);
    else
      return this.http.get(env.apiUrl+'/api/filter/costs?amount='+data.amount+'&name='+data.name+'&type='+data.type);
  }

  public getData(data) {
    return this.http.get(env.apiUrl+'/api/costs/'+data);
  }

  public createData(data) {
    return this.http.post(env.apiUrl+'/api/costs', data);
  }

  public updateData(data) {
    return this.http.put(env.apiUrl+'/api/costs/'+data.id,data);
  }

  public deleteData(data) {
    return this.http.delete(env.apiUrl+'/api/costs/'+data.id);
  }

  getCostsStats(data) {
    if(data && data.report_type === 'month') {
      return this.http.get(env.apiUrl + '/api/dashboard/cost-monthly?date='+data.year + '-' +data.month + '&amount='+data.amount+'&name='+data.name+'&type='+data.type)
    }

    if(data && data.report_type === 'year') {
      return this.http.get(env.apiUrl + '/api/dashboard/cost-yearly?year='+data.year+ '&amount='+data.amount+'&name='+data.name+'&type='+data.type)
    }

    if(data && data.report_type === 'period') {
      return this.http.get(env.apiUrl + '/api/dashboard/cost-interval?date='+data.from + ' - ' + data.to+ '&amount='+data.amount+'&name='+data.name+'&type='+data.type)
    }
    else {
      return of([null])
    }
  }
}