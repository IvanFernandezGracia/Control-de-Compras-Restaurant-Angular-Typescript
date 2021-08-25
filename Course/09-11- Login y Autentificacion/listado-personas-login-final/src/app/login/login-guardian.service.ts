import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';

@Injectable()
export class LoginGuardian implements CanActivate {

    constructor(private loginService: LoginService,
                private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.loginService.isAutenticado()) {
            return true;
        } 
        else {
            this.router.navigate(['/login']);
            return false;
        }
    }

}