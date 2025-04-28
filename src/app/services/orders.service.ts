import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private http: HttpClient) { }

  public getDataItems(page) {
    return this.http.get(env.apiUrl + '/api/orders/all-orders?page=' + page);
  }

  getDataFilter(data: any) {
    if (!data.client)
      return this.http.get(env.apiUrl + '/api/orders/filter?NumberOrder=' + data.id + '&status=' + data.status + '&client=' + '&device=' + data.device + '&pay_type=' + data.pay_type + '&imei=' + data.imei);
    else
      return this.http.get(env.apiUrl + '/api/orders/filter?NumberOrder=' + data.id + '&status=' + data.status + '&client_id=' + data.client.id + '&device=' + data.device + '&pay_type=' + data.pay_type + '&imei=' + data.imei);
  }

  getDataSearch(data: any) {
    return this.http.get(env.apiUrl + '/api/filter/clients?client=' + data);
  }

  public getData(id) {
    return this.http.get(env.apiUrl + '/api/orders/show-order/' + id);
  }

  public updateData(data) {
    return this.http.put(env.apiUrl + '/api/orders/order-detail-update/' + data.id, data);
  }

  public createData(data) {
    return this.http.post(env.apiUrl + '/api/orders/create-order', data);
  }

  public deleteData(data) {
    return this.http.delete(env.apiUrl + '/api/orders/' + data.order.id);
  }

  public createPayment(id, data) {
    return this.http.post(env.apiUrl + '/api/orders/payment/' + id, data);
  }

  public monthlyComment(id, data) {
    return this.http.put(env.apiUrl + '/api/orders/update-monthly/' + id, data);
  }

  public closeOrder(data) {
    return this.http.put(env.apiUrl + '/api/orders/update-order/' + data.id, data)
  }

  public notes() {
    return this.http.get(env.apiUrl + '/api/orders/notes');
  }

  public deletePayment(data) {
    return this.http.delete(env.apiUrl + '/api/orders/payment-delete/'+data.id);
  }
}  