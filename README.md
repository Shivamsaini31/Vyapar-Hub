npx create-next-app@latest 

Packages and middlewares to be installed:
npm i mongoose dotenv bcryptjs jsonwebtoken cookie-parser axios

Start with creating required models(app/model)
1. User model(model/user.model.ts)

Connect MongoDB
1. The URI has to be kept secret and is thus stored in the .env files. 
.env.local has higher priority than .env and is thus preferred for storing environment variables in local development or production.
2. Create a lib or util folder to store reusable utility files.
3. In lib, create connectDB.ts
4. We declare mongoose as a global variable in src/globals.d.ts. This stores the variables that can be accessed globally.
5. Since NextJS works with multiple servers, and it reloads the server many times, it may cause several connections on our DB thus overloading it. Thus, we maintain the cached connection.
6. Create and export the connectDB function.


