import connectDB from "@/config/db";
import User from "@/models/User";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }
    await connectDB();
    let user = await User.findById(userId);
    if (!user) {
      const client =
        typeof clerkClient === "function" ? await clerkClient() : clerkClient;
      const clerkUser = await client.users.getUser(userId);
      const primaryEmail =
        clerkUser.emailAddresses?.[0]?.emailAddress ||
        `${userId}@no-email.local`;
      const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
      const userData = {
        _id: clerkUser.id,
        email: primaryEmail,
        name: fullName || clerkUser.username || "Kupac",
        imageUrl: clerkUser.imageUrl || "",
      };
      user = await User.create(userData);
    }
    const userData = user.toObject();
    const cartItems = userData.cartItems ?? userData.cartItem ?? {};
    return NextResponse.json({
      success: true,
      user: { ...userData, cartItems },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
