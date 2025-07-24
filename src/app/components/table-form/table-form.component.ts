import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

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
        NgxMaskDirective
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
    @Input() allowInlineEdit: boolean = true;

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
    editingRow: any = null;
    originalEditData: any = null;
    private _dataSet: any[] = [];

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

    startEdit(row: any) {
        // Store original data for cancellation
        this.originalEditData = { ...row };
        this.editingRow = row;
    }

    saveEdit() {
        if (!this.editingRow) return;

        // Clone to avoid reference issues
        const editedData = { ...this.editingRow };
        this.save.emit(editedData);
        this.cancelEdit();
    }

    cancelEdit() {
        if (this.editingRow && this.originalEditData) {
            // Restore original values
            Object.keys(this.originalEditData).forEach(key => {
                this.editingRow[key] = this.originalEditData[key];
            });
        }

        this.editingRow = null;
        this.originalEditData = null;
        this.cancel.emit();
    }

    addNew() {
        this.add.emit();
    }

    viewRecord(row: any) {
        this.view.emit(row);
    }

    editRecord(row: any) {
        this.edit.emit(row);
    }

    deleteRecord(row: any) {
        if (confirm('Are you sure you want to delete this record?')) {
            this.delete.emit(row);
        }
    }

    isEditing(row: any): boolean {
        return this.editingRow === row;
    }

    // Utility method to get value from nested property path (e.g., 'user.name')
    getPropertyValue(obj: any, path: string): any {
        return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
    }
}
