import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No user found with that email");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // ✅ Use official NextAuth callback parameter typing
    async jwt({ token, user }) {
      if (user) {
        // add custom fields to the token
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export { authOptions };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };












// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import connectDB  from "@/app/lib/mongodb";
// import User from "@/app/models/User";
// import bcrypt from "bcryptjs";

// const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectDB();
//         const user = await User.findOne({ email: credentials?.email });
//         if (!user) throw new Error("No user found with that email");
//         const isValid = await bcrypt.compare(credentials!.password, user.password);
//         if (!isValid) throw new Error("Invalid password");
//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//   async jwt({ token, user }) {
//     if (user) {
//       token.id = user.id;
//       token.role = user.role;
//     }
//     return token;
//   },
//   async session({ session, token }) {
//     session.user.id = token.id;
//     session.user.role = token.role;
//     return session;
//   },
// },

//   pages: {
//     signIn: "/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// // ✅ Add this export line:
// export { authOptions };

// // ✅ Required default export for NextAuth handler:
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };




