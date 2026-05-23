import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as usersSchema from './schema/users.schema';
import * as categoriesSchema from './schema/categories.schema';
import * as productsSchema from './schema/products.schema';
import * as cartsSchema from './schema/carts.schema';
import * as ordersSchema from './schema/orders.schema';
import * as relations from './schema/relations';

const schema = {
  ...usersSchema,
  ...categoriesSchema,
  ...productsSchema,
  ...cartsSchema,
  ...ordersSchema,
  ...relations,
};

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
export type Database = typeof db;
