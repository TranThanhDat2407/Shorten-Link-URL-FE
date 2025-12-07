import {
  ChangeDetectorRef,
  Component,
  inject,
  NgZone,
  OnInit
} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {NgForOf, NgIf, NgOptimizedImage, NgClass} from '@angular/common';
import {HttpParams} from '@angular/common/http';

import {UserService} from '../../../core/services/user';
import {UserResponse} from '../../../common/models/response/user-response';
import {PageResponse} from '../../../common/models/response/page-response';
import {UserRequest} from '../../../common/models/request/user-request';

@Component({
  selector: 'app-users',
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class AdminUsersComponent implements OnInit {

  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  users: UserResponse[] = [];

  isLoading = false;
  page = 0;
  size = 5;
  totalPages = 0;

  // =========== FILTER FORM ===========
  filterForm: FormGroup = this.fb.group({
    email: [''],
    fullName: [''],
    isActive: [''],    // '' = all, 'true', 'false'
    provider: [''],
    totalLink: ['']
  });

  ngOnInit() {
    this.loadUsers(0);
  }

  // =============== LOAD USERS ===============
  loadUsers(page: number) {
    this.isLoading = true;
    this.page = page;
    const val = this.filterForm.value;

    const body: UserRequest = {
      email: val.email?.trim() || null,
      fullName: val.fullName?.trim() || null,
      isActive: val.isActive || null,
      provider: val.provider || null,
      totalLink: val.totalLink || null,
    };

    let params = new HttpParams()
      .set('page', page)
      .set('size', this.size);

    Object.entries(body).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        params = params.set(key, value);
      }
    });

    this.userService.getUsers(params).subscribe({
      next: (res: PageResponse<UserResponse>) => {
        this.zone.run(() => {
          this.users = res.content;
          this.page = page;
          this.totalPages = res.page.totalPages;
          this.size = res.page.size;
          this.isLoading = false;
          this.cdr.detectChanges();
        });

      },
      error: err => {
        console.error(err);
        this.users = [];
        this.totalPages = 0;
        this.isLoading = false;
      }
    });
  }

  // ============= FILTER TRIGGER =============
  onFilter() {
    this.loadUsers(0);
  }


  resetFilters() {
    this.filterForm.reset();
    this.page = 0;
    this.loadUsers(0);
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) return;
    console.log(page)
    this.loadUsers(page);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

}
