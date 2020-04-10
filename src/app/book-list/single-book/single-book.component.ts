import { Component, OnInit } from '@angular/core';
import {Book} from '../../models/Book.model';
import {ActivatedRoute, Router} from '@angular/router';
import {BooksService} from '../../services/books.service';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.scss']
})
export class SingleBookComponent implements OnInit {

  book: Book;

  constructor(private route: ActivatedRoute, // pour récupérer l'identifiant de l'URL
              private booksService: BooksService,
              private router: Router) { }

  ngOnInit(): void {
    this.book = new Book('', ''); // on créer un book vide temporaire pour attendre que le book soit récupéré dans le serveur
    const id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(+id).then(
      (book: Book) => {
        this.book = book;
      }
    );
  }

  onBack() {
    this.router.navigate(['/books']);
  }

}
