import { Routes } from '@angular/router';
import { VitalsComponent } from './vitals/vitals.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaceSheetComponent } from './face-sheet/face-sheet.component';
import { TableFormExampleComponent } from './table-form-example/table-form-example.component';
import { CardFormExampleComponent } from './card-form-example/card-form-example.component';
import { ResidentComponent } from './resident/resident.component';
import { ResidentFormComponent } from './resident-form/resident-form.component';
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
    path: 'resident/:id',
    component: ResidentComponent,
    data: {
      title: 'Resident Profile',
    },
  },
  {
    path: 'resident',
    component: ResidentComponent,
    data: {
      title: 'Resident Profile',
    },
  },
  {
    path: 'resident-form/:id',
    component: ResidentFormComponent,
    data: {
      title: 'Edit Resident',
    },
  },
  {
    path: 'resident-form',
    component: ResidentFormComponent,
    data: {
      title: 'Add New Resident',
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
    path: 'card-form-example',
    component: CardFormExampleComponent,
    data: {
      title: 'Card Form Example',
    },
  },
];
