import { Request, Response } from "express";
import prisma from "../../server/database/prismaClient";
import { validationResult } from "express-validator";
import { Prisma } from "@prisma/client";

export default class Category {
    createCategoryPage(req: Request, res: Response) {
        res.render("pages/create-category.ejs", {
            page: "create-category",
            data: {
            }
        })
    }

    async categoriesPage(req: Request, res: Response) {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc"
            },
            select: {
                name: true
            }
        })

        res.render("pages/list-categories.ejs", {
            page: "list-categories",
            data: {
                categories
            }
        })
    }

    async createCategory(req: Request, res: Response) {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.render("pages/create-category.ejs", {
                page: "create-category",
                data: {
                    errors
                }
            })
        }

        const { name } = req.body;

        try {
            await prisma.category.create({
                data: {
                    name
                }
            })
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                res.redirect("/")
                // Redirecionar para uma página de erro
            }
        }

        res.redirect("/");
    }
}