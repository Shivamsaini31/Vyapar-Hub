import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/connectDB";
import User from "./model/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        // Add your own logic here to find the user and verify credentials
        await connectDB();
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("No user found with the given email");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        return { // anything returned here will be saved in the user object of next-auth
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Google({
      clientId:process.env.AUTH_GOOGLE_ID,
      clientSecret:process.env.AUTH_GOOGLE_SECRET
    })
  ],
  callbacks: {
    async signIn({user,account}){
      if(account?.provider =="google"){
        await connectDB();
        let DBUser= await User.findOne({email:user.email});
        if(!DBUser){
          DBUser=await User.create({
            name:user.name,
            email:user.email,
            image:user.image
          })
        }
        user.id=DBUser._id.toString();
        user.role=DBUser.role.toString();
      }
      return true;
    },

    //the user defined in next-auth has several properties. But it doesn't specifically have role defined. 
    // Therefore, we need to create our own user in @/next-auth.d.ts
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({session,token}){
      if(session.user){
        session.user.id= token.id as string;
        session.user.role= token.role as string;        
        session.user.name= token.name as string;
        session.user.email= token.email as string;
      }
      return session;
    }
  },
  pages:{
    signIn:"/login",
    error:"/login"
  },
  session:{
    strategy:"jwt",
    maxAge: 10*24*60*60*1000,
  },
  secret: process.env.AUTH_SECRET,
});
