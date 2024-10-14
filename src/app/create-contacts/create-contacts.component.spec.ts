import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContactsComponent } from './create-contacts.component';

describe('CreateContactsComponent', () => {
  let component: CreateContactsComponent;
  let fixture: ComponentFixture<CreateContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
