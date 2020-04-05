import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    var firebaseConfig = {
      apiKey: "AIzaSyCnvqUv-yt0FsEFCK91NMAfqypNlN0kRs8",
      authDomain: "bookshelves-project-f8012.firebaseapp.com",
      databaseURL: "https://bookshelves-project-f8012.firebaseio.com",
      projectId: "bookshelves-project-f8012",
      storageBucket: "bookshelves-project-f8012.appspot.com",
      messagingSenderId: "654323309621",
      appId: "1:654323309621:web:5af5e17372d878d276a57c"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}
