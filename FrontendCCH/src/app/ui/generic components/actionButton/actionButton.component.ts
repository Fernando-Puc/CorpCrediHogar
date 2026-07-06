import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
@Component({
  selector: 'action-button',
  imports: [MatButtonModule],
  styleUrl: './actionButton.component.scss',
  template: `
  <button
      [disabled]="isDisabled"
      mat-raised-button
      [class.btn_cancel]="variant === 'cancel'"
      [class.btn_accept]="variant === 'accept'"
      [class.btn_none]="variant === 'none'"
      [class.btn_await]="variant === 'await'"
      [class.btn_await_start]="variant === 'start'"
    >
    {{ text }}
    <span class="material-symbols-outlined">{{icon}}</span>
    </button>
  `,
})
export class ActionButtonComponent {

  @Input({ required: true }) text?: string;
  @Input() variant?: 'cancel' | 'accept' | 'none' | 'await' | 'start';
  @Input() isDisabled = false;
  @Input() icon?: string;

}
