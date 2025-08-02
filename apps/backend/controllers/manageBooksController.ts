import { Request, Response } from "express";
import { addBookUseCase, updateBookUseCase, deleteBookUseCase } from "../../../domain/src/use-cases/ManageBooksUseCase";
import { bookRepo } from "./repositories";

export const addBookController = async (req: Request, res: Response) => {
  try {
    let { title, author, totalCopies } = req.body;

    title = title.toLowerCase();
    author = author.toLowerCase();

    const id = await addBookUseCase({ title, author, totalCopies }, bookRepo);
    res.status(201).json({ message: "Libro creado correctamente", id, title, author, totalCopies });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBookController = async (req: Request, res: Response) => {
  try {
    const { id, title, author, totalCopies } = req.body;
    await updateBookUseCase({ id, title, author, totalCopies }, bookRepo);
    res.status(200).json({ message: "Libro actualizado correctamente", id, title, author, totalCopies });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBookController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await deleteBookUseCase({ id }, bookRepo);
    res.status(200).json({ message: "Libro eliminado correctamente", id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
