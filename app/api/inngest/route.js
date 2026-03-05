import { serve } from "inngest/next";
import { createUserOrder, inngest } from "@/config/inngest";
import {
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
} from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdation, syncUserDeletion, createUserOrder],
});
