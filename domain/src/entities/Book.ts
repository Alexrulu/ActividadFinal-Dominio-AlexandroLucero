export interface Book {
  id: string
  title: string
  author: string
  totalCopies: number
  borrowedCopies: number
  thumbnail?: string
}

export function hasAvailableCopies(book: Book): boolean {
  return book.borrowedCopies < book.totalCopies
}

export function borrowBook(book: Book): Book {
  if (!hasAvailableCopies(book)) {
    throw new Error("No hay más copias disponibles.")
  }
  return {
    ...book,
    borrowedCopies: book.borrowedCopies + 1,
  }
}

export function returnBook(book: Book): Book {
  if (book.borrowedCopies <= 0) {
    throw new Error("No hay copias para devolver.");
  }
  return {
    ...book,
    borrowedCopies: book.borrowedCopies - 1,
  };
}
