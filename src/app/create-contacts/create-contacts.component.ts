import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MaterialModule } from '../material.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Contacts } from '../contact.model';
import { ContactsService } from '../contact.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-contacts',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-contacts.component.html',
  styleUrl: './create-contacts.component.scss',
})
export class CreateContactsComponent implements OnInit {
  @Output() SendChildToParent: EventEmitter<any> = new EventEmitter();

  @Input() contactsList: any;
  //@Input() myContactsList: any;

  isBool = false;

  title = 'Create Contact';

  loading = false;

  ids: any;

  fb: any = inject(FormBuilder);

  svc = inject(ContactsService);
  toast = inject(ToastrService);
  forms: any = FormGroup;

  postContacts!: Contacts;
  postContacts1!: Contacts;

  getContacts: Contacts[] = [];

  get getfirstName() {
    return this.forms.controls['firstname'];
  }

  get getlastName() {
    return this.forms.controls['lastname'];
  }

  get getemail() {
    return this.forms.controls['email'];
  }

  createForm() {
    this.forms = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(15)]],

      lastname: ['', [Validators.required, Validators.maxLength(15)]],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.forms.valid) {
      this.postContacts = {
        firstname: this.forms.value.firstname,
        lastname: this.forms.value.lastname,
        email: this.forms.value.email,
        id: this.contactsList.id ? this.contactsList.id : 0,
      };

      if (this.contactsList.id > 0) {
        forkJoin({
          postData: this.svc.PUT(this.contactsList.id, this.postContacts),
          getData: this.svc.GetAllContact(),
        }).subscribe((res: any) => {
          if (res) {
            this.SendChildToParent.emit(res.getData);
            this.forms.reset();
            this.contactsList.id = 0;
            this.toast.success(res.postData.message, 'Updated.', {
              timeOut: 3000,
            });
          } else {
            this.toast.error(res.postData.message, 'Error.', {
              timeOut: 3000,
            });
          }
        });
      } else {
        forkJoin({
          postData: this.svc.Post(this.postContacts),
          getData: this.svc.GetAllContact(),
        }).subscribe((res: any) => {
          if (res) {
            this.SendChildToParent.emit(res.getData);
            this.forms.reset();
            this.contactsList.id = 0;
            this.toast.success(res.postData.message, 'Saved.', {
              timeOut: 3000,
            });
          } else {
            this.toast.error(res.postData.message, 'Error.', {
              timeOut: 3000,
            });
          }
        });
      }
    }
  }

  ngOnInit(): void {
    this.createForm();
  }
  test() {}

  reset() {
    this.forms.reset();
    // this.forms.get('firstname').setValidators(null);
    // this.forms.get('firstname').setErrors(null);

    // this.forms.get('lastname').setValidators(null);
    // this.forms.get('lastname').setErrors(null);

    // this.forms.get('email').setValidators(null);
    // this.forms.get('email').setErrors(null);
    this.contactsList.id = 0;
    this.SendChildToParent.emit(this.svc.GetAllContact());
  }
}
