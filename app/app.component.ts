import { Component, OnInit } from '@angular/core';

import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from './services/fcm.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private menuCtrl: MenuController,
      private authService: AuthService,
      private fcmService: FcmService,
      private navController: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
    ngOnInit() {
        this.fcmService.getToken();
        this.fcmService.onNotification();
        if (this.isAuthenticated()) {
            this.navController.navigateRoot('home');
        } else {
            this.navController.navigateRoot('login');
        }
    }
    isAuthenticated() {
        return this.authService.isAuthenticated();
    }
    load(page: string) {
        this.navController.navigateRoot(page);
        this.menuCtrl.close();
    }
    logout() {
        this.authService.logout();
        this.navController.navigateRoot('login');
    }
}
