import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class EmployeeService {
  constructor(private http: HttpClient) { }

  getDataItems(data: any) {
    return this.http.get(env.apiUrl+'/api/admins?page='+data);
  }
  
  getDataFilter(data: any) {
    return this.http.get(env.apiUrl + '/api/filter/admins?id=' + data.id + '&passport=' + data.passport + '&phone=' + data.phone);
  }

  getData(id: any) {
    return this.http.get(env.apiUrl+'/api/admins/'+id);
  }

  createData(data:any) {    
    return this.http.post(env.apiUrl+'/api/admins', data);
  }

  updateData(data:any) {
    return this.http.put(env.apiUrl+'/api/admins/'+data.id, data);
  }

  deleteData(data:any) {
    return this.http.delete(env.apiUrl+'/api/admins/'+data.id);
  }
}  