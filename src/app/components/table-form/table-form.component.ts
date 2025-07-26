import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputComponent } from '../form-input/form-input.component';

// Interface to define column configuration
export interface TableColumn {
    key: string;       // Property name in data object
    title: string;     // Display name for column header
    dataType: string;  // Data type (text, number, date, select, etc.)
    sortable?: boolean; // Whether column is sortable
    hidden?: boolean;   // Whether to hide column from display
    hide?: boolean;     // Alternative to hidden, for backward compatibility
    options?: Array<{ value: string, label: string }>; // For dropdowns and radio buttons
    width?: string;     // Optional width (e.g., '100px', '10%')
    displayFn?: (item: any) => string; // Function to format display value
    required?: boolean; // Whether field is required
    validators?: any[]; // Custom validators for the field
}

@Component({
    selector: 'table-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        TablerIconsModule,
        NgxMaskDirective,
        InputComponent
    ],
    templateUrl: './table-form.component.html',
    styleUrls: ['./table-form.component.scss'],
    providers: [
        provideNgxMask()
    ]
})
export class TableFormComponent implements OnInit, AfterViewInit {
    @Input() title: string = 'Records';
    @Input() subtitle: string = '';
    @Input()
    set dataSet(value: any[]) {
        if (value) {
            this._dataSet = value;
            this.dataSource.data = value;
            console.log('Data set updated:', value.length);
        }
    }
    get dataSet(): any[] {
        return this._dataSet;
    }

    @Input() columns: TableColumn[] = [];
    @Input() idField: string = 'id';
    @Input() showAddButton: boolean = true;
    @Input() showEditButton: boolean = true;
    @Input() showDeleteButton: boolean = true;
    @Input() showViewButton: boolean = true;

    @Output() add = new EventEmitter<void>();
    @Output() edit = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();
    @Output() view = new EventEmitter<any>();
    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource = new MatTableDataSource<any>([]);
    displayedColumns: string[] = [];
    currentMode: 'view' | 'edit' | 'add' = 'view';
    selectedRecord: any = null;
    originalRecordData: any = null;
    recordForm!: FormGroup;
    private _dataSet: any[] = [];
    private _snackbar = inject(MatSnackBar);
    private formBuilder = inject(FormBuilder);

    constructor() {
        // Initialize with empty array
        this.dataSource = new MatTableDataSource<any>([]);
    }

