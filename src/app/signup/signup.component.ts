import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { containsLowerAndUpperCase, passwordNotContainName } from './custom-validator';
import { AuthService } from '../core/services/authService/auth.service';
import { Album } from '../core/models/album.model';
import { User } from '../core/models/user.interface';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  fullname!: string;
  thumbnailUrl!: string;
  showPassword: boolean = false;
  showPasswordConfirm: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.setup();
  }

  setup() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), containsLowerAndUpperCase(), passwordNotContainName()]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8), containsLowerAndUpperCase(), passwordNotContainName()]]
    });
    this.signupForm.valueChanges.subscribe(() => {
      this.fullname = `${this.signupForm.value.firstName} ${this.signupForm.value.lastName}`;
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.runFirstRequest();
    }
  }

  runFirstRequest(): void {
    this.authService.runFirstRequest(this.signupForm.value.lastName.length ?? 0).subscribe((firstRequestResponse: Album) => {
      if (firstRequestResponse) {
        this.thumbnailUrl = firstRequestResponse.thumbnailUrl;
        this.runSecondRequest();
      }
    });
  }

  runSecondRequest(): void {
    const userData: User = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.email,
      thumbnailUrl: this.thumbnailUrl
    };
    this.authService.runSecondRequest(userData).subscribe((secondRequestResponse: any) => {
      console.log('Second Request Response:', secondRequestResponse);
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility(): void {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  passwordMatch(): string | null {
    return this.signupForm.value.password !== this.signupForm.value.passwordConfirm ? 'Password does not match' : '';
  }

  getFieldError(fieldName: string): boolean | undefined {
    return this.signupForm.get(fieldName)?.touched && this.signupForm.get(fieldName)?.invalid
  }

  getPasswordErrors(): string[] {
    const errorList: string[] = [];
    const passwordControl = this.signupForm.controls['password'];
    if (passwordControl && passwordControl.touched) {
      const errors = passwordControl.errors ?? {};
      const errorsKeys = Object.keys(errors);
      if (errorsKeys) {
        errorsKeys.forEach(error => {
          switch (error) {
            case 'required':
              errorList.push('Password is required')
              break;
            case 'passwordNotContainName':
              errorList.push('Password should not contains lastname or firstname')
              break;
            case 'minlength':
              errorList.push(`Password should not be less than ${errors['minlength']['requiredLength']} characters`)
              break;
            case 'containsLowerAndUpperCase':
              errorList.push(`Password should contain lowercase and uppercase characters`)
              break;
            default:
              errorList.push('');
              break;
          }
        });
      }
    }
    return errorList;
  }

}

