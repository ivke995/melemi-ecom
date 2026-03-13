"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = (process.env.NEXT_PUBLIC_CURRENCY || "KM").trim();
  const router = useRouter();
  const { user } = useUser();

  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const guestCartKey = "guest-cart";

  const fetchProductData = async () => {
    setProductsLoading(true);
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user.publicMetadata.role === "seller") {
        setIsSeller(true);
      }

      const token = await getToken();
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems || {});
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Stavka je dodata u korpu");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Korpa je ažurirana");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const clearCart = async () => {
    const cartData = {};
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Korpa je ispražnjena");
      } catch (error) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Korpa je ispražnjena");
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getProductPrice = (product) => {
    if (!product) return 0;
    if (product.showDiscount === false) {
      return product.price ?? product.offerPrice ?? 0;
    }
    return product.offerPrice ?? product.price ?? 0;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0 && itemInfo) {
        totalAmount += getProductPrice(itemInfo) * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    if (user) return;
    if (typeof window === "undefined") return;
    const storedCart = window.localStorage.getItem(guestCartKey);
    if (!storedCart) return;
    try {
      const parsedCart = JSON.parse(storedCart);
      if (parsedCart && typeof parsedCart === "object") {
        setCartItems(parsedCart);
      }
    } catch {
      window.localStorage.removeItem(guestCartKey);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) {
      window.localStorage.removeItem(guestCartKey);
      return;
    }
    window.localStorage.setItem(
      guestCartKey,
      JSON.stringify(cartItems || {}),
    );
  }, [cartItems, user]);

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    productsLoading,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    clearCart,
    getCartCount,
    getProductPrice,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
