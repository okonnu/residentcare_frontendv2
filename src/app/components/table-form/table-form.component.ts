import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { FormField } from 'src/app/models/FormField.model';
import { CardFormComponent } from '../card-form/card-form.component';
import { SnackBarService } from 'src/app/services/snackBar.service';

// Simplified interface for table columns
export interface TableColumn {
    key: string;       // Property name in data object
    title: string;     // Display name for column header
    sortable?: boolean; // Whether column is sortable
    hidden?: boolean;   // Whether to hide column from display
    width?: string;     // Optional width (e.g., '100px', '10%')
    displayFn?: (item: any) => string; // Function to format display value
}

@Component({
    selector: 'table-form',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        TablerIconsModule,
        CardFormComponent
    ],
    templateUrl: './table-form.component.html',
    styleUrls: ['./table-form.component.scss']
})
export class TableFormComponent implements OnInit, AfterViewInit {
    @Input() title: string = 'Records';
    @Input() subtitle: string = '';
    @Input() formControls: FormField[] = [];
    @Input() idField: string = 'id';
    @Input() showAddButton: boolean = true;
    @Input() showEditButton: boolean = true;
    @Input() showDeleteButton: boolean = true;
    @Input() showViewButton: boolean = true;

    @Input()
    set dataSet(value: any[]) {
        if (value) {
            this._dataSet = value;
            this.dataSource.data = value;
        }
    }
    get dataSet(): any[] {
        return this._dataSet;
    }

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
    currentMode: 'view' | 'edit' | 'add' | 'detail' = 'view';
    selectedRecord: any = null;
    originalRecord: any = null; // Store the original record being edited
    private _dataSet: any[] = [];
    private _snackbar = inject(SnackBarService);

    // Extract columns from formControls
    get columns(): TableColumn[] {
        return this.formControls.map(field => ({
            key: field.key, // Use explicit key from FormField
            title: field.title,
            sortable: true,
            hidden: field.hidden || false // Use hidden property from FormField
        }));
    }

    constructor() {
        this.dataSource = new MatTableDataSource<any>([]);
    }

    ngOnInit() {
        // Initialize data
        if (this._dataSet && this._dataSet.length > 0) {
            this.dataSource.data = this._dataSet;
        }

        // Prepare displayed columns (excluding hidden ones)
        this.displayedColumns = this.columns
            .filter(column => !column.hidden)
            .map(column => column.key);

        // Add actions column if any action button is visible
        if (this.showEditButton || this.showDeleteButton || this.showViewButton) {
            this.displayedColumns.push('actions');
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // Switch to view mode (table display)
    switchToViewMode() {
        this.currentMode = 'view';
        this.selectedRecord = null;
        this.originalRecord = null; // Clear original record
    }

    // Start viewing a record in detail
    viewRecord(row: any) {
        this.loadDataIntoFormControls(row);
        this.selectedRecord = this.formControls;
        this.currentMode = 'detail';
        this.view.emit(row);
    }

    // Start editing a record
    editRecord(row: any) {
        this.originalRecord = { ...row }; // Store a copy of the original record
        this.loadDataIntoFormControls(row);
        this.selectedRecord = this.formControls;
        this.currentMode = 'edit';
    }

    // Start adding a new record
    addNew() {
        this.originalRecord = null; // No original record for new entries
        this.clearFormControls();
        this.selectedRecord = this.formControls;
        this.currentMode = 'add';
    }

    // Delete a record
    deleteRecord(row: any) {
        if (confirm('Are you sure you want to delete this record?')) {
            this.delete.emit(row);
        }
    }

    // Handle save from card-form
    onSave(data: any) {
        const recordToSave = this.getFormControlValues();

        if (this.currentMode === 'edit' && this.originalRecord) {
            // Preserve the ID and any other fields that shouldn't be overwritten
            recordToSave[this.idField] = this.originalRecord[this.idField];

            // Also preserve any other fields that might not be in the form but exist in the original record
            Object.keys(this.originalRecord).forEach(key => {
                if (!(key in recordToSave)) {
                    recordToSave[key] = this.originalRecord[key];
                }
            });
        }

        this.save.emit(recordToSave);
        this.switchToViewMode();
        this._snackbar.showSuccess('Record saved successfully');
    }

    // Handle cancel from card-form
    onCancel() {
        this._snackbar.showError('Operation cancelled');
        this.switchToViewMode();
        this.cancel.emit();
    }

    // Handle edit button from card-form
    onEdit() {
        this.currentMode = 'edit';
        this.edit.emit(this.selectedRecord);
    }

    // Load data from row into existing form controls
    private loadDataIntoFormControls(row: any): void {
        this.formControls.forEach(field => {
            field.formControl.setValue(row[field.key] || '');
        });
    }

    // Clear all form controls (for adding new records)
    private clearFormControls(): void {
        this.formControls.forEach(field => {
            field.formControl.setValue('');
        });
    }

    // Get current form control values as plain object
    private getFormControlValues(): any {
        const result: any = {};
        this.formControls.forEach(field => {
            result[field.key] = field.formControl.value;
        });
        return result;
    }

    // Utility method to get value from nested property path
    getPropertyValue(obj: any, path: string): any {
        return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
    }

    // Helper methods for template
    get isViewMode(): boolean {
        return this.currentMode === 'view';
    }

    get isDetailMode(): boolean {
        return this.currentMode === 'detail';
    }

    get isEditMode(): boolean {
        return this.currentMode === 'edit';
    }

    get isAddMode(): boolean {
        return this.currentMode === 'add';
    }

    get isFormMode(): boolean {
        return this.currentMode === 'edit' || this.currentMode === 'add' || this.currentMode === 'detail';
    }

    get cardTitle(): string {
        switch (this.currentMode) {
            case 'add': return `Add New ${this.title}`;
            case 'edit': return `Edit ${this.title}`;
            case 'detail': return `View ${this.title}`;
            default: return this.title;
        }
    }
}
