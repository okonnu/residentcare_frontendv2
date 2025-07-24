import { Routes } from '@angular/router';
import { VitalsComponent } from './vitals/vitals.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaceSheetComponent } from './face-sheet/face-sheet.component';
import { TableFormExampleComponent } from './table-form-example/table-form-example.component';
import { VitalsTableExampleComponent } from './vitals-table-example/vitals-table-example.component';
import { CardFormExampleComponent } from './card-form-example/card-form-example.component';
export const PagesRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
    },
  },
  {
    path: 'vitals',
    component: VitalsComponent,
    data: {
      title: 'Vitals',
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
  {
    path: 'table-form-example',
    component: TableFormExampleComponent,
    data: {
      title: 'Table Form Example',
    },
  },
  {
    path: 'vitals-table-example',
    component: VitalsTableExampleComponent,
    data: {
      title: 'Vitals Table Example',
    },
  },
  {
    path: 'card-form-example',
    component: CardFormExampleComponent,
    data: {
      title: 'Card Form Example',
    },
  },
];
