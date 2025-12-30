import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as cartService from "../../../service/cartService";
import { useQuery } from "@tanstack/react-query";
import CartItem from "../../../components/Cart/CartItem";
import * as paymentService from "../../../service/paymentService";
import { toast } from "react-toastify";

const CartPage = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  const price = 499000;

  const removeItem = () => setVisible(false);
  const clearCart = () => setVisible(false);

  const handlePayment = async () => {
  if (!cartItems?.data?.length) {
    return toast.error("Giỏ hàng trống!");
  }

  try {
    const res = await paymentService.createPayment({
      amount: total,
      orderInfo: "Thanh toán đơn hàng"
    });

    const url = res.data.paymentUrl;

    window.location.href = url; 
  } catch (err) {
    toast.error("Lỗi khi tạo thanh toán!");
  }
};


  const fetchCartItems = async () => {
    const data = await cartService.getCartItems();
    return data;
  };

  const { data: cartItems, refetch } = useQuery({
    queryKey: ["cart-items"],
    queryFn: cartService.getCartItems,
  });

  const countPrice = () => {
    if (!cartItems?.data) return 0;
    return cartItems.data.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const total = visible ? countPrice() : 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-white font-sans">
      <div className="relative py-6 px-8 border-b border-red-200 text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-8">
        <div className="flex gap-8 items-start w-full">
          <div className="flex flex-col gap-5 w-full bg-white border border-red-200 rounded-2xl p-4 shadow-sm">
            {cartItems && cartItems?.data.length > 0 ? (
              cartItems.data.map((cartItem) => (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  refetch={refetch}
                />
              ))
            ) : (
              <div>Giỏ hàng trống</div>
            )}
          </div>

          <div className="w-72 bg-white border border-red-200 rounded-2xl p-5 shadow-md h-fit">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Tóm tắt đơn hàng
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{total.toLocaleString()} ₫</span>
              </div>

              <div className="border-t border-red-200 pt-3 mt-2 flex justify-between font-semibold text-base text-gray-900">
                <span>Tổng cộng:</span>
                <span className="text-red-600">{total.toLocaleString()} ₫</span>
              </div>
            </div>

            <button onClick={handlePayment} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold mt-5 py-2.5 rounded-lg transition">
              Thanh toán
            </button>

            <button
              onClick={clearCart}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white mt-3 py-2.5 rounded-lg transition"
            >
              Xóa toàn bộ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
