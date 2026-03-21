import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from '../../core/services/BaseApiService ';
import { TokenService } from '../../core/services/token.service';
import { AuthData } from '../../core/model/authData .model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService {

  constructor(
    http: HttpClient,
    private tokenService: TokenService
  ) {
    super(http);
  }

  // LOGIN
  login(data: { email: string; password: string }) {
    return this.post<AuthData>('auth/login', data).pipe(
      tap(res => {
        this.tokenService.setToken(
          res.AccessToken,
          res.RefreshToken
        );
      })
    );
  }
  // REGISTER
  register(data: any) {
    return this.post<any>('auth/register', data);
  }

  getGoogleResult(key:string)
  {
      return this.post<any>('auth/google-result',{ 
        key : key
      }
      );
  }
  logout() {
    localStorage.clear();
  }
  getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
}