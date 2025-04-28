import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor (
    private http: HttpClient
  ) {}

  public downloadFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  public deleteFile(data):any {
    return this.http.put(env.apiUrl+'/files/'+data.id, data);
  }

}  