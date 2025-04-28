import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InvestService {
  constructor(private http: HttpClient) { }
  
  public getDataItems(data) {
    return this.http.get(env.apiUrl+'/api/investors?page='+data);
  }

  public getDataFilter(data) {
    return this.http.get(env.apiUrl+'/api/filter/investors?id='+data.id+ '&name='+data.name+'&passport='+data.passport+'&phone='+data.phone+'&percentage='+data.percentage);
  }

  public getData(id) {
    return this.http.get(env.apiUrl+'/api/investors/'+id);
  }
  
  public updateData(data) {
    return this.http.put(env.apiUrl+'/api/investors/'+data.id, data);
  }
  
  public createData(data) {
    return this.http.post(env.apiUrl+'/api/investors', data);
  }       
  
  public deleteData(data) {
    return this.http.delete(env.apiUrl+'/api/investors/'+data.id);
  }

  public deleteDataInvestments(data) {
    return this.http.delete(env.apiUrl+'api/investments/'+data.id);
  }


  public investorSalaryUpdate(data) {
    return this.http.post(env.apiUrl+'/api/investorSalaryUpdate/'+data.id, {status: Number(data.status)});
  }

  public getInvestmentsItems(data) {
    return this.http.get(env.apiUrl+'/api/investments?page='+data);
  }

  public getInvestment(id) {
    return this.http.get(env.apiUrl+'/api/investments/'+id);
  }
  
  public updateInvestment(data) {
    return this.http.put(env.apiUrl+'/api/investments/'+data.id, data);
  }
  
  public createInvestment(data) {
    return this.http.post(env.apiUrl+'/api/investments', data);
  }       
  
  public deleteInvestment(data) {
    return this.http.delete(env.apiUrl+'/api/investments/'+data.id);
  }
  
}
