import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email : string="";
  password : string="";
  registerForm : FormGroup;
  itmesRef: AngularFireList<any>;
  items: any;

  constructor(db:AngularFireDatabase,private router: Router,private fire :AngularFireAuth) {
    this.itmesRef = db.list('items');
    this.items = this.itmesRef.snapshotChanges().pipe(
      map(changes => 
         changes.map(c => ({key: c.payload.key, ...c.payload.val()  }))
         )
    )
   }

  ngOnInit() {
  }
 
  login(){
    this.fire.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(user=>{
     //   localStorage.setItem('token', user.user['_this.email']);
        this.router.navigate(['/home'])
      }).catch(errru=>{
        alert('you cant login')
      })
   
     this.itmesRef.valueChanges().forEach(element => {
      element.forEach(users => {
        if ( users.email === this.fire.auth.currentUser.email) {
        localStorage.setItem('token', users.prenom);
        }
      })
    });
     }

  inscri(){
    this.router.navigate(['/register']);
  }
}
