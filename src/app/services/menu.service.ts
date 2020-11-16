import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Menu} from '../model/menu';
import {Calendar} from '../model/calendar';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private store: AngularFirestore) { }

  public saveMenus(menus: Menu[]): Promise<void> {
    const batch = this.store.firestore.batch();
    menus.forEach((menu: Menu) => {
      const calendarRef = this.store.collection<Menu>('menu').ref.doc();
      batch.set(calendarRef, menu);
    });
    return batch.commit();
  }
}
