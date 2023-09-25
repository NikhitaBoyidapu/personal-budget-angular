// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class DataService {

//   constructor() { }
// }

// data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isEmpty(): boolean {
    return !this.data || this.data.datasets[0].data.length === 0;
  }
  private data: any = null;

  constructor(private http: HttpClient) {}

  // Function to fetch data from the backend
  fetchData(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/budget');
  }

  // Function to set the fetched data
  setData(data: any): void {
    this.data = data;
  }

  // Function to get the data
  getData(): any {
    return this.data;
  }

}
