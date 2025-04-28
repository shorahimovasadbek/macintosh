import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { env } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ClientsService {
  constructor(private http: HttpClient) { }
  
  public getDataItems() {
    return this.http.get(env.apiUrl+'/api/clients');
  }

  getDataFilter(data: any) {
    return this.http.get(env.apiUrl + '/api/filter/clients?id=' + data.id + '&passport=' + data.passport + '&phone=' + data.phone + '&passport_status=' + data.passport_status);
  }

  public getData(id) {
    return this.http.get(env.apiUrl+'/api/clients/'+id);
  }
  
  public updateData(id,data) {
    return this.http.post(env.apiUrl+'/api/updateClient/'+id, data);
  }
  
  public createData(data) {
    return this.http.post(env.apiUrl+'/api/clients', data);
  }       
  
  public deleteData(data) {
    return this.http.delete(env.apiUrl+'/api/clients/'+data.id);
  }

}