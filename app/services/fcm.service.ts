import { Injectable } from "@angular/core";
import * as Firebase  from '@ionic-native/firebase';
import { AlertController } from "@ionic/angular";
@Injectable()
export class FcmService {
  token: string;
    constructor( private alertCtrl:AlertController) {

  }
    onNotification() {

        Firebase.Firebase.subscribe("default").then(res => { console.log(res) });
        Firebase.Firebase.onNotificationOpen()
      .subscribe(data=> {
        console.log(`User opened a notification data`);
        console.log(data);
        if (data.body && data.title) {
          if (data.tap == false) {
            let alert = this.alertCtrl.create({
                message: data.body,
                header: data.title,
            }).then(o => o.present());
          }
        }
      });
  }
  getToken() {
      Firebase.Firebase.onTokenRefresh()
      .subscribe((token: string) => {
        console.log(`Got a new token ${token}`);
        this.token = token;
      }, error => { console.error('Error getting token', error) });

      Firebase.Firebase.getToken()
      .then(token => {
        console.log(`The token is ${token}`);
        this.token = token;
      })
      .catch(error => console.error('Error getting token', error));
  }
}
