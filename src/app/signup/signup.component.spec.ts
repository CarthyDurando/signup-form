import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/authService/auth.service';
import { SignupComponent } from './signup.component';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        HttpClientModule,
        RouterModule.forRoot([
          { path: 'signup', component: SignupComponent },
        ]),
        SignupComponent
      ],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call setup on ngOnInit', () => {
    const spySetup = spyOn(component, 'setup');
    component.ngOnInit();
    expect(spySetup).toHaveBeenCalled();
  });

  it('should initialize the signup form', () => {
    expect(component.signupForm).toBeTruthy();
    expect(component.signupForm.controls['firstName']).toBeTruthy();
    expect(component.signupForm.controls['lastName']).toBeTruthy();
    expect(component.signupForm.controls['email']).toBeTruthy();
    expect(component.signupForm.controls['password']).toBeTruthy();
    expect(component.signupForm.controls['passwordConfirm']).toBeTruthy();
  });

  it('should update the fullname property when firstName and lastName values change', () => {
    component.signupForm.controls['firstName'].setValue('John');
    component.signupForm.controls['lastName'].setValue('Doe');
    expect(component.fullname).toEqual('John Doe');
  });

  it('should toggle password visibility', () => {
    component.showPassword = false;
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTruthy();
  });

  it('should toggle passwordConfirm visibility', () => {
    component.showPasswordConfirm = false;
    component.togglePasswordConfirmVisibility();
    expect(component.showPasswordConfirm).toBeTruthy();
  });

  it('should check if passwords match', () => {
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['passwordConfirm'].setValue('password123');
    expect(component.passwordMatch()).toEqual('');
  });

  it('should check if passwords does not match', () => {
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['passwordConfirm'].setValue('password1234');
    expect(component.passwordMatch()).toEqual('Password does not match');
  });

  it('should return an empty array when the password is not touched', () => {
    expect(component.getPasswordValidationErrors()).toEqual([]);
  });


  it('should check if password contains lastname or firstname', () => {
    component.signupForm.controls['lastName'].setValue('john');
    component.signupForm.controls['firstName'].setValue('doe');
    component.signupForm.controls['password'].setValue('johndoe123');
    component.signupForm.controls['password'].markAsTouched();
    const passwordErrors = component.getPasswordValidationErrors();
    expect(passwordErrors).toContain('Password should not contains lastname or firstname');
  });

  it('should check if password contains lowercase and uppercase characters', () => {
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['password'].markAsTouched();
    const passwordErrors = component.getPasswordValidationErrors();
    expect(passwordErrors).toContain('Password should contain lowercase and uppercase characters');
  });

  it('should check if password is not less than 8 characters', () => {
    component.signupForm.controls['password'].setValue('pass123');
    component.signupForm.controls['password'].markAsTouched();
    const passwordErrors = component.getPasswordValidationErrors();
    expect(passwordErrors).toContain('Password should not be less than 8 characters');
  });

  it('should set thumbnailUrl from firstRequestResponse and call runSecondRequest if firstRequestResponse is valid', async() => {
    const thumbnailURL = 'https://example.com/image.jpg';
    const spy = spyOn(component, 'runSecondRequest');
    spyOn(authService, 'runFirstRequest').and.returnValue(of({
      albumId: 1,
      id: 2,
      thumbnailUrl: thumbnailURL,
      title: 'test',
      url: 'test.com'
    }));
    spyOn(authService, 'runSecondRequest').and.returnValue(of());
    component.runFirstRequest();
    // Asynchronous behavior simulation
    setTimeout(() => {
      expect(component.thumbnailUrl).toEqual(thumbnailURL);
      expect(spy).toHaveBeenCalled();
    },3000)
  });

  it('should not set thumbnailUrl or call runSecondRequest if firstRequestResponse is invalid', async() => {
    const thumbnailURL = 'https://example.com/image.jpg';
    const spy = spyOn(component, 'runSecondRequest');
    spyOn(authService, 'runFirstRequest').and.returnValue(of(undefined));
    component.runFirstRequest();
    // Asynchronous behavior simulation
    setTimeout(() => {
      expect(component.thumbnailUrl).not.toBeDefined();
      expect(spy).not.toHaveBeenCalled();
    },500)
  });

  it('should call authService.runSecondRequest with userData', () => {
    const spy = spyOn(authService, 'runSecondRequest');
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
    };
    component.runSecondRequest();
    // Asynchronous behavior simulation
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(userData);
    },500)
  });

  it('should return an empty array when the email is not touched', () => {
    expect(component.getEmailValidationErrors()).toEqual([]);
  });

  it('should return the required error when the email is touched and is empty', () => {
    const emailControl = component.signupForm.controls['email'];
    emailControl.markAsTouched();
    expect(component.getEmailValidationErrors()).toEqual(['Email is required']);
  });

  it('should return the email error when the email is touched and is not valid', () => {
    const emailControl = component.signupForm.controls['email'];
    emailControl.setValue('invalid-email');
    emailControl.markAsTouched();
    expect(component.getEmailValidationErrors()).toEqual(['Email is not valid']);
  });
});
