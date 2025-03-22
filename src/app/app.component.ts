import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public isLoggin = false;
  private currentRoute!: string;
  public message: any;
  private routeArray = ['/', '/login', '/auth/login', '/auth/forgot-password', '/forgot-password'];

  constructor(
    private route: Router,
  ) {
    route.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((val: any) => {
      this.currentRoute = val['url'];
      const isReuirerRoute = this.routeArray.filter((routes) => {
        return routes === this.currentRoute;
      });
      if (isReuirerRoute.length) {
        this.isLoggin = false;
      } else {
        this.isLoggin = true;
      }
    });
  }

}
