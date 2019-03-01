import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from "@ionic/angular";

@Injectable()
export class DialogService {
    constructor(
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController
    ) { }


    toast(msg: string) {
        this.toastCtrl.create({
            message: msg,
            position: "bottom",
            duration: 4000
        }).then((toast) => toast.present());
    }
    showLoader(msg) {
        this.loadingCtrl.create({
            message: msg,
            duration:3000
        }).then((loader) => { loader.present() });
    }
    hideLoader() {
        this.loadingCtrl.dismiss();
    }
}