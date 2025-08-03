import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { changeUserRoleController } from "../changeUserRoleController";
import { userRepo } from "../repositories";
import { createUser } from "../../../../domain/src/entities/User";

describe("changeUserRoleController", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post("/users/changeRole", (req, res) => changeUserRoleController(req, res));
    
    const userAdmin = createUser("user1", "Alex", "Alex@example.com", "123456", "admin");
    const user = createUser("user2", "Alex", "Alex@example.com", "123456", "user");
    userRepo.save(userAdmin);
    userRepo.save(user);
  });

  it("should change user role", async () => {
    const res = await request(app)
      .post("/users/changeRole")
      .send({
        adminId: "user1",
        targetUserId: "user2",
        newRole: "admin",
      });
    expect(res.status).toBe(200);
    expect(res.body)
    .toEqual({ 
      message: "Rol cambiado correctamente", 
      adminId: "user1", 
      targetUserId: "user2", 
      newRole: "admin" 
    });
    const updatedUser = await userRepo.findById("user2");
    expect(updatedUser?.role).toBe("admin");
  });

  it("should return error if user is not admin", async () => {
    const res = await request(app)
      .post("/users/changeRole")
      .send({
        adminId: "user2",
        targetUserId: "user1",
        newRole: "admin",
      });
    expect(res.status).toBe(400);
    expect(res.body)
    .toEqual({ error: "Solo los administradores pueden cambiar roles" });
  });

  it("should return error if user does not exist", async () => {
    const res = await request(app)
      .post("/users/changeRole")
      .send({
        adminId: "user1",
        targetUserId: "user3",
        newRole: "admin",
      });
    expect(res.status).toBe(400);
    expect(res.body)
    .toEqual({ error: "Usuario no encontrado" });
  });

  it("should return error if admin does not exist", async () => {
    const res = await request(app)
      .post("/users/changeRole")
      .send({
        adminId: "user3",
        targetUserId: "user2",
        newRole: "admin",
      });
    expect(res.status).toBe(400);
    expect(res.body)
    .toEqual({ error: "Usuario administrador no encontrado" });
  });

  it("should return error if role is not provided", async () => {
    const res = await request(app)
      .post("/users/changeRole")
      .send({
        adminId: "user1",
        targetUserId: "user2",
      });
    expect(res.status).toBe(400);
    expect(res.body)
    .toEqual({ error: "Falta indicar el nuevo rol" });
  });
});