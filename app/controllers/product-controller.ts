import { Request, Response } from "express";
import prisma from "../../server/database/prismaClient";
import { Prisma } from "@prisma/client";
import { validationResult } from "express-validator";

export default class Product {
	async createProductPage(req: Request, res: Response) {
        const categoryNameList = await prisma.category.findMany({
            orderBy: {
                name: "desc"
            },
            select: {
                id: true,
                name: true
            }
        })

		res.render("pages/create-product.ejs", {
			page: "create-product",
            data: {
                categoryNameList
            }
		});
	}

    productCreatedPage(req: Request, res: Response) {
        const { name } = req.query;

        res.render("pages/product-created.ejs", {
            page: "product-created",
            data: {
                name
            }
        })
    }

    async productsPage(req: Request, res: Response) {
        const products = await prisma.product.findMany({
            orderBy: {
                name: "asc"
            },
            select: {
                name: true,
                stock: true,
                price: true,
                categories: {
                    select: {
                        name: true
                    }
                }
            }
        })

        res.render("pages/list-products.ejs", {
            page: "list-products",
            data: {
                products
            }
        });
    }

    async productPage(req: Request, res: Response) {
        try {
            const productSelected = req.params.name;

            const product = await prisma.product.findUnique({
                where: {
                    name: productSelected
                },
                select: {
                    name: true,
                    stock: true,
                    price: true,
                    updated_at: true,
                    categories: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            res.render("pages/product.ejs", {
                page: "product",
                data: {
                    product
                }
            })
        } catch (err) {
            return res.redirect('/')
        }
    }

	async createProduct(req: Request, res: Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const categoryNameList = await prisma.category.findMany({
                orderBy: {
                    name: "desc"
                },
                select: {
                    id: true,
                    name: true
                }
            })

            return res.render("pages/create-product.ejs", {
                page: "create-product",
                data: {
                    categoryNameList,
                    errors
                }
            })
        }

        const { name, stock, price, category } = req.body;

        try {
            await prisma.product.create({
                data: {
                    name,
                    price: Number(price),
                    stock: Number(stock),
                    categories: {
                        connect: Array.from<number>(category).map((id: number) => ({ id: Number(id) }))
                    }
                }
            })
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                res.redirect("/")
                // Redirecionar para uma página de erro
            }
        }

        res.redirect(`product-created?name=${name}`);
    }
}
