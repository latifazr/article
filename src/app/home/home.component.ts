import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Observable, fromEvent } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  ajouArticleForm: FormGroup;
  modifArticleForm: FormGroup;


  articles: Observable<any[]>;
  itmesRef: AngularFireList<any>;
  items: Observable<any[]>;
  name_user: string = "";
  key: string
  data: [];

  downloadURL: any;
  uploadPercent: any;
  URL: string;
  file: any;
  filePath: any;

  public show_dialog: boolean = false;

  public show_list: boolean = false;


  constructor(private storage: AngularFireStorage, private router: Router, db: AngularFireDatabase) {
    this.articles = db.list('article').valueChanges();
    this.itmesRef = db.list('article');
    this.articles = this.itmesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    )
  }

  ngOnInit() {
    this.name_user = localStorage.getItem('token');


    this.ajouArticleForm = new FormGroup({
      ecrivant: new FormControl(this.name_user),
      image: new FormControl(''),
      titre: new FormControl('', [Validators.required]),
      description: new FormControl('', Validators.required),
      date: new FormControl(JSON.stringify(new Date())),
    })


    this.modifArticleForm = new FormGroup({
      ecrivant: new FormControl(this.name_user),
      image: new FormControl(''),
      titre: new FormControl('', [Validators.required]),
      description: new FormControl('', Validators.required),
      date: new FormControl(JSON.stringify(new Date())),
    })
  }

  toggle() {
    this.show_dialog = !this.show_dialog;
  }

  tolist() {
    this.show_list = !this.show_list;
  }

  
  



  DeleteItem(key: any) {
    this.itmesRef.remove(key);
    confirm('Delete?');
  }

  UpdateItem(article: any) {
          this.key = article.key;
          this.modifArticleForm = new FormGroup({
          ecrivant: new FormControl(article.ecrivant),
          image:  new FormControl(article.image.url),
          titre: new FormControl(article.titre),
          description: new FormControl(article.description),
          })
  }

  uploadFile(event) {
    this.file = event.target.files[0];
    this.filePath = this.file.name;
  }

  ok(form: any) {
    /*this.itmesRef.update(this.key, this.modifArticleForm.value);*/
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, this.file);
    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.downloadURL = url;
          console.log(this.downloadURL);
          var data = {
            ecrivant: this.name_user,
            image: this.downloadURL,
            titre: form.value.titre,
            description: form.value.description,
            date: JSON.stringify(new Date()),
          }
          console.log(data);
          this.itmesRef.update(this.key,data);
        });
      })
    ).subscribe();
    alert("article modifier")
  }



  onFileChanged(event) {

    const file: File = event.target.files[0];
    const metaData = { 'contentType': file.type };
    const storRef: firebase.storage.Reference = firebase.storage().ref('/' + file.name);
    const uploadTask: firebase.storage.UploadTask = storRef.put(file, metaData);
    console.log('Uploading:' + file.name);

    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
      const imageUrl = downloadURL;
      console.log('URL:' + imageUrl);
    });
    /*  let ref = this.storage.ref('test.jpg');
      ref.getDownloadURL().then(function (url) {
        console.log(url);
      });*/
  }

  deconnecter() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
