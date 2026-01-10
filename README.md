npx create-next-app@latest 

Packages and middlewares to be installed:
npm i mongoose dotenv bcryptjs jsonwebtoken cookie-parser axios next-auth@beta

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


Create Register API
location: src/app/api/auth/register/route.ts
After a user registers, We redirect them to the login page. Token generation and session creation is all handled in the auth.ts using Next-Auth. 

Authenticating using NextAuth
1. Go to Auth.js and follow the installation instructions.
2. npx auth secret is used to generate a secret AUTH_SECRET which is the only necessary environment variable. It is auto added to .env.local
3. We use "Credentials" provider to handle signing in with arbitrary credentials, such as a username and password, domain, two factor authentication or hardware device (e.g. YubiKey U2F / FIDO).
It is intended to support use cases where you have an existing system you need to authenticate users against, and therefore users authenticated in this manner are not persisted in the database.
Other providers like google, github, etc. can also be used.
4. We write login logic in credentials provider in auth.ts.
- Credentials provider has fields like credentials and authorize.
- credentials define what fields are required for authentication or what is expected from the login form, eg: email, password.
- authorize() decides whether the user is allowed to login or not. 
5. callbacks let you modify what gets stored.
- jwt callback runs when the user logs in or whenever JWT is updated.
- session callback runs when frontend asks for session data.
JWT->session->Frontend
6. session functions defines the strategy and maxAge of session. We use the strategy as "jwt", so there are no DB sessions and everything is stored in JWT. maxAge can be used to define the max time a user stays login.
7. pages are used to define the routes where login, error redirection, etc takes place.