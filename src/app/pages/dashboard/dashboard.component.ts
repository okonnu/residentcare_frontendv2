import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { AppPaymentsComponent } from '../../components/payments/payments.component';
import { FullComponent } from 'src/app/layouts/full/full.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [MaterialModule, AppPaymentsComponent, FullComponent],
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  constructor() { }

  ngOnInit(): void { }
}
