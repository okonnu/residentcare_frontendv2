import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableFormComponent, TableColumn } from '../../components/table-form/table-form.component';
import { VitalService } from '../../services/vital.service';
import { Vital } from '../../models/vital.interface';

@Component({
    selector: 'app-vitals-table-example',
    standalone: true,
    imports: [
        CommonModule,
        TableFormComponent,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ],
    template: `
    <div class="container-fluid">
      <table-form
            [title]="'Vital Signs'"
            [subtitle]="'Click on a record to edit'"
            [dataSet]="vitals"
            [columns]="columns"
            [idField]="'id'"
            (add)="handleAdd()"
            (edit)="handleEdit($event)"
            (delete)="handleDelete($event)"
            (save)="handleSave($event)">
          </table-form>
    </div>
  `
})
export class VitalsTableExampleComponent implements OnInit {
    private vitalService = inject(VitalService);
    private snackBar = inject(MatSnackBar);

    // Vitals data from service
    get vitals(): Vital[] {
        return this.vitalService.residentVitals();
    }

    // Column definitions for vital signs
    columns: TableColumn[] = [
        { key: 'id', title: 'ID', dataType: 'text', sortable: false, hide: true },
        { key: 'temperature', title: 'Temp (°F)', dataType: 'number', sortable: true },
        { key: 'heartRate', title: 'HR (bpm)', dataType: 'number', sortable: true },
        { key: 'respiratoryRate', title: 'RR (brpm)', dataType: 'number', sortable: true },
        {
            key: 'bloodPressure',
            title: 'BP (mmHg)',
            dataType: 'custom',
            sortable: false,
            displayFn: (item: Vital) => `${item.systolicBP}/${item.diastolicBP}`
        },
        { key: 'systolicBP', title: 'Systolic', dataType: 'number', sortable: true, hide: true },
        { key: 'diastolicBP', title: 'Diastolic', dataType: 'number', sortable: true, hide: true },
        { key: 'oxygenSaturation', title: 'O2 Sat (%)', dataType: 'number', sortable: true },
        { key: 'weight', title: 'Weight (lbs)', dataType: 'number', sortable: true },
        { key: 'height', title: 'Height (cm)', dataType: 'number', sortable: true },
        { key: 'bmi', title: 'BMI', dataType: 'number', sortable: true },
        { key: 'painScore', title: 'Pain (0-10)', dataType: 'number', sortable: true },
        { key: 'bloodGlucoseLevel', title: 'Glucose (mg/dL)', dataType: 'number', sortable: true }
    ];

    ngOnInit(): void {
        // Fetch vitals data when component initializes
        this.vitalService.getResidentVitals();
    }

    handleAdd() {
        // Create a new vital record with default values
        const newVital: Partial<Vital> = {
            temperature: 98.6,
            heartRate: 75,
            respiratoryRate: 16,
            systolicBP: 120,
            diastolicBP: 80,
            oxygenSaturation: 98,
            weight: 150,
            height: 170,
            bmi: 25,
            painScore: 0,
            bloodGlucoseLevel: 100,
            residentId: '123' // This would normally come from the resident service
        };

        this.vitalService.createResidentVital(newVital as Vital);
    }

    handleEdit(vital: Vital) {
        // For external editing if needed
        console.log('Edit vital record', vital);
    }

    handleDelete(vital: Vital) {
        // Delete record through service
        this.vitalService.deleteResidentVital(vital.id);
    }

    handleSave(vital: Vital) {
        // Update record through service
        this.vitalService.updateResidentVital(vital);
    }
}
