import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItems,
    setCartItems,
  } = useAppContext();

  const countryOptions = ["Bosna i Hercegovina", "Srbija"];

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [guestAddress, setGuestAddress] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
  });

  const [userAddresses, setUserAddresses] = useState([]);

  const selectedCountry = user ? selectedAddress?.state : guestAddress.state;
  const normalizedCountry = selectedCountry
    ? selectedCountry.toLowerCase().trim()
    : "";
  const isBosnia =
    normalizedCountry === "bosna i hercegovina" || normalizedCountry === "bih";
  const isSerbia = normalizedCountry === "srbija";
  const shippingCost = isBosnia ? 9 : isSerbia ? 22 : 0;
  const totalAmount = getCartAmount() + shippingCost;

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        } else {
          setSelectedAddress(null);
        }
      } else {
        toast.error(data.message || "Greška pri učitavanju adresa");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {
      let cartItemsArray = Object.keys(cartItems).map((key) => ({
        product: key,
        quantity: cartItems[key],
      }));
      cartItemsArray = cartItemsArray.filter((item) => item.quantity > 0);

      if (cartItemsArray.length === 0) {
        return toast.error("Korpa je prazna");
      }

      let data;

      if (user) {
        if (!selectedAddress) {
          return toast.error("Molimo izaberite adresu");
        }
        const token = await getToken();
        const response = await axios.post(
          "/api/order/create",
          {
            address: selectedAddress._id,
            items: cartItemsArray,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        data = response.data;
      } else {
        const { fullName, phoneNumber, pincode, area, city, state } =
          guestAddress;
        if (!fullName || !phoneNumber || !pincode || !area || !city || !state) {
          return toast.error("Molimo popunite sva polja za dostavu");
        }
        const response = await axios.post("/api/order/create", {
          address: guestAddress,
          items: cartItemsArray,
        });
        data = response.data;
      }

      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        if (typeof window !== "undefined" && !user) {
          window.localStorage.removeItem("guest-cart");
        }
        router.push("/narudzba-uspjesna");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Pregled narudžbe
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          {user ? (
            <>
              <label className="text-base font-medium uppercase text-gray-600 block mb-2">
                Izaberite adresu
              </label>
              <div className="relative inline-block w-full text-sm border">
                <button
                  className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>
                    {selectedAddress
                      ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                      : "Izaberite adresu"}
                  </span>
                  <svg
                    className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#6B7280"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                    {userAddresses.map((address, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                        onClick={() => handleAddressSelect(address)}
                      >
                        {address.fullName}, {address.area}, {address.city},{" "}
                        {address.state}
                      </li>
                    ))}
                    <li
                      onClick={() => router.push("/dodaj-adresu")}
                      className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                    >
                      + Dodaj novu adresu
                    </li>
                  </ul>
                )}
              </div>
            </>
          ) : (
            <>
              <label className="text-base font-medium uppercase text-gray-600 block mb-2">
                Podaci za dostavu
              </label>
              <div className="space-y-3">
                <input
                  className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                  type="text"
                  placeholder="Puno ime"
                  onChange={(e) =>
                    setGuestAddress({
                      ...guestAddress,
                      fullName: e.target.value,
                    })
                  }
                  value={guestAddress.fullName}
                />
                <input
                  className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                  type="text"
                  placeholder="Broj telefona"
                  onChange={(e) =>
                    setGuestAddress({
                      ...guestAddress,
                      phoneNumber: e.target.value,
                    })
                  }
                  value={guestAddress.phoneNumber}
                />
                <input
                  className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                  type="text"
                  placeholder="Poštanski broj"
                  onChange={(e) =>
                    setGuestAddress({
                      ...guestAddress,
                      pincode: e.target.value,
                    })
                  }
                  value={guestAddress.pincode}
                />
                <textarea
                  className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
                  rows={3}
                  placeholder="Adresa (naselje i ulica)"
                  onChange={(e) =>
                    setGuestAddress({
                      ...guestAddress,
                      area: e.target.value,
                    })
                  }
                  value={guestAddress.area}
                ></textarea>
                <div className="flex space-x-3">
                  <input
                    className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                    type="text"
                    placeholder="Grad/Opština"
                    onChange={(e) =>
                      setGuestAddress({
                        ...guestAddress,
                        city: e.target.value,
                      })
                    }
                    value={guestAddress.city}
                  />
                  <select
                    className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                    onChange={(e) =>
                      setGuestAddress({
                        ...guestAddress,
                        state: e.target.value,
                      })
                    }
                    value={guestAddress.state}
                  >
                    <option value="">Izaberite državu</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                {guestAddress.state && isBosnia && (
                  <p className="text-xs text-gray-500">
                    Dostava za Bosnu i Hercegovinu iznosi 9 KM.
                  </p>
                )}
                {guestAddress.state && isSerbia && (
                  <p className="text-xs text-gray-500">
                    Dostava za Srbiju iznosi 22 KM.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo kod
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Unesite promo kod"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Primijeni
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Stavke {getCartCount()}</p>
            <p className="text-gray-800">
              {getCartAmount()} {currency}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Trošak dostave</p>
            <p className="font-medium text-gray-800">
              {selectedCountry ? `${shippingCost} ${currency}` : "—"}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Ukupno</p>
            <p>
              {totalAmount} {currency}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Naruči
      </button>
    </div>
  );
};

export default OrderSummary;
