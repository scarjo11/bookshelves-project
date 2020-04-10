import { Injectable } from '@angular/core';
import {Book} from '../models/Book.model';
import {Subject} from 'rxjs';
import * as firebase from 'firebase';
import {error} from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  bookSubject = new Subject<Book[]>(); // Va émettre l'array

  constructor() {
    this.getBooks();
  }

  emitBooks() {
    this.bookSubject.next(this.books);
  }

  saveBooks() {
  firebase.database().ref('/books').set(this.books); // "ref" retourne une référence à un node (lien) de la BDD. "set" marche comme put
  }

  getBooks() {
    firebase.database().ref('/books')
      // tslint:disable-next-line:max-line-length
      .on('value', (data) => { // "on" permet de réagir à des évènements venant de la BDD, et continuer à chaque fois qu'une valeur sera modifiée. "data" contient la valeur des données retournées par le serveur
        this.books = data.val() ? data.val() : [];
        this.emitBooks();
      });
  }

  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        firebase.database().ref('/books/' + id).once('value').then( // "once" car contrairement à "on", on a juste besoin de récupérer les données une fois
          (data) => {
            resolve(data.val());
            // tslint:disable-next-line:no-shadowed-variable
          }, (error) => {
            reject(error);
        }
        );
      }
    );
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    if (book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo supprimée !');
        }
      ).catch(
        // tslint:disable-next-line:no-shadowed-variable
        (error) => {
          console.log('Fichier non trouve : ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookElement) => {
        if (bookElement === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1); // "splice" pour retirer le book, puis on indique le nb de book à retirer
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref() // upload du fichier. "Ref" quand on dit rien, indique la racine du stockage
          .child('images/' + almostUniqueFileName + file.name)
          .put(file);
        // tslint:disable-next-line:max-line-length
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED, // Réagir au évènement lié à l'upload. Ici à chaque changement d'état du téléchargement
          () => {
            console.log('Chargement...');
          },
          // tslint:disable-next-line:no-shadowed-variable
          (error) => {
            console.log('Erreur de chargement : ' + error);
            reject();
          },
          () => {
            // tslint:disable-next-line:max-line-length
            resolve(upload.snapshot.ref.getDownloadURL()); // LURL direct direct à l'image dans le storage. Pr enregistrer dans BDD, lier au livre, et afficher
          }
          );
      }
    );
  }


}
