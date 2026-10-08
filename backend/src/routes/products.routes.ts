import { Router } from "express";
import { ProductController } from "../controllers/products.controller.ts";

const productController = new ProductController();
const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id', productController.changeProductPrice);


export default router;
//localhost:3000/api/v1/products -PUT
//localhost:3000/api/v1/products -GET