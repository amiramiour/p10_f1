#!/bin/sh
npx prisma migrate deploy
npx prisma generate
npx ts-node app.ts