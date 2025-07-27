# Table Form V2 Component

A simplified table component that reuses the card-form-v2 component for editing and viewing records.

## Key Improvements

- **Simplified Configuration**: Uses `FormField[]` instead of complex column configurations
- **Code Reuse**: Leverages the existing card-form-v2 component for form operations
- **Reduced Complexity**: Removed unnecessary properties and simplified the interface
- **Automatic Column Generation**: Table columns are automatically derived from FormField array

## Usage

```typescript
import { TableFormComponent } from "./table-form-v2/table-form.component";
import { FormField } from "../models/FormField";

@Component({
  // ...
  imports: [TableFormComponent],
})
export class MyComponent {
  // Define your form fields
  formControls: FormField[] = [
    // These will be used for both table columns and form inputs
  ];

  // Your data array
  dataSet = [
    { id: 1, name: "John", email: "john@example.com" },
    // ...
  ];
}
```

```html
<table-form [title]="'My Records'" [subtitle]="'Manage your records'" [dataSet]="dataSet" [formControls]="formControls" [idField]="'id'" [showAddButton]="true" [showEditButton]="true" [showDeleteButton]="true" [showViewButton]="true" (save)="handleSave($event)" (delete)="handleDelete($event)" (view)="handleView($event)" (cancel)="handleCancel()"> </table-form>
```

## Properties

### Inputs

| Property           | Type        | Default   | Description                                |
| ------------------ | ----------- | --------- | ------------------------------------------ |
| `title`            | string      | 'Records' | Table title                                |
| `subtitle`         | string      | ''        | Table subtitle                             |
| `formControls`     | FormField[] | []        | Field configurations for columns and forms |
| `dataSet`          | any[]       | []        | Data array to display                      |
| `idField`          | string      | 'id'      | Field name used as unique identifier       |
| `showAddButton`    | boolean     | true      | Show add new record button                 |
| `showEditButton`   | boolean     | true      | Show edit button in actions                |
| `showDeleteButton` | boolean     | true      | Show delete button in actions              |
| `showViewButton`   | boolean     | true      | Show view button in actions                |

### Outputs

| Event    | Type | Description                               |
| -------- | ---- | ----------------------------------------- |
| `save`   | any  | Emitted when a record is saved (add/edit) |
| `delete` | any  | Emitted when a record is deleted          |
| `view`   | any  | Emitted when view button is clicked       |
| `cancel` | void | Emitted when operation is cancelled       |

## FormField Configuration

The `FormField` model supports:

```typescript
class FormField {
  dataType: string; // 'text', 'email', 'number', 'date', 'select', 'radio', etc.
  title: string; // Display name (used for both column header and form label)
  dropDownOptions?: Array<{ value: string; label: string }>; // For select/radio types
  formControl: FormControl; // Angular FormControl
}
```

## Key Features

1. **Automatic Column Generation**: Table columns are automatically created from the `formControls` array
2. **Integrated Card Form**: Uses card-form-v2 for view, edit, and add operations
3. **Simplified Interface**: Removed complex column configuration options
4. **Built-in Modes**:
   - View mode: Shows table with action buttons
   - Detail mode: Shows card-form in read-only mode
   - Edit mode: Shows card-form in edit mode
   - Add mode: Shows card-form for adding new records

## Data Mapping

The component automatically maps between your data object keys and FormField titles:

- FormField title "Full Name" becomes table column key "full_name"
- Spaces are replaced with underscores and converted to lowercase
- This ensures consistent mapping between table display and form editing

## Example

See `table-form-v2-usage-example.ts` for a complete working example.
