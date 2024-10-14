import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Contacts } from './contact.model';


@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private readonly baseUrl = 'https://localhost:7177/api/Contact/';
  constructor() {}

  http = inject(HttpClient);

  GetAllContact() {
    return this.http.get(`${this.baseUrl}getall`);
  }

  GetContactsById(id: number) {
    return this.http.get(`${this.baseUrl}${id}`);
  }
  Post(contacts: Contacts) {
    return this.http.post(`${this.baseUrl}Create`, contacts);
  }
  PUT(id: number, contacts: Contacts) {
    return this.http.put(`${this.baseUrl}${id}`, contacts);
  }

  DELETE(id: number) {
    return this.http.delete(`${this.baseUrl}${id}`);
  }
}
