import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { VitalsComponent } from './vitals/vitals.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaceSheetComponent } from './face-sheet/face-sheet.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter Page',
    },
  },
  {
    path: 'vitals',
    component: VitalsComponent,
    data: {
      title: 'Vitals Page',
    },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
    },
  },
  {
    path: 'face-sheet',
    component: FaceSheetComponent,
    data: {
      title: 'Resident Face Sheet',
    },
  },
];
