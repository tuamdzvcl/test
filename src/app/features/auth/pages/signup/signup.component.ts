import { AuthData } from '../../../../core/model/authData .model';
import { ApiResponse } from '../../../../core/model/api-response.model';
import { AuthService } from './../../AuthService ';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayoutComponent } from '../../ui/auth-layout/auth-layout.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthLayoutComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  readonly isSubmitting = signal(false);
  readonly passwordVisible = signal(false);

  readonly form;

  constructor(private readonly fb: FormBuilder,
    private  readonly authservice: AuthService,
    private readonly router : Router) {
    this.form = this.fb.nonNullable.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username:['string']
      
    });
  }

  togglePassword(): void {
    this.passwordVisible.update((v) => !v);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    const data = this.form.getRawValue()
    const payload = {
    Username: data.username,
    FirstName: data.firstName,
    LastName: data.lastName,
    Email: data.email,
    password: data.password
  };

    this.authservice.register(payload).subscribe(
      {
        next(res){
          console.log("đăng kí thành công ")
          console.log(res.ApiResponse)
          alert(res.ApiResponse)

        },
        error:(err) =>{

          this.isSubmitting.set(false);
          console.log(err);
          alert(err.message || 'đăng kí thấy bại')

        }
        

      }
    )
  }
}

