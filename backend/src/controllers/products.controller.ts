import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../conf/dbConnection.ts";

export class ProductController {
  public async getProducts(_req: Request, res: Response) {
    try {
      const [products] = await pool.execute(
        "select id, name, price, stock, description, brand, img from products where active = true",
      );
      res.json(products);
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async getProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "invalid id" });
      }

      const [products] = await pool.execute<RowDataPacket[]>(
        "select id, name, price, stock, description, brand, img from products where id = ? AND active = TRUE",
        [id],
      );
      if (!products[0]) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.json(products[0]);
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async createProduct(req: Request, res: Response) {
    try {
      const { name, stock, description, brand, img } = req.body;
      const price = Number(req.body.price);
      if (Number.isNaN(price) || price <= 0) {
        return res.status(400).json({ message: "invalid price" });
      }

      await pool.execute(
        "insert into products (name, price, stock, description, brand, img) values (?, ?, ?, ?, ?, ?)",
        [name, price, stock, description, brand, img],
      );
      res.status(201).json({ message: "product created" });
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "invalid id" });
      }

      const { name, stock, description, brand, img } = req.body;
      const price = Number(req.body.price);
      if (Number.isNaN(price) || price <= 0) {
        return res.status(400).json({ message: "invalid price" });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "update products set name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? where id = ?",
        [name, price, stock, description, brand, img, id],
      );
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.json({ message: "product updated" });
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "invalid id" });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "update products set active = false where id = ?",
        [id],
      );
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.json({ message: "product deleted" });
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async changeProductPrice(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "invalid id" });
      }

      const price = Number(req.body.price);
      if (Number.isNaN(price) || price <= 0) {
        return res.status(400).json({ message: "invalid price" });
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "update products set price = ? where id = ?",
        [price, id],
      );
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.json({ message: "product price updated" });
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }
}