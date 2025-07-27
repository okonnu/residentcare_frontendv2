import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { TableFormComponent } from './table-form.component';
import { FormField } from '../../models/FormField';

@Component({
    selector: 'table-form-v2-example',
    standalone: true,
    imports: [CommonModule, TableFormComponent],
    template: `
    <div class="container-fluid">
      <table-form
        [title]="'Employee Management'"
        [subtitle]="'Simplified table using FormField configuration'"
        [dataSet]="employeeData"
        [formControls]="formControls"
        [idField]="'id'"
        [showAddButton]="true"
        [showEditButton]="true"
        [showDeleteButton]="true"
        [showViewButton]="true"
        (save)="handleSave($event)"
        (delete)="handleDelete($event)"
        (view)="handleView($event)"
        (cancel)="handleCancel()">
      </table-form>
    </div>
    `
})
export class TableFormV2ExampleComponent implements OnInit {

    // Sample data
    employeeData = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@company.com',
            position: 'senior_developer',
            department: 'IT',
            salary: 75000,
            hire_date: '2020-01-15',
            phone: '555-0123',
            status: 'active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@company.com',
            position: 'ux_designer',
            department: 'Design',
            salary: 70000,
            hire_date: '2019-03-22',
            phone: '555-0124',
            status: 'active'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@company.com',
            position: 'project_manager',
            department: 'Management',
            salary: 80000,
            hire_date: '2018-07-10',
            phone: '555-0125',
            status: 'inactive'
        }
    ];

    // Define form fields that will be used for both table columns and form inputs
    formControls: FormField[] = [];

    ngOnInit() {
        this.initializeFormControls();
    }

    private initializeFormControls() {
        // Create form controls based on the fields you want to display/edit
        const fieldConfigs = [
            { title: 'Name', dataType: 'text' },
            { title: 'Email', dataType: 'email' },
            {
                title: 'Position',
                dataType: 'select',
                options: [
                    { value: 'senior_developer', label: 'Senior Developer' },
                    { value: 'ux_designer', label: 'UX Designer' },
                    { value: 'project_manager', label: 'Project Manager' },
                    { value: 'data_analyst', label: 'Data Analyst' }
                ]
            },
            { title: 'Department', dataType: 'text' },
            { title: 'Salary', dataType: 'number' },
            { title: 'Hire Date', dataType: 'date' },
            { title: 'Phone', dataType: 'tel' },
            {
                title: 'Status',
                dataType: 'select',
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                ]
            }
        ];

        this.formControls = fieldConfigs.map(config => {
            const formField = new FormField();
            formField.title = config.title;
            formField.dataType = config.dataType;
            formField.dropDownOptions = (config as any).options || [];
            formField.formControl = new FormControl('');
            return formField;
        });
    }

    handleSave(data: any) {
        console.log('Save employee:', data);

        if (data.id) {
            // Update existing employee
            const index = this.employeeData.findIndex(emp => emp.id === data.id);
            if (index !== -1) {
                this.employeeData[index] = { ...this.employeeData[index], ...data };
            }
        } else {
            // Add new employee
            const newId = Math.max(...this.employeeData.map(emp => emp.id)) + 1;
            this.employeeData.push({ ...data, id: newId });
        }

        // Trigger change detection by reassigning the array
        this.employeeData = [...this.employeeData];
        console.log('Updated employee data:', this.employeeData);
    }

    handleDelete(employee: any) {
        console.log('Delete employee:', employee);
        this.employeeData = this.employeeData.filter(emp => emp.id !== employee.id);
        console.log('Updated employee data after deletion:', this.employeeData);
    }

    handleView(employee: any) {
        console.log('View employee:', employee);
        // Additional view logic can be added here
    }

    handleCancel() {
        console.log('Operation cancelled');
        // Additional cancel logic can be added here
    }
}
