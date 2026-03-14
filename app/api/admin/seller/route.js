import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const client =
      typeof clerkClient === "function" ? await clerkClient() : clerkClient;
    const adminUser = await client.users.getUser(userId);
    const adminRole = adminUser.publicMetadata?.role;
    if (adminRole !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const { userId: targetUserId, isSeller } = await request.json();
    if (!targetUserId || typeof isSeller !== "boolean") {
      return NextResponse.json({
        success: false,
        message: "Invalid payload",
      });
    }

    const targetUser = await client.users.getUser(targetUserId);
    const publicMetadata = { ...(targetUser.publicMetadata || {}) };
    if (isSeller) {
      publicMetadata.role = "seller";
    } else {
      delete publicMetadata.role;
    }

    await client.users.updateUser(targetUserId, { publicMetadata });

    return NextResponse.json({
      success: true,
      userId: targetUserId,
      role: publicMetadata.role || null,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
