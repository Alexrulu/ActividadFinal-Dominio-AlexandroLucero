import { Book } from "../../../domain/src/entities/Book";
import { BookRepository } from "../../../domain/src/repositories/BookRepository";

export class BookRepositoryGoogle implements BookRepository {
  async findById(id: string): Promise<Book | null> {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
    const data = await res.json();

    if (!data.id) return null;

    return {
      id: data.id,
      title: data.volumeInfo.title,
      author: data.volumeInfo.authors?.join(", "),
      totalCopies: 0,
      borrowedCopies: 0,
      thumbnail: data.volumeInfo.imageLinks?.thumbnail || "",
    };
  }

  async findByTitleAndAuthor(title: string, author: string): Promise<Book | null> {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`
    );
    const data = await res.json();
    if (!data.items?.length) return null;

    const book = data.items[0];
    return {
      id: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.join(", "),
      totalCopies: 0,
      borrowedCopies: 0,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
    };
  }

  async findAll(params: { page: number; limit: number }): Promise<Book[]> {
    const { page, limit } = params;
    const startIndex = (page - 1) * limit;

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=programming&startIndex=${startIndex}&maxResults=${limit}`
    );
    const data = await res.json();

    return (
      data.items?.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(", "),
        totalCopies: 1,
        borrowedCopies: 0,
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
      })) || []
    );
  }

  async save(_book: Book): Promise<void> {
    throw new Error("Google Books API es de solo lectura en este repositorio.");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("Google Books API es de solo lectura en este repositorio.");
  }
}
