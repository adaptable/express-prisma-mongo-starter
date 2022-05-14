/**
 * REST endpoint for /todos
 */

const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();

const prisma = new PrismaClient();

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

router.post("/", asyncMiddleware(async (req, res) => {
  const { title, done } = req.body;

  const result = await prisma.TodoItem.create({
    data: {
      title,
      done,
    }
  });
  res.json(result);
}));

router.get('/', asyncMiddleware(async (req, res) => {
  const todos = await prisma.TodoItem.findMany();
  res.json(todos);
}));

router.patch('/:id', asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const updated = await prisma.TodoItem.update({
    where: { id },
    data: req.body,
  });
  res.json(updated);
}));


module.exports = router;
