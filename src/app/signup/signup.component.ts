import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { containsLowerAndUpperCase, passwordNotContainName } from './custom-validator';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  signupForm!: FormGroup;
  fullname!: string;
  thumbnailUrl!: string;
  showPassword: boolean = false;
  showPasswordConfirm: boolean = false;
  firstName : string = '' ;
  lastName : string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), containsLowerAndUpperCase(),  passwordNotContainName()]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8), containsLowerAndUpperCase(),  passwordNotContainName()]]
    });
    this.signupForm.valueChanges.subscribe(() => {
      this.fullname = `${this.signupForm.value.firstName} ${this.signupForm.value.lastName}`;
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      // Make the first request to get the thumbnail url
      this.http.get(`https://jsonplaceholder.typicode.com/photos/${this.signupForm.value.lastName.length}`).subscribe((response: any) => {
        this.thumbnailUrl = response.thumbnailUrl;
        // Make the second request to create the user
          this.http.post('https://jsonplaceholder.typicode.com/users', {
            firstName: this.signupForm.value.firstName,
            lastName: this.signupForm.value.lastName,
            email: this.signupForm.value.email,
            thumbnailUrl: this.thumbnailUrl
          }).subscribe((response: any) => {
            console.log('response ==== ' , response);
          });
        });
    }

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

  getFieldError(fieldName : string): boolean | undefined {
    return this.signupForm.get(fieldName)?.touched && this.signupForm.get(fieldName)?.invalid
  }

  getPasswordErrors() : string[] {
    const errorList : string[] = [] ;
    const passwordControl = this.signupForm.controls['password'];
    if (passwordControl.touched) {
      const errors = passwordControl.errors ?? {};
      const errorsKeys = Object.keys(errors);
      errorsKeys.forEach(error => {
          switch(error) {
            case 'required' : 
                errorList.push('Password is required')
                break ;
            case 'passwordNotContainName' :
                errorList.push('Password should not contains lastname or firstname')
                break ;
            case 'minlength' :
                errorList.push(`Password should not be less than ${errors['minlength']['requiredLength']} characters`)
                break ;
            case 'containsLowerAndUpperCase' :
                errorList.push(`Password should contain lowercase and uppercase characters`)
                break ;
            default :
                errorList.push('');
                break;
          }
      });
    }
    return errorList;
  }

}

