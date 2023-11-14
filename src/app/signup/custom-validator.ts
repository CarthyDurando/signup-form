import { ValidatorFn, AbstractControl } from "@angular/forms";

export function containsLowerAndUpperCase(): ValidatorFn {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z]).*$/;
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && !pattern.test(value)) {
        return { 'containsLowerAndUpperCase': true };
      }
      return null;
    };
}

export function passwordNotContainName(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const firstName = control?.root?.get('firstName')?.value;
        const lastName = control?.root?.get('lastName')?.value;
        const password = control.value;
        if (password.toLowerCase().includes(firstName) || password.toLowerCase().includes(lastName)) {
            return { 'passwordNotContainName': true };
        }
        return null;
    };
}