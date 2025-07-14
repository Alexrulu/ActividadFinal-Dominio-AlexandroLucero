export class Book {
  constructor(
    public readonly id: string,
    public title: string,
    public author: string,
    public totalCopies: number,
    public borrowedCopies: number = 0
  ) {}

  hasAvailableCopies(): boolean {
    return this.borrowedCopies < this.totalCopies;
  }

  borrow(): void {
    if (!this.hasAvailableCopies()) {
      throw new Error("No hay más copias disponibles.");
    }
    this.borrowedCopies++;
  }

  return(): void {
    if (this.borrowedCopies > 0) {
      this.borrowedCopies--;
    } else {
      throw new Error("No hay copias para devolver.");
    }
  }
}

