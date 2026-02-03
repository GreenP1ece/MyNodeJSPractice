import Fastify from 'fastify';
import formbody from '@fastify/formbody';
import routes from './routes/index.js';

const app = Fastify();
const PORT = 3000;

await app.register(formbody);
await app.register(routes, { prefix: '/api' });
app.get('/', async (request, reply) => {
    reply.send({ message: 'Welcome to the Library API' });
});

app.setNotFoundHandler((request, reply) => {
    const {message, statusCode} = reply.error || {};
    reply.status(statusCode || 500).send({message});
});

try {
    await app.listen({ port: PORT });
    console.log(`Server is running on http://localhost:${PORT}`);
} catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
};
