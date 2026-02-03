import Fastify from 'fastify';
import ejs from 'ejs';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import {join} from 'path';
import operatingHours from "./data/operatingHours.js";
import menuItems from "./data/menuItems.js";

const publicPath = join(process.cwd(), 'public');
const app = Fastify();
const port = 3000;
const today = new Date().getDay();

app.register(fastifyStatic, {
  root: publicPath,
  prefix: '/public/',
});

app.register(fastifyView, {
  engine: {
    ejs: ejs
  }
});

app.get('/', (req, reply) => {
  reply.view('views/index.ejs', { name: "What's Fare is Fair" });
});

// Маршрут для получения меню
app.get('/menu', (req, reply) => {
  reply.view('views/menu.ejs', { menuItems });
});

// Маршрут для получения часов работы
app.get('/hours', (req, reply) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  reply.view('views/hours.ejs', { operatingHours, days, today});
});

app.get('/about', (req, reply) => {
  reply.view('views/about.ejs');
});

app.listen({
  host: '127.0.0.1',
  port: port 
}, (err, address) => {
  if (err) throw err;
  console.log(`Server is running at ${address}`);
});