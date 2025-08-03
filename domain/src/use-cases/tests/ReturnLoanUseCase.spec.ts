import { describe, it, expect, vi } from "vitest";
import { returnLoanUseCase } from "../ReturnLoanUseCase";
import { Loan } from "../../entities/Loan";
import { LoanRepository } from "../../repositories/LoanRepository";

describe("ReturnLoanUseCase", () => {
  it("deberia marcar la devolucion como solicitada", async () => {
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

  it("deberia lanzar error si el prestamo no existe", async () => {
    const loanRepo: LoanRepository = {
      findById: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      create: vi.fn(),
      findActiveByUserAndBook: vi.fn()
    };
    await expect(returnLoanUseCase("loan1", loanRepo)).rejects.toThrow("Prestamo no encontrado");
  });

  it("deberia lanzar error si el prestamo ya fue devuelto", async () => {
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
    await expect(returnLoanUseCase("loan1", loanRepo)).rejects.toThrow("El prestamo ya fue devuelto");
  });

  it("deberia lanzar error si ya se solicito la devolucion", async () => {
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

    await expect(returnLoanUseCase("loan1", loanRepo)).rejects.toThrow("La devolucion ya fue solicitada");
  });
});
