import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireModule } from '@angular/fire';
//import { AngularFirestore } from '@angular/fire/firestore'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor.service';
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';
import { ItemService } from './services/item.service';
import { FcmService } from './services/fcm.service';

import { DialogService } from './services/dialog.service';

const firebase = {
    apiKey: "AIzaSyAQT0hng-Ah9RV4-FTLlsQlWrC91JhtwNA",
    authDomain: "fetarkapp-60f67.firebaseapp.com",
    databaseURL: "https://fetarkapp-60f67.firebaseio.com",
    projectId: "fetarkapp-60f67",
    storageBucket: "fetarkapp-60f67.appspot.com",
    messagingSenderId: "497788281637"
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
        AngularFireModule.initializeApp(firebase),
        //AngularFirestore,
        HttpClientModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
      },
      AuthService,
      HttpService,
      UserService,
      ItemService,
      FcmService,
      DialogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
