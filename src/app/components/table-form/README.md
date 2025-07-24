# Table Form Component

The `TableFormComponent` is a reusable Angular component that displays data in a table format with inline editing capabilities. It combines the display functionality of a table with the editing capabilities of a form.

## Features

- Display tabular data with customizable columns
- Inline editing for individual rows
- Support for various data types (text, number, date, select, etc.)
- Sortable columns
- Pagination
- CRUD operations (Create, Read, Update, Delete)
- Customizable display of values through display functions
- Support for nested properties

## How to Use

### 1. Import the Component

```typescript
import { TableFormComponent, TableColumn } from '../../components/table-form/table-form.component';

@Component({
  // ...
  imports: [CommonModule, TableFormComponent],
  // ...
})
```

### 2. Define Your Columns

```typescript
columns: TableColumn[] = [
  { key: 'id', title: 'ID', dataType: 'text', sortable: true, hide: true },
  { key: 'name', title: 'Name', dataType: 'text', sortable: true },
  { key: 'age', title: 'Age', dataType: 'number', sortable: true },
  {
    key: 'status',
    title: 'Status',
    dataType: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    key: 'customField',
    title: 'Custom Display',
    dataType: 'custom',
    displayFn: (item) => `${item.firstName} ${item.lastName}`
  }
];
```

### 3. Add the Component to Your Template

```html
<table-form [title]="'Employee Records'" [subtitle]="'Click on a record to edit'" [dataSet]="records" [columns]="columns" [idField]="'id'" [allowInlineEdit]="true" (add)="handleAdd()" (edit)="handleEdit($event)" (delete)="handleDelete($event)" (save)="handleSave($event)"> </table-form>
```

### 4. Implement Event Handlers

```typescript
handleAdd() {
  // Create a new record
}

handleEdit(record: any) {
  // External edit if needed
}

handleDelete(record: any) {
  // Delete the record
}

handleSave(record: any) {
  // Save edited record
}
```

## Column Configuration Options

| Property    | Type                  | Description                                          |
| ----------- | --------------------- | ---------------------------------------------------- |
| key         | string                | Property name in data object                         |
| title       | string                | Display name for column header                       |
| dataType    | string                | Data type (text, number, date, select, custom, etc.) |
| sortable    | boolean               | Whether column is sortable                           |
| hidden/hide | boolean               | Whether to hide column from display                  |
| options     | Array<{value, label}> | For dropdowns and radio buttons                      |
| width       | string                | Optional width (e.g., '100px', '10%')                |
| displayFn   | function              | Function to format display value                     |

## Component Inputs

| Input            | Type          | Description                     |
| ---------------- | ------------- | ------------------------------- |
| title            | string        | Table title                     |
| subtitle         | string        | Table subtitle                  |
| dataSet          | any[]         | Data to display                 |
| columns          | TableColumn[] | Column definitions              |
| idField          | string        | Primary key field name          |
| showAddButton    | boolean       | Whether to show add button      |
| showEditButton   | boolean       | Whether to show edit button     |
| showDeleteButton | boolean       | Whether to show delete button   |
| showViewButton   | boolean       | Whether to show view button     |
| allowInlineEdit  | boolean       | Whether to allow inline editing |

## Component Outputs

| Output | Type               | Description           |
| ------ | ------------------ | --------------------- |
| add    | EventEmitter<void> | Add button clicked    |
| edit   | EventEmitter<any>  | Edit button clicked   |
| delete | EventEmitter<any>  | Delete button clicked |
| view   | EventEmitter<any>  | View button clicked   |
| save   | EventEmitter<any>  | Save button clicked   |
| cancel | EventEmitter<void> | Cancel button clicked |

## Examples

Check out these examples to see the component in action:

1. Basic Example: `/pages/table-form-example`
2. Vitals Data Example: `/pages/vitals-table-example`
