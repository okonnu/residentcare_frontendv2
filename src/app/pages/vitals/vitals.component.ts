import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-vitals',  
  templateUrl: './vitals.component.html',
  standalone: true,
  imports: [MaterialModule],
  styleUrls: ['./vitals.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VitalsComponent {}
