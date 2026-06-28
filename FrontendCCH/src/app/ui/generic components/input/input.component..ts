import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberFormatPipe } from '../../../core/shared/shared/pipes/numberFormat.pipe';


@Component({
  selector: 'text-input',
  standalone: true,
  imports: [ReactiveFormsModule,NumberFormatPipe],
  template: `
    <div class="form-group">
      <label class="label-truncate">{{ label }}</label>
      <input
        class="form-control"
        [formControl]="controller!"
        [value]="format ? (controller?.value | numberFormat) : controller?.value"
        [type]="type"
        (input)="format ? onInput($event) : null" />

      <span
        class="error-message"
        [class.visible]="!controller.valid && controller.touched">
        {{ controller.errors?.message }}
      </span>
    </div>
  `,
  styleUrl: './input.component.scss'
})
export class TextInputComponent {

  @Input({ required: true }) controller: any;
  @Input({ required: true }) label?: string;
  @Input({ required: true }) type?: 'date' | 'number' | 'text' | 'password'  | 'email';
  @Input() format: boolean = false;

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let rawValue = inputElement.value;
    if (!rawValue) { return;}
    if (this.format) { rawValue = rawValue.replace(/,/g, '');}
    this.controller.setValue(rawValue, { emitEvent: false });
  }
}
