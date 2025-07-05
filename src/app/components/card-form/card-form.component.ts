import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

export interface Structure {
  color: string;
  title: string;
  icon: string;
  value: any;
  dataType: string; // 'text', 'number', 'date', 'select', 'radio', etc.
  options?: Array<{ value: string, label: string }>; // For dropdowns and radio buttons
}

@Component({
  selector: 'card-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, TablerIconsModule, NgxMaskDirective],
  templateUrl: './card-form.component.html',
  providers: [
    provideNgxMask()
  ]
})
export class CardFormComponent {
  @Input() dataSet: Structure[] = [];
  @Input() title: string = '';
  @Input() image: string | null = null;
  editMode: boolean = false;
  trackByTitle(index: number, item: Structure): string {
    return item.title;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
}