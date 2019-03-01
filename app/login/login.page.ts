import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from '../services/dialog.service';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    myForm: FormGroup = new FormGroup({});
    constructor(
        private dialogService: DialogService,
        private navCtrl: NavController,
        private authService: AuthService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.initForm();
    }
    initForm() {
        this.myForm = new FormGroup({
            'username': new FormControl(null, Validators.required),
            'password': new FormControl(null, Validators.required)
        });
    }


    onSubmit() {
        this.dialogService.showLoader("Logging You In ...");

        this.authService.signIn(this.myForm.value.username, this.myForm.value.password).subscribe(success => {

            if (success.success) {
                if (success.data.token && success.data.refreshToken) {
                    let user: User = new User(this.myForm.value.username, success.data.token, success.data.refreshToken);
                    this.userService.saveLocalStorage(user);
                    this.dialogService.toast("Successfully Login");
                    this.navCtrl.navigateRoot('home');
                }
            }
            this.dialogService.hideLoader();

        },
            error => {
                if (error.error) {
                    for (var i = 0; i < (<string[]>error.error).length; i++) {
                        this.dialogService.toast((<string[]>error.error)[i]);
                    }
                } else {
                    this.dialogService.toast("Server Error , Please Try Again Later");
                }
                this.dialogService.hideLoader();
            });
    }


}
