import { Router } from "express";
import Home from "../controllers/home-controller";
import Product from "../controllers/product-controller";
import Category from "../controllers/category-controller";
import { body } from "express-validator";

const router = Router();

const HomeController = new Home();
const ProductController = new Product();
const CategoryController = new Category();

// * HOME

router.get("/",
HomeController.getHomePage);

// * PRODUCT

router.get("/create-product",
ProductController.createProductPage);

router.get("/product-created",
ProductController.productCreatedPage);

router.get("/list-products",
ProductController.productsPage);

router.get("/product/:name",
ProductController.productPage);

router.post("/create-product",
body('name').isLength({min: 1}).withMessage("Digite um nome!"),
body('stock').isInt({min: 0}).withMessage("O estoque deve ser maior que 0!"),
body('price').isFloat({min: 0}).withMessage("O preço deve ser maior que 0!"),
body('category').notEmpty().withMessage("Selecione uma categoria!"),
ProductController.createProduct);

// * CATEGORY

router.get("/create-category",
CategoryController.createCategoryPage);

router.get("/list-categories",
CategoryController.categoriesPage);

router.post("/create-category",
body('name').isLength({min: 1}).withMessage("Digite um nome!"),
CategoryController.createCategory);

export default router;