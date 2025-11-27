import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-google-success',
  imports: [],
  templateUrl: './google-success.html',
  styleUrl: './google-success.scss',
})
export class GoogleSuccessComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const dataParam = this.route.snapshot.queryParamMap.get('data');

    if (dataParam) {
      try {
        const user = JSON.parse(decodeURIComponent(dataParam));

        // ĐỢI cho Promise hoàn thành
        await this.authService.setCurrentUser(user);

        // Chỉ chuyển hướng sau khi Promise/Lưu trữ đã hoàn tất.
        await this.router.navigate(['/']);
        return;
      } catch (e) {
        // await this.router.navigate(['/login']);
      }
    }

  }
}
