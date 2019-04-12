import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  registerForm : FormGroup;
  itmesRef: AngularFireList<any>;

  constructor(db:AngularFireDatabase,private router: Router,private firebase :AngularFireAuth) { 
    this.itmesRef = db.list('items');

  }


  ngOnInit() {
    console.log('initial list',this.itmesRef)
    this.registerForm = new FormGroup({
      nom: new FormControl( '',[Validators.required]),
      prenom: new FormControl('',[]),
      date_naissance: new FormControl('',),
      lieu_naissance: new FormControl('',),
      adresse: new FormControl('',),
      email: new FormControl('',[Validators.required,Validators.email]),
      mot_de_passe: new FormControl(''),
    })
  }
 
  register(form:any){
    if(form.valid){
      this.itmesRef.push(form.value);
      this.firebase.auth.createUserWithEmailAndPassword(this.registerForm.value.email,this.registerForm.value.mot_de_passe).then(itemref => {
      alert('Innscription réussie');
      this.router.navigate(['/login']);
    });
  }
    else {
      alert('Veuillez verifier vos données');
    }
  }

}

