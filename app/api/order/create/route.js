import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Address from "@/models/Address";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    await connectDB();
    const { address, items } = await request.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Neispravni podaci" });
    }

    let orderUserId = userId;
    let orderAddressId = address;
    let addressState = "";

    if (!userId) {
      const { fullName, phoneNumber, pincode, area, city, state } =
        address || {};
      if (!fullName || !phoneNumber || !pincode || !area || !city || !state) {
        return NextResponse.json({
          success: false,
          message: "Nedostaju podaci za dostavu",
        });
      }
      const guestId = `guest-${randomUUID()}`;
      const guestAddress = await Address.create({
        fullName,
        phoneNumber,
        pincode,
        area,
        city,
        state,
        userId: guestId,
      });
      orderUserId = guestId;
      orderAddressId = guestAddress._id;
      addressState = state;
    } else if (!address || typeof address !== "string") {
      return NextResponse.json({
        success: false,
        message: "Molimo izaberite adresu",
      });
    } else {
      const selectedAddress = await Address.findById(address);
      if (!selectedAddress) {
        return NextResponse.json({
          success: false,
          message: "Adresa nije pronađena",
        });
      }
      addressState = selectedAddress.state;
    }
    // calculate amount using items
    const amount = await items.reduce(async (accPromise, item) => {
      const acc = await accPromise;
      const product = await Product.findById(item.product);
      if (!product) return acc;
      const unitPrice =
        product.showDiscount === false ? product.price : product.offerPrice;
      return acc + unitPrice * item.quantity;
    }, 0);

    const normalizedCountry = addressState
      ? addressState.toLowerCase().trim().replace(/\s+/g, " ")
      : "";
    const isBosnia =
      normalizedCountry === "bosna i hercegovina" || normalizedCountry === "bih";
    const isSerbia = normalizedCountry === "srbija";
    const shippingCost = isBosnia ? 9 : isSerbia ? 22 : 0;
    const taxAmount = 0;

    await inngest.send({
      name: "order/created",
      data: {
        userId: orderUserId,
        address: orderAddressId,
        items,
        amount: amount + taxAmount + shippingCost,
        date: Date.now(),
      },
    });

    // clear user cart
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.cartItems = {};
        await user.save();
      }
    }

    return NextResponse.json({ success: true, message: "Narudžba je kreirana" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
