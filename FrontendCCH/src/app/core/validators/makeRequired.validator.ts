import { AbstractControl } from "@angular/forms";
import { InputValidationResponse } from "./InputValidationResponse.interface";

export function makeRequired(control: AbstractControl): InputValidationResponse | null {
  if (!control.value || control.value.length === 0) {
    return { message: 'Campo requerido **' };
  }
  return null;
}
