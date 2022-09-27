# Create T3 App


### Connect to DB
$ pscale connect rent-app initial-setup --port 3309
### push schema to db
$ npx prisma db push
### format the prisma file
$ npx prisma format

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.
