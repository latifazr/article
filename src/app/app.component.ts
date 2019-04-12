import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'article';
  items: Observable<any[]>;
  itmesRef: AngularFireList<any>;
  constructor(db:AngularFireDatabase) {
  this.itmesRef = db.list('items');
  this.items = this.itmesRef.snapshotChanges().pipe(
    map(changes => 
       changes.map(c => ({key: c.payload.key, ...c.payload.val()  }))
       )
  )
  console.log(this.itmesRef);
}
}
