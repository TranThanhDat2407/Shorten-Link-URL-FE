import {Component, OnInit, PLATFORM_ID, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LinkService} from '../../../core/services/link';

import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../environments/environment';



@Component({
  selector: 'app-redirect',
  imports: [],
  templateUrl: './redirect.html',
  styleUrl: './redirect.scss',
})
export class RedirectComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private linkService: LinkService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const code = this.route.snapshot.paramMap.get('code');
    if (!code) {
      this.router.navigate(['/not-found']);
      return;
    }

    // Backend đã trả 302 → trình duyệt tự redirect
    // Chỉ cần gọi thẳng endpoint redirect!
    window.location.href = `${environment.apiUrl}/short-link/${code}`;
  }

}
