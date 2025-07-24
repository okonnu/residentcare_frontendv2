import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFormComponent, TableColumn } from '../../components/table-form/table-form.component';

@Component({
    selector: 'app-table-form-example',
    standalone: true,
    imports: [CommonModule, TableFormComponent],
    template: `
    <div class="container-fluid">
      <table-form
        [title]="'Employee Records'"
        [subtitle]="'Click on the edit button to modify a record'"
        [dataSet]="employeeData"
        [columns]="columns"
        [idField]="'id'"
        (add)="handleAdd()"
        (edit)="handleEdit($event)"
        (delete)="handleDelete($event)"
        (view)="handleView($event)"
        (save)="handleSave($event)">
      </table-form>
    </div>
  `
})
export class TableFormExampleComponent implements OnInit, AfterViewInit {
    // Sample data
    records = [
        {
            id: 1,
            name: 'John Doe',
            position: 'Developer',
            department: 'IT',
            salary: 75000,
            hireDate: '2020-01-15',
            status: 'active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            position: 'Designer',
            department: 'Design',
            salary: 70000,
            hireDate: '2019-05-10',
            status: 'active'
        },
        {
            id: 3,
            name: 'Robert Johnson',
            position: 'Manager',
            department: 'HR',
            salary: 85000,
            hireDate: '2018-11-20',
            status: 'inactive'
        }
    ];

    // This property will be bound to the table component
    employeeData: any[] = [];

    refreshData() {
        // Force Angular change detection by creating a new array reference
        this.employeeData = [...this.records];
        console.log('Data refreshed:', this.employeeData);
    }

    ngOnInit() {
        console.log('Example component initialized with', this.records.length, 'records');
        console.log('Records:', this.records);
        console.log('Columns:', this.columns);

        // Initialize data
        this.refreshData();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            console.log('After view init - Records:', this.employeeData.length);
        });
    }

    // Column definitions
    columns: TableColumn[] = [
        { key: 'id', title: 'ID', dataType: 'number', sortable: true, width: '70px', hidden: false },
        { key: 'name', title: 'Name', dataType: 'text', sortable: true, hidden: false },
        { key: 'position', title: 'Position', dataType: 'text', sortable: true, hidden: false },
        {
            key: 'department', title: 'Department', dataType: 'select', sortable: true, hidden: false,
            options: [
                { value: 'IT', label: 'IT' },
                { value: 'HR', label: 'Human Resources' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Design', label: 'Design' }
            ]
        },
        { key: 'salary', title: 'Salary', dataType: 'number', sortable: true, hidden: false },
        { key: 'hireDate', title: 'Hire Date', dataType: 'date', sortable: true, hidden: false },
        {
            key: 'status', title: 'Status', dataType: 'select', sortable: true, hidden: false,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'onLeave', label: 'On Leave' }
            ]
        }
    ];

    handleAdd() {
        console.log('Add new record clicked');
        // In a real app, you would open a dialog or navigate to a create form
        alert('Add new record action triggered');
    }

    handleEdit(record: any) {
        console.log('Edit record', record);
        // This is used for external editing (non-inline)
        alert(`Edit record: ${record.name}`);
    }

    handleDelete(record: any) {
        console.log('Delete record', record);
        // In a real app, you would call your service to delete the record
        const index = this.records.findIndex(r => r.id === record.id);
        if (index !== -1) {
            this.records.splice(index, 1);
            this.refreshData(); // Update with new array reference
        }
    }

    handleView(record: any) {
        console.log('View record', record);
        // In a real app, you would open a dialog or navigate to a details page
        alert(`View details for: ${record.name}`);
    }

    handleSave(record: any) {
        console.log('Save record', record);
        alert('Save/Add record action triggered' + JSON.stringify(record));
        // In a real app, you would call your service to update the record
        const index = this.records.findIndex(r => r.id === record.id);
        if (index !== -1) {
            this.records[index] = { ...record };
            this.refreshData(); // Update with new array reference
        }
    }
}
