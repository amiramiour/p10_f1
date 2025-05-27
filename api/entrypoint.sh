#!/bin/sh
npx prisma migrate deploy --schema=src/prisma/schema.prisma
npx prisma generate --schema=src/prisma/schema.prisma
npx ts-node app.ts