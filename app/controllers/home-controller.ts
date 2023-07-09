import { Request, Response } from "express";
import prisma from "../../server/database/prismaClient";

export default class Home {
    async getHomePage(req: Request, res: Response) {
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

        res.render("pages/index.ejs", {
            page: "home",
            data: {
                products
            }
        });
    }
}