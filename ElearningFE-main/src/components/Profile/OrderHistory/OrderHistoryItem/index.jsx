import { formatDate } from "../../../../utils/formatterDate";
import { formatterVND } from "../../../../utils/formatterVND";

const OrderHistoryItem = ({ order }) => {
  return (
    <div className="border border-red-200 rounded-xl mt-3">
      <div className="m-4 pb-2 border-b border-red-200">
        <div className="flex items-center gap-5">
          <div className="text-gray-500">Đơn hàng #{order.orderId}</div>
          <div className="bg-green-500 text-white rounded-2xl py-1 px-5">
            {order.status}
          </div>
        </div>

        <div className="font-semibold">
          {formatterVND(order.totalAmount)}
        </div>

        <div className="text-gray-500 text-sm">
          {formatDate(order.orderDate)}
        </div>
      </div>

      <div className="text-red-500 m-4 font-semibold">
        Khóa học trong đơn hàng:
      </div>

      {order.items.map((item) => (
        <div
          key={item.courseId}
          className="flex gap-4 m-4 items-center border border-red-200 rounded-lg p-3 mb-3"
        >
          <img
            className="w-16 h-16 rounded-lg object-cover"
            src={item.courseThumbnail}
            alt=""
          />

          <div>
            <div className="font-semibold">{item.courseTitle}</div>
            <div className="text-red-500 font-semibold">
              {formatterVND(item.price)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistoryItem;
