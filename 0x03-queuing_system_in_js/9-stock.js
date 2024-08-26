import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';

const client = createClient();
const app = express();
const PORT = 1245;

client
  .on('connect', () => {})
  .on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err}`);
  });

const products = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4,
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10,
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5,
  },
];

function getItemById(id) {
  const item = products.find((obj) => obj.itemId === id);

  if (!item) {
    return;
  }

  return Object.fromEntries(Object.entries(item));
}

function reserveStockById(itemId, stock) {
  client.hset('item', itemId, stock);
}

async function getCurrentReservedStockById(itemId) {
  const asyncClientGet = promisify(client.hget).bind(client);
  return asyncClientGet('item', itemId);
}

app.get('/list_products', (_, res) => {
  res.json(products).end();
});

app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    res.json({ status: 'Product not found' }).end();
    return;
  }

  const reservedCount = await getCurrentReservedStockById(itemId);

  item.currentQuantity =
    item.initialAvailableQuantity - parseInt(reservedCount);
  res.json(item).end();
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    res.json({ status: 'Product not found' }).end();
    return;
  }

  if (item.initialAvailableQuantity === 0) {
    res.json({ status: 'Not enough stock available', itemId: itemId }).end();
    return;
  }

  const reservedCount = await getCurrentReservedStockById(itemId);

  reserveStockById(itemId, parseInt(reservedCount) + 1);
  item.initialAvailableQuantity -= 1;

  res.json({ status: 'Reservation confirmed', itemId: itemId }).end();
});

app.listen(PORT);
