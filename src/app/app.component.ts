import { Component } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gamestudio-refactor';

  loading: boolean = false;
  loadingModuleName: string = '';

  constructor(private loadingService: LoadingService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.start();
        const gameName = event.url.split('/')[1];
        this.loadingModuleName = gameName;
      } else if (event instanceof NavigationEnd) {
        this.loadingService.stop();
      }
      // Consider adding NavigationCancel and NavigationError to handle cancel/error situations
    });
    this.loadingService.loading$.subscribe((loading: boolean) => {
      this.loading = loading;
    });
  }

}
