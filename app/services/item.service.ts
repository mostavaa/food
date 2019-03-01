import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Item } from "../models/item.model";
import { Constants } from "./constants";
import { Subject } from "rxjs";
import { UserService } from "./user.service";

@Injectable()
export class ItemService {

  private items: Item[] = [];
  private selectedItems: { guid: string, amount: number, item: Item }[] = [];
  itemsSubject: Subject<Item[]>;
  addItemSubject: Subject<{ guid: string, amount: number, item: Item }[]> ;

  constructor(private httpService: HttpService, private userService: UserService) {
    this.itemsSubject = new Subject<Item[]>()
    this.addItemSubject = new Subject<{ guid: string, amount: number, item: Item }[]>();
  }
  getSelectedItemsHttp() {
    this.selectedItems = [];
    let user = this.userService.getCurrentUser();
    this.httpService.invoke({
      method: 'GET',
      url: Constants.websiteEndPoint,
      path: 'Orders' + '/GetMyOrders',
      query: { userId: user.refreshToken }
    }).subscribe(success => {
      for (var i = 0; i < success.length; i++) {
        let itemIndex = this.items.findIndex(o => { return o.guid == success[i].item });
        this.selectedItems.push({ guid: success[i].guid , item: this.items[itemIndex], amount : success[i].amount });
      }
      this.addItemSubject.next(this.selectedItems);

    },
      error => {
        this.selectedItems = [];
        this.addItemSubject.next(this.selectedItems);

      });
  }
  getAllHttp() {
    this.items = [];
    this.httpService.invoke({
      method: 'GET',
      url: Constants.websiteEndPoint,
      path: 'Items' + '/GetAllItems',
    }).subscribe(
      data => {
        this.getSelectedItemsHttp();
        if (data) {
          for (var i = 0; i < data.length; i++) {
            this.items.push(new Item(data[i].elementId, data[i].name, data[i].subName, data[i].type, data[i].price, data[i].guid));
          }
          this.itemsSubject.next(this.items);
        }
      }, error => {
        this.items = [];
        this.itemsSubject.next([]);
    });
  }
  orderItem(item: string, amount: number , notes:string) {
    let user = this.userService.getCurrentUser();
    let query = {
      userId: user.refreshToken,
      amount,
      itemId: item,
      notes:notes
    }
   return this.httpService.invoke({
      method: 'POST',
      url: Constants.websiteEndPoint,
      path: 'Orders' + '/RequestOrderItem',
      query: query
    });
  }
  removeItem(item: string) {
    return this.httpService.invoke({
      method: 'POST',
      url: Constants.websiteEndPoint,
      path: 'Items' + '/DeleteItem',
      query: { id: item }
    });
  }

}
