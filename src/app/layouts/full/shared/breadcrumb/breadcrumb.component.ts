import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule, NgIf, TablerIconsModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: [],
})
export class AppBreadcrumbComponent implements OnInit {
  // @Input() layout;
  pageInfo: Data | any = Object.create(null);
  myurl: any = this.router.url.slice(1).split('/');

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter((route) => route.outlet === 'primary'))
      .pipe(mergeMap((route) => route.data))
      // tslint:disable-next-line - Disables all
      .subscribe((event) => {
        // tslint:disable-next-line - Disables all
        console.log('Breadcrumb route data:', event);
        this.titleService.setTitle(event['title'] ? event['title'] + ' - ResidentCare' : 'ResidentCare');
        this.pageInfo = event;
      });
  }

  ngOnInit(): void {
    // Initial load - get the current route data
    this.updateBreadcrumb();
  }

  private updateBreadcrumb(): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.snapshot.data) {
      console.log('Initial breadcrumb data:', route.snapshot.data);
      this.pageInfo = route.snapshot.data;
      this.titleService.setTitle(
        this.pageInfo['title'] ? this.pageInfo['title'] + ' - ResidentCare' : 'ResidentCare'
      );
    }
  }
}
