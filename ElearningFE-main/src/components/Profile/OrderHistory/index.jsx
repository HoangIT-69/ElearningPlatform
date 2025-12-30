import { memo, use } from "react";
import { useState, useEffect } from "react";
import Course from "../../Course";
import OrderHistoryItem from "./OrderHistoryItem";
import { useQuery } from "@tanstack/react-query";
import * as paymentService from "../../../service/paymentService";

const OrderHistory = () => {
  const fetchOrderHistory = async () => {
    const res = await paymentService.orderHistory();
    return res?.data || [];
  }
  

  const {data: orderHistory = []} = useQuery({
    queryKey: ["order-history"],
    queryFn: fetchOrderHistory,
  });

  return (
    <div className="p-6">
      <div className="text-2xl text-red-500 font-bold">Lịch sử mua </div>

     
        {orderHistory.map((order) => (
          <OrderHistoryItem key={order.orderId} order={order} />
        ))}

      
    </div>
  );
};

export default memo(OrderHistory);
