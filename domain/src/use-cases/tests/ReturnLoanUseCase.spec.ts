import { describe, it, expect, vi } from "vitest";
import { returnLoanUseCase } from "../ReturnLoanUseCase";
import { Loan } from "../../entities/Loan";
import { LoanRepository } from "../../repositories/LoanRepository";

describe("ReturnLoanUseCase", () => {
  it("debería marcar la devolución como solicitada", async () => {
    const loan: Loan = {
      id: "loan1",
      userId: "user1",
      bookId: "book1",
      from: new Date(),
      to: new Date(),
      returned: false,
      approved: true,
      returnRequested: false
    };
    const loanRepo: LoanRepository = {
      findById: vi.fn().mockResolvedValue(loan),
      save: vi.fn().mockResolvedValue(undefined),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      create: vi.fn(),
      findActiveByUserAndBook: vi.fn()
    };
    await returnLoanUseCase("loan1", loanRepo);
    expect(loan.returnRequested).toBe(true);
    expect(loanRepo.save).toHaveBeenCalledWith(loan);
  });

  it("debería lanzar error si el préstamo no existe", async () => {
    const loanRepo: LoanRepository = {
      findById: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      create: vi.fn(),
      findActiveByUserAndBook: vi.fn()
    };
    await expect(returnLoanUseCase("loan1", loanRepo)).rejects.toThrow("Préstamo no encontrado");
  });

  it("debería lanzar error si el préstamo ya fue devuelto", async () => {
    const loan: Loan = {
      id: "loan1",
      userId: "user1",
      bookId: "book1",
      from: new Date(),
      to: new Date(),
      returned: true,
      approved: true,
      returnRequested: false
    };
    const loanRepo: LoanRepository = {
      findById: vi.fn().mockResolvedValue(loan),
      save: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      create: vi.fn(),
      findActiveByUserAndBook: vi.fn()
    };
    await expect(returnLoanUseCase("loan1", loanRepo)).rejects.toThrow("El préstamo ya fue devuelto");
  });

  it("debería lanzar error si ya se solicitó la devolución", async () => {
    const loan: Loan = {
      id: "loan1",
      userId: "user1",
      bookId: "book1",
      from: new Date(),
      to: new Date(),
      returned: false,
      approved: true,
      returnRequested: true
    };

    const loanRepo: LoanRepository = {
      findById: vi.fn().mockResolvedValue(loan),
      save: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      create: vi.fn(),
      findActiveByUserAndBook: vi.fn()
    };

    await expect(returnLoanUseCase("loan1", loanRepo)).rejects.toThrow("La devolución ya fue solicitada");
  });
});
