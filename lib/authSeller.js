import { clerkClient } from "@clerk/nextjs/server";

const authSeller = async (userId) => {
  if (!userId) return false;
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return user.publicMetadata.role === "seller";
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Auth seller err", error)
    return false;
  }
};

export default authSeller;
