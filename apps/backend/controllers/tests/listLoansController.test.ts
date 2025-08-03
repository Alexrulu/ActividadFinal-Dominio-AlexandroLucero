import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { listLoansController } from "../listLoansController";
import { LoanRepositoryMemory } from "../../infrastructure/loanRepositoryMemory";
import { createLoan } from "../../../../domain/src/entities/Loan";
import { approveLoan } from "../../../../domain/src/entities/Loan";

describe("listLoansController", () => {
  let app: express.Express;
  const loanRepo = new LoanRepositoryMemory();

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post("/loans/list", (req, res) => listLoansController(req, res));

    const loan = createLoan({
      id: "loan1",
      userId: "user1",
      bookId: "book1",
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    const loan2 = createLoan({
      id: "loan2",
      userId: "user2",
      bookId: "book2",
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    loanRepo.create(loan);
    approveLoan(loan);
    loanRepo.create(loan2);
    approveLoan(loan2);
    loan2.returnRequested = true;

    loanRepo.clear();
  });

  it("should list all loans if requester is admin", async () => {
    const res = await request(app)
    .post("/loans/list")
    .send({ requesterId: "user2", requesterRole: "admin" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Prestamos obtenidos correctamente");
    expect(res.body.loans).toHaveLength(2);
    expect(res.body.loans[0].id).toBe("loan1");
    expect(res.body.loans[0].userId).toBe("user1");
    expect(res.body.loans[0].bookId).toBe("book1");
    expect(res.body.loans[0].from).toBeDefined();
    expect(res.body.loans[0].to).toBeDefined();
    expect(res.body.loans[0].returnRequested).toBe(false);
    expect(res.body.loans[0].returned).toBe(false);
    expect(res.body.loans[0].approved).toBe(true);
    expect(res.body.loans[1].id).toBe("loan2");
    expect(res.body.loans[1].userId).toBe("user2");
    expect(res.body.loans[1].bookId).toBe("book2");
    expect(res.body.loans[1].from).toBeDefined();
    expect(res.body.loans[1].to).toBeDefined();
    expect(res.body.loans[1].returnRequested).toBe(true);
    expect(res.body.loans[1].returned).toBe(false);
    expect(res.body.loans[1].approved).toBe(true);
  });

  it("should list all loans if requester is user", async () => {
    const res = await request(app)
    .post("/loans/list")
    .send({ requesterId: "user1", requesterRole: "user" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Prestamos obtenidos correctamente");
    expect(res.body.loans).toHaveLength(1);
    expect(res.body.loans[0].id).toBe("loan1");
    expect(res.body.loans[0].userId).toBe("user1");
    expect(res.body.loans[0].bookId).toBe("book1");
    expect(res.body.loans[0].from).toBeDefined();
    expect(res.body.loans[0].to).toBeDefined();
    expect(res.body.loans[0].returnRequested).toBe(false);
    expect(res.body.loans[0].returned).toBe(false);
    expect(res.body.loans[0].approved).toBe(true);
  });

  it("should return error if requester user have no loans", async () => {
    const res = await request(app)
    .post("/loans/list")
    .send({ requesterId: "user3", requesterRole: "user" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("No se encontraron prestamos");
  });

  it("should return error if no requesterId is provided", async () => {
    const res = await request(app)
    .post("/loans/list")
    .send({ requesterRole: "user" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Falta el ID del usuario");
  });

  it("should return error if no requesterRole is provided", async () => {
    const res = await request(app)
    .post("/loans/list")
    .send({ requesterId: "user1" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Falta el rol del usuario");
  });

});