    ngOnInit() {
        // Initialize data
        if (this._dataSet && this._dataSet.length > 0) {
            this.dataSource.data = this._dataSet;
            console.log('Data source initialized with', this._dataSet.length, 'records');
        }

        // Prepare displayed columns (excluding hidden ones)
        this.displayedColumns = this.columns
            .filter(column => !column.hidden && !column.hide)
            .map(column => column.key);

        // Add actions column if any action button is visible
        if (this.showEditButton || this.showDeleteButton || this.showViewButton) {
            this.displayedColumns.push('actions');
        }

        // Log for debugging
        console.log('Initialized TableForm:', {
            columns: this.columns,
            displayedColumns: this.displayedColumns,
            dataLength: this.dataSource.data.length,
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // Switch to view mode (table display)
    switchToViewMode() {
        this.currentMode = 'view';
        this.selectedRecord = null;
        this.originalRecordData = null;
    }

    // Start editing a specific record
    startEdit(row: any) {
        this.selectedRecord = { ...row }; // Clone the record
        this.originalRecordData = { ...row }; // Store original for cancellation
        this.currentMode = 'edit';
        this.createForm(); // Create form with record data
    }

    // Start adding a new record
    startAdd() {
        this.selectedRecord = this.createBlankRecord();
        this.originalRecordData = null; // No original data for new records
        this.currentMode = 'add';
        this.createForm(); // Create form with blank data
    }

    // Save the record (either edited or new)
    saveRecord() {
        if (!this.recordForm) {
            this._snackbar.open('Form not initialized', 'Close', { duration: 4000 });
            return;
        }

        if (this.recordForm.invalid) {
            this._snackbar.open('Please fix form errors before saving', 'Close', { duration: 4000 });
            this.markFormGroupTouched(this.recordForm);
            return;
        }

        // Get form values and merge with selected record
        const formValues = this.recordForm.value;
        const recordToSave = { ...this.selectedRecord, ...formValues };

        // Emit the record
        this.save.emit(recordToSave);
        this.switchToViewMode();
    }

    // Cancel editing/adding and restore original data
    cancelOperation() {
        if (this.originalRecordData && this.currentMode === 'edit') {
            this.selectedRecord = { ...this.originalRecordData };
        }
        this.switchToViewMode();
        this.cancel.emit();
    }

    addNew() {
        this.startAdd();
    }

    viewRecord(row: any) {
        this.view.emit(row);
    }

    editRecord(row: any) {
        this.startEdit(row);
    }

    deleteRecord(row: any) {
        if (confirm('Are you sure you want to delete this record?')) {
            this.delete.emit(row);
        }
    }

    // Helper method to create a blank record based on column configuration
    private createBlankRecord(): any {
        const blankRecord: any = {};

        this.columns.forEach(column => {
            if (!column.hidden && !column.hide) {
                // Set default values based on data type
                switch (column.dataType) {
                    case 'text':
                    case 'email':
                    case 'tel':
                    case 'ssn':
                        blankRecord[column.key] = '';
                        break;
                    case 'number':
                        blankRecord[column.key] = null;
                        break;
                    case 'date':
                        blankRecord[column.key] = '';
                        break;
                    case 'time':
                        blankRecord[column.key] = '';
                        break;
                    case 'select':
                    case 'radio':
                        blankRecord[column.key] = '';
                        break;
                    case 'custom':
                        // Handle custom fields
                        if (column.key === 'bloodPressure') {
                            blankRecord['systolicBP'] = null;
                            blankRecord['diastolicBP'] = null;
                        } else {
                            blankRecord[column.key] = '';
                        }
                        break;
                    default:
                        blankRecord[column.key] = '';
                }
            }
        });

        return blankRecord;
    }

    // Utility method to get value from nested property path (e.g., 'user.name')
    getPropertyValue(obj: any, path: string): any {
        return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
    }

    // Create reactive form based on columns and current record
    private createForm(): void {
        const formControls: { [key: string]: FormControl } = {};

        this.columns.forEach(column => {
            if (!column.hidden && !column.hide) {
                const validators = [];

                // Add required validator if specified
                if (column.required) {
                    validators.push(Validators.required);
                }

                // Add email validator for email fields
                if (column.dataType === 'email') {
                    validators.push(Validators.email);
                }

                // Add custom validators if specified
                if (column.validators && column.validators.length > 0) {
                    validators.push(...column.validators);
                }

                // Get initial value from selected record
                const initialValue = this.selectedRecord ? this.selectedRecord[column.key] : '';

                // Handle custom fields
                if (column.dataType === 'custom' && column.key === 'bloodPressure') {
                    formControls['systolicBP'] = new FormControl(
                        this.selectedRecord ? this.selectedRecord['systolicBP'] : null,
                        column.required ? [Validators.required] : []
                    );
                    formControls['diastolicBP'] = new FormControl(
                        this.selectedRecord ? this.selectedRecord['diastolicBP'] : null,
                        column.required ? [Validators.required] : []
                    );
                } else {
                    formControls[column.key] = new FormControl(initialValue, validators);
                }
            }
        });

        this.recordForm = this.formBuilder.group(formControls);
    }

    // Helper method to mark all form controls as touched
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            control?.markAsTouched({ onlySelf: true });
        });
    }

    // Get form control for template
    getFormControl(field: string): FormControl {
        return this.recordForm?.get(field) as FormControl;
    }

    // Helper methods for template
    get isViewMode(): boolean {
        return this.currentMode === 'view';
    }

    get isEditMode(): boolean {
        return this.currentMode === 'edit';
    }

    get isAddMode(): boolean {
        return this.currentMode === 'add';
    }

    get isFormMode(): boolean {
        return this.currentMode === 'edit' || this.currentMode === 'add';
    }

    get formTitle(): string {
        switch (this.currentMode) {
            case 'add': return `Add New ${this.title}`;
            case 'edit': return `Edit ${this.title}`;
            default: return this.title;
        }
    }

    get formSubtitle(): string {
        switch (this.currentMode) {
            case 'add': return 'Adding new record';
            case 'edit': return 'Editing selected record';
            default: return this.subtitle;
        }
    }

    get saveButtonText(): string {
        return this.currentMode === 'add' ? 'Add Record' : 'Save Changes';
    }
}
