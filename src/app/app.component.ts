import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Contacts } from './contact.model';
import { ContactsService } from './contact.service';
import { ToastrService } from 'ngx-toastr';
import { CreateContactsComponent } from './create-contacts/create-contacts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MaterialModule,
    CommonModule,
    CreateContactsComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ContactsApp';
  svc = inject(ContactsService);

  dialog = inject(MatDialog);
  toast = inject(ToastrService);

  public mydata: Contacts[] = [];

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'action',
  ];
  loading = false;

  contactsList: Contacts[] = [];

  list: Contacts[] = [];

  dataSource: any;

  name = 'test';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  editContact(id: number) {
    this.svc.GetContactsById(id).subscribe((res) => {
      this.list.push(res);
    });
  }
  deletePromptPopup(id: number) {
    this.loading = true;
    this.svc.DELETE(id).subscribe((res: any) => {
      this.toast.info('Deleted successfully.', 'Deleted.', {
        timeOut: 3000,
      });
      this.getAll();
      this.list = [];
    });
  }

  filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  ngOnInit(): void {
    this.getAll();
  }
  SendChildToParent(data: any) {
    this.contactsList = data;
    this.getAll();
  }
  getAll() {
    this.loading = true;
    this.svc
      .GetAllContact()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.contactsList = res;
        if (this.contactsList.length > 0) {
          this.dataSource = new MatTableDataSource<Contacts>(this.contactsList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource<Contacts>(this.contactsList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }

  clickedRows(data: any) {
    this.list = data;
    console.log('mycontactslist', this.list);
  }
}
