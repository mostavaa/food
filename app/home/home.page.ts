import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Item } from '../models/item.model';
import { DialogService } from '../services/dialog.service';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    myForm: FormGroup = new FormGroup({});
    items: Item[] = [];
    selectedItems: { guid: string, amount: number, item: Item }[] = [];

    constructor(
        private dialogService: DialogService,
        private itemService: ItemService,

    ) { }
    ngOnInit() {

        this.initForm();
        this.itemService.addItemSubject.subscribe(items => {
            this.selectedItems = items;
        }, error => {
            this.dialogService.toast("Internal Server Error");
        });
        this.itemService.itemsSubject.subscribe(items => {
            this.items = items;
        },
            error => this.items = []);
        this.itemService.getAllHttp();
    }
    initForm() {
        this.myForm = new FormGroup({
            'item': new FormControl(null),
            'amount': new FormControl(null),
            'notes': new FormControl(null)
        });
    }

    onSubmit() {
        if (this.myForm.value.item && this.myForm.value.amount && this.myForm.value.amount > 0) {
            let itemIndex = this.items.findIndex(o => { return o.guid == this.myForm.value.item });
            if (itemIndex > -1) {
                let selectedItemIndex = this.selectedItems.findIndex(o => { return o.item.guid == this.myForm.value.item });
                if (selectedItemIndex > -1) {
                    this.dialogService.toast("You Selected This Item Before");

                } else {

                    this.dialogService.showLoader("Adding Item ... ");
                    this.itemService.orderItem(this.myForm.value.item, this.myForm.value.amount, this.myForm.value.notes).subscribe(
                        data => {
                            this.itemService.getSelectedItemsHttp();
                            this.dialogService.hideLoader();
                        }, error => {
                            debugger;
                            this.dialogService.hideLoader();
                            if (error.error) {
                                for (var i = 0; i < (<string[]>error.error).length; i++) {
                                    this.dialogService.toast((<string[]>error.error)[i]);
                                }
                            } else {
                                this.dialogService.toast("Server Error , Please Try Again Later");
                            }
                        });
                }
            } else {
                //not found
                this.dialogService.toast("Item Not Fount");
            }
        } else {
            this.dialogService.toast("Please Enter a valid value");

        }

    }
    deleteItem(item: string) {
        this.itemService.removeItem(item).subscribe(success => {
            if (success)
                for (var i = 0; i < success.length; i++) {
                    this.dialogService.toast(success[i]);
                }
            this.itemService.getSelectedItemsHttp();
        }, error => {
            if (error.error) {
                for (var i = 0; i < (<string[]>error.error).length; i++) {
                    this.dialogService.toast((<string[]>error.error)[i]);
                }
            } else {

                if (Array.isArray(error)) {
                    for (var j = 0; j < error.length; j++) {
                        this.dialogService.toast(error[j]);
                    }
                } else
                    this.dialogService.toast("Server Error , Please Try Again Later");
            }


        })
    }
}
