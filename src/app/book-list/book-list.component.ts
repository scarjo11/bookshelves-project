import {Component, OnDestroy, OnInit} from '@angular/core';
import {Book} from '../models/Book.model';
import {Subscription} from 'rxjs/Subscription';
import {BooksService} from '../services/books.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[];
  booksSubscription: Subscription; // pour souscrire au subject du service

  constructor(private booksService: BooksService,
              private router: Router) { }

  ngOnInit(): void {
    this.booksSubscription = this.booksService.bookSubject.subscribe(
      (books: Book[]) => {
          this.books = books; // mettre à jour l'array local avec l'array dans le service
      }
    );
    this.booksService.emitBooks();
  }

  onNewBook() {
    this.router.navigate(['/books', 'new']);
  }

  onDeleteBook(book: Book) {
    this.booksService.removeBook(book);
  }

  onViewBook(id: number) {
    this.router.navigate(['/books', 'view', id]);
  }

  ngOnDestroy() {
    this.booksSubscription.unsubscribe();
  }

}
