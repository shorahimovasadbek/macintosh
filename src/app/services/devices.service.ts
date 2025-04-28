import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DevicesService {
  constructor(private http: HttpClient) { }

  getDataItems() {
    return this.http.get(env.apiUrl + '/api/devices');
  }

  getDataItemsAccess() {
    return this.http.get(env.apiUrl + '/api/accessories');
  }

  getDataFilter(data: any) {
    return this.http.get(env.apiUrl + '/api/filter/devices?status=' + data.status + '&provider=' + data.provider + '&imei='+ data.imei);
  }

  getDataFilterAccess(data: any) {
    return this.http.get(env.apiUrl + '/api/filter/accessories?status=' + data.status + '&provider=' + data.provider + '&seria_number='+ data.seria_number);
  }

  getData(id: any) {
    return this.http.get(env.apiUrl + '/api/devices/' + id);
  }

  
  getDataAccess(id: any) {
    return this.http.get(env.apiUrl + '/api/accessories/' + id);
  }

  createData(data) {
    return this.http.post(env.apiUrl + '/api/devices', data);
  }

  createDataAccess(data) {
    return this.http.post(env.apiUrl + '/api/accessories', data);
  }

  updateData(data) {
    return this.http.put(env.apiUrl + '/api/devices/' + data.id, data);
  }

  updateDataAccess(data) {
    return this.http.put(env.apiUrl + '/api/accessories/' + data.id, data);
  }

  deleteData(data) {
    return this.http.delete(env.apiUrl + '/api/devices/' + data.id);
  }

  deleteDataAccess(data) {
    return this.http.delete(env.apiUrl + '/api/accessories/' + data.id);
  }
}  