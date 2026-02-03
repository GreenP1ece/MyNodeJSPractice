import fastify from "fastify" ;
import Book from "../models/book.js";

async function booksRouter(fastify, options) {
    fastify.get("/:id", async (request, reply) => {
        const { id } = request.params;
        try {
            const book = await Book.findByPk(id);
            reply.send(book);
        } catch(error) {
            reply.status(500).send({error: error.message});
        }
    });
    fastify.get("/", async (request, reply) => {
        try {
            const books = await Book.findAll();
            reply.send(books);
        } catch(error) {
            reply.status(500).send({error: error.message});
        }
    });
    fastify.delete("/:id", async (request, reply) => {
        const { id } = request.params;
        try {
            const book = await Book.destroy({where: {id}});
            reply.send({book});
        } catch(error) {
            reply.status(500).send({error: error.message});
        }
    });

    fastify.put("/:id", async (request, reply) => {
        const { id } = request.params;
        const { title, author } = request.body;
        try {
            const book = await Book.update({title, author}, {where: {id}});
            reply.send(book);
        } catch(error) {
            reply.status(500).send({error: error.message});
        }
    });

    fastify.post("/", async (request, reply) => {
        const { title, author} = request.body;
        try{
            const existingBook = await Book.findOne({where: {title}});
            if (existingBook) {
                const book = await Book.update({count: existingBook.count + 1}, {where: {title}});
                return reply.send(book);
            }
            const book = await Book.create({title, author});
            reply.send(book);
        } catch(error) {
            reply.status(500).send({error: error.message}); 
        }
    });
};
export default booksRouter;