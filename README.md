npx create-next-app@latest 

Packages and middlewares to be installed:
npm i mongoose bcryptjs cookie-parser axios next-auth@beta motion react-icons react-spinners nodemailer
react-redux @reduxjs/toolkit cloudinary

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

Note: NextAuth() doesn't return an error when your credentials are wrong. It instead returns an object like this:
{
  ok: boolean,
  error: string | null,
  status: number,
  url: string | null
}
Therefore, to know if there is any error in the login process, we must separately check for (result?.error) and handle it accordingly. Otherwise, if result?.ok, then we can proceed to the next step.

Now, Designing the register/login page

Note: we need to wrap children in SessionProvider to use useSession() hook. Since SessionProvider works only in client component, we setup another file as Provider.tsx and wrap the children in the main layout under Provider. Using this, we wrap the children in SessionProvider so that the useSession hook works perfectly.

Follow steps on Auth.js to use google provider for authentication.
After declaring Google provider in auth.ts, we need to access clientId and clientSecret from the environment variables. Now to create this user in mongoDB, we need to define the callback async signIn().

Starting with Next.js 16, Middleware is now called Proxy to better reflect its purpose. The functionality remains the same.
Proxy allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.


Note: We need to inform the next.js if we are importing or displaying images from elsewhere. Like while developing the navbar, we need user image from their google account or somewhere from cloud, then we need to specify the sources of our images or their hostnames in next.config.ts.

To remove scroll bar, we need to update globals.css. 
::-webkit-scrollbar{
    display:none;
}
*{
    scrollbar-width:none;
}

Redux solves an important problem: 
Sharing and controlling state across many parts of your app in a predictable way
(State is data that can change over time)
Redux gives you:
- One central store (single source of truth)
- Predictable updates
- Global access to state
- Time-travel debugging (DevTools)
- Decoupled UI & data logic

Core Redux concepts:
- Store: The global state container.
- Actions: Plain objects describing what happened.
- Reducers: Pure functions that decide how state changes.
- Dispatch: The only way to change state.

Setting up Redux
follow Typescript quick start documentation.
pkg's req'd: react-redux, @reduxjs/toolkit
We need to create a redux/store.ts and redux/StoreProvider.tsx.
A separate provider is required because we need to have "use client" features while the main layout.tsx is a server component. Therefore, we can create a separate StoreProvider component which is a client component and then wrap the children in the main layout in this StoreProvider.


Cloudinary:
Cloudinary is an API-based, cloud-native platform for managing, optimizing, transforming, and delivering images and videos in real-time. It automates media workflows—such as resizing, cropping, background removal, and format conversion—using AI to enhance performance and speed up website delivery. 
npm i cloudinary

