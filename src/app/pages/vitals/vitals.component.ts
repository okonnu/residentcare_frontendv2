import { Component, ViewEncapsulation, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TableFormComponent } from '../../components/table-form/table-form.component';
import { FormField } from 'src/app/models/FormField';
import { Builder } from 'builder-pattern';
import { Vital, VitalsChartOptions } from '../../models/vital.interface';
import { VitalService } from '../../services/vital.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatDialog } from '@angular/material/dialog';
import { AppSearchDialogComponent } from '../../layouts/full/vertical/header/header.component';

@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule, TableFormComponent, NgApexchartsModule],
  styleUrls: ['./vitals.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VitalsComponent implements OnInit {
  private vitalService = inject(VitalService);
  private dialog = inject(MatDialog);

  // Use the service signal directly - no need for computed copies
  vitalsData = this.vitalService.residentVitals;
  isLoading = this.vitalService.isLoading;

  // Check if we have valid vitals data
  hasVitalsData = computed(() => {
    const vitals = this.vitalsData();
    return vitals && vitals.length > 0;
  });

  // Method to open search dialog
  openSearchDialog() {
    const dialogRef = this.dialog.open(AppSearchDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Minimal computed property that formats data for table-form-v2 with proper field mapping
  vitalsTableData = computed(() => {
    const vitals = this.vitalsData();
    if (!vitals || vitals.length === 0) return [];

    return vitals.map((vital: Vital) => ({
      id: vital.id,
      date: vital.audit?.createdDate ? new Date(vital.audit.createdDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: vital.audit?.createdDate ? new Date(vital.audit.createdDate).toLocaleTimeString() : new Date().toLocaleTimeString(),
      temperature: vital.temperature,
      heart_rate: vital.heartRate,
      respiratory_rate: vital.respiratoryRate,
      systolic_bp: vital.systolicBP,
      diastolic_bp: vital.diastolicBP,
      o2_sat: vital.oxygenSaturation,
      weight: vital.weight,
      height: vital.height,
      bmi: vital.bmi,
      pain_score: vital.painScore?.toString() || '',
      blood_glucose_level: vital.bloodGlucoseLevel
    }));
  });

  // Form controls configuration for vitals using Builder pattern with FormField
  vitalsFormControls: FormField[] = [
    Builder(FormField)
      .dataType('date')
      .title('Date')
      .formControl(new FormControl('', [Validators.required]))
      .build(),
    Builder(FormField)
      .dataType('time')
      .title('Time')
      .formControl(new FormControl('', [Validators.required]))
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('Temperature')
      .formControl(new FormControl('', [Validators.required, Validators.min(95), Validators.max(110)]))
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('Heart Rate')
      .formControl(new FormControl('', [Validators.required, Validators.min(40), Validators.max(200)]))
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('Respiratory Rate')
      .formControl(new FormControl('', [Validators.required, Validators.min(8), Validators.max(40)]))
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('Systolic BP')
      .formControl(new FormControl('', [Validators.required, Validators.min(70), Validators.max(250)]))
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('Diastolic BP')
      .formControl(new FormControl('', [Validators.required, Validators.min(40), Validators.max(150)]))
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('O2 Sat')
      .formControl(new FormControl('', [Validators.required, Validators.min(80), Validators.max(100)]))
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('Weight')
      .formControl(new FormControl('', [Validators.min(50), Validators.max(500)]))
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('Height')
      .formControl(new FormControl('', [Validators.min(100), Validators.max(250)]))
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('BMI')
      .formControl(new FormControl('', [Validators.min(10), Validators.max(50)]))
      .build(),
    Builder(FormField)
      .dataType('select')
      .title('Pain Score')
      .formControl(new FormControl(''))
      .dropDownOptions([
        { value: '0', label: '0 - No Pain' },
        { value: '1', label: '1 - Mild' },
        { value: '2', label: '2 - Mild' },
        { value: '3', label: '3 - Moderate' },
        { value: '4', label: '4 - Moderate' },
        { value: '5', label: '5 - Moderate' },
        { value: '6', label: '6 - Severe' },
        { value: '7', label: '7 - Severe' },
        { value: '8', label: '8 - Very Severe' },
        { value: '9', label: '9 - Very Severe' },
        { value: '10', label: '10 - Worst Pain' }
      ])
      .build(),
    Builder(FormField)
      .dataType('number')
      .title('Blood Glucose Level')
      .formControl(new FormControl('', [Validators.min(50), Validators.max(500)]))
      .build()
  ];

  // Chart configurations for vital signs trends - computed from real data
  temperatureChart = computed(() => {
    const vitals = this.vitalsData();
    const temperatureData = vitals.slice(-7).map(v => v.temperature); // Last 7 readings

    return {
      series: [
        {
          name: 'Temperature (°F)',
          data: temperatureData.length > 0 ? temperatureData : [98.6] // Fallback if no data
        }
      ],
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: false }
      },
      xaxis: {
        categories: vitals.slice(-7).map((_, index) => `Day ${index + 1}`)
      },
      yaxis: {
        min: 96,
        max: 102,
        title: { text: 'Temperature (°F)' }
      },
      colors: ['#ff6b6b'],
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: '#e0e6ed' },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + '°F';
          }
        }
      }
    } as VitalsChartOptions;
  });

  heartRateChart = computed(() => {
    const vitals = this.vitalsData();
    const heartRateData = vitals.slice(-7).map(v => v.heartRate); // Last 7 readings

    return {
      series: [
        {
          name: 'Heart Rate (bpm)',
          data: heartRateData.length > 0 ? heartRateData : [72] // Fallback if no data
        }
      ],
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: false }
      },
      xaxis: {
        categories: vitals.slice(-7).map((_, index) => `Day ${index + 1}`)
      },
      yaxis: {
        min: 50,
        max: 150,
        title: { text: 'Heart Rate (bpm)' }
      },
      colors: ['#4ecdc4'],
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: '#e0e6ed' },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + ' bpm';
          }
        }
      }
    } as VitalsChartOptions;
  });

  bloodPressureChart = computed(() => {
    const vitals = this.vitalsData();
    const systolicData = vitals.slice(-7).map(v => v.systolicBP); // Last 7 readings
    const diastolicData = vitals.slice(-7).map(v => v.diastolicBP); // Last 7 readings

    return {
      series: [
        {
          name: 'Systolic',
          data: systolicData.length > 0 ? systolicData : [120] // Fallback if no data
        },
        {
          name: 'Diastolic',
          data: diastolicData.length > 0 ? diastolicData : [80] // Fallback if no data
        }
      ],
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: false }
      },
      xaxis: {
        categories: vitals.slice(-7).map((_, index) => `Day ${index + 1}`)
      },
      yaxis: {
        min: 60,
        max: 160,
        title: { text: 'Blood Pressure (mmHg)' }
      },
      colors: ['#45b7d1', '#96ceb4'],
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      legend: { show: true, position: 'top' },
      grid: { borderColor: '#e0e6ed' },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + ' mmHg';
          }
        }
      }
    } as VitalsChartOptions;
  });

  oxygenSaturationChart = computed(() => {
    const vitals = this.vitalsData();
    const oxygenData = vitals.slice(-7).map(v => v.oxygenSaturation); // Last 7 readings

    return {
      series: [
        {
          name: 'O2 Saturation (%)',
          data: oxygenData.length > 0 ? oxygenData : [98] // Fallback if no data
        }
      ],
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: false }
      },
      xaxis: {
        categories: vitals.slice(-7).map((_, index) => `Day ${index + 1}`)
      },
      yaxis: {
        min: 90,
        max: 100,
        title: { text: 'O2 Saturation (%)' }
      },
      colors: ['#a8e6cf'],
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      legend: { show: false },
      grid: { borderColor: '#e0e6ed' },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + '%';
          }
        }
      }
    } as VitalsChartOptions;
  });

  // Current values computed from latest data for card display
  currentVitals = computed(() => {
    const vitals = this.vitalsData();
    if (!vitals || vitals.length === 0) {
      return {
        temperature: 0,
        heartRate: 0,
        bloodPressure: '0/0',
        oxygenSaturation: 0
      };
    }

    const latest = vitals[vitals.length - 1]; // Get the most recent reading
    return {
      temperature: latest.temperature,
      heartRate: latest.heartRate,
      bloodPressure: `${latest.systolicBP}/${latest.diastolicBP}`,
      oxygenSaturation: latest.oxygenSaturation
    };
  });

  ngOnInit() {
    // Load vitals data from service on component initialization
    this.vitalService.getResidentVitals();
  }

  // Event handlers for table-form
  handleVitalsSave(data: any) {
    console.log('Vitals save data received:', data);

    if (!data) {
      console.error('No data provided to save');
      return;
    }

    // Extract form data and create Vitals object with proper field mapping
    const vital: Vital = {
      id: data.id || '', // Empty string for new records
      residentId: this.vitalService.residentId,
      temperature: parseFloat(data.temperature) || 0,
      heartRate: parseInt(data.heart_rate) || 0,
      respiratoryRate: parseInt(data.respiratory_rate) || 0,
      systolicBP: parseInt(data.systolic_bp) || 0,
      diastolicBP: parseInt(data.diastolic_bp) || 0,
      oxygenSaturation: parseFloat(data.o2_sat) || 0,
      weight: parseFloat(data.weight) || 0,
      height: parseFloat(data.height) || 0,
      bmi: parseFloat(data.bmi) || 0,
      painScore: parseInt(data.pain_score) || 0,
      bloodGlucoseLevel: parseFloat(data.blood_glucose_level) || 0,
      recordedAt: data.date ? new Date(`${data.date}T${data.time}`) : new Date(),
      audit: null, // Will be set by the backend
    };

    // Validate required fields
    if (vital.temperature <= 0 && vital.heartRate <= 0 && vital.respiratoryRate <= 0 &&
      vital.systolicBP <= 0 && vital.diastolicBP <= 0 && vital.oxygenSaturation <= 0) {
      console.error('At least one vital sign measurement is required');
      return;
    }

    console.log('Saving vital:', vital);
    this.vitalService.createResidentVital(vital);
  }

  handleVitalsDelete(id: any) {
    console.log('Vitals delete requested for ID:', id);

    if (!id) {
      console.error('No ID provided for deletion');
      return;
    }

    // Convert id to string if it's not already
    const vitalId = typeof id === 'string' ? id : String(id);

    // Call the delete method from the service
    this.vitalService.deleteResidentVital(vitalId);
  }

  handleVitalsView(data: any) {
    console.log('Vitals viewed:', data);
    // Implement view logic here
  }

  handleCancel() {
    console.log('Operation cancelled');
  }
}
