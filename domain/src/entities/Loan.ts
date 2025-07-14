export class Loan {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly bookId: string,
    public readonly from: Date,
    public readonly to: Date,
    public returned: boolean = false
  ) {}

  markAsReturned(): void {
    this.returned = true;
  }

  isOverdue(now: Date): boolean {
    return now > this.to && !this.returned;
  }
}
