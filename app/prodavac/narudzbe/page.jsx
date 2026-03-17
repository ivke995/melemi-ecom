"use client";
import { assets } from "@/assets/assets";
import Loading from "@/components/Loading";
import Footer from "@/components/seller/Footer";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrder = (orderId) => {
    setExpandedOrderId((current) => (current === orderId ? null : orderId));
  };

  const fetchSellerOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchSellerOrders();
    }
  }, [user]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Narudžbe</h2>
          <div className="max-w-4xl rounded-md">
            {orders.map((order, index) => {
              const orderId = order._id ?? index;
              const isExpanded = expandedOrderId === orderId;
              const detailsId = `order-details-${orderId}`;
              const orderDate = new Date(order.date);

              return (
                <div key={orderId} className="border-t border-gray-300">
                  <button
                    type="button"
                    onClick={() => toggleOrder(orderId)}
                    className={`w-full text-left flex flex-col md:flex-row gap-5 justify-between p-5 transition-colors ${
                      isExpanded ? "bg-gray-50" : "hover:bg-gray-50"
                    }`}
                    aria-expanded={isExpanded}
                    aria-controls={detailsId}
                  >
                    <div className="flex-1 flex gap-5 max-w-80">
                      <Image
                        className="max-w-16 max-h-16 object-cover"
                        src={assets.box_icon}
                        alt="box_icon"
                      />
                      <p className="flex flex-col gap-3">
                        <span className="font-medium">
                          {order.items
                            .map(
                              (item) =>
                                `${item?.product?.name ?? "Proizvod nije dostupan"} x ${
                                  item?.quantity ?? 0
                                }`,
                            )
                            .join(", ")}
                        </span>
                        <span>Stavke: {order.items.length}</span>
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">
                          {order.address?.fullName}
                        </span>
                        <br />
                        <span>{order.address?.area}</span>
                        <br />
                        <span>{`${order.address?.city}, ${order.address?.state}`}</span>
                        <br />
                        <span>{order.address?.phoneNumber}</span>
                      </p>
                    </div>
                    <p className="font-medium my-auto">
                      {order.amount} {currency}
                    </p>
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <p className="flex flex-col">
                        <span>Način: Pouzećem</span>
                        <span>Datum: {orderDate.toLocaleDateString()}</span>
                        <span>Plaćanje: Na čekanju</span>
                      </p>
                      <span className="text-xs text-gray-500">
                        {isExpanded ? "Sakrij detalje" : "Detalji"}
                      </span>
                    </div>
                  </button>
                  {isExpanded ? (
                    <div id={detailsId} className="px-5 pb-5">
                      <div className="grid gap-4 md:grid-cols-3 text-sm bg-gray-50 rounded-md p-4 border border-gray-200">
                        <div className="space-y-2">
                          <p className="text-xs uppercase text-gray-500">Narudžba</p>
                          <p>
                            <span className="font-medium">Status:</span> {order.status}
                          </p>
                          <p>
                            <span className="font-medium">ID:</span> {orderId}
                          </p>
                          <p>
                            <span className="font-medium">Kreirano:</span> {orderDate.toLocaleString()}
                          </p>
                          <p>
                            <span className="font-medium">Ukupno:</span> {order.amount} {currency}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs uppercase text-gray-500">Dostava</p>
                          <p>{order.address?.fullName ?? "-"}</p>
                          <p>{order.address?.area ?? "-"}</p>
                          <p>
                            {`${order.address?.city ?? "-"}, ${
                              order.address?.state ?? "-"
                            }`}
                          </p>
                          <p>{order.address?.phoneNumber ?? "-"}</p>
                          <p>Poštanski broj: {order.address?.pincode ?? "-"}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs uppercase text-gray-500">Stavke</p>
                          {order.items.length ? (
                            <ul className="space-y-1">
                              {order.items.map((item, itemIndex) => (
                                <li key={`${orderId}-${itemIndex}`}>
                                  {item?.product?.name ?? "Proizvod nije dostupan"} x {item?.quantity ?? 0}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>Nema stavki.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
