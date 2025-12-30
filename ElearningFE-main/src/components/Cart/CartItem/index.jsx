import { formatterVND } from "../../../utils/formatterVND";
import * as cartService from "../../../service/cartService";
import { toast } from "react-toastify";

const CartItem = ({ cartItem, refetch }) => {
  const handleRemove = async () => {
    try {
      const res = await cartService.removeCartItem(cartItem.courseId);
      if (res.success) {
        toast.success(res.message);
        refetch();
      }
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center gap-6 border-b border-red-200 pb-4">
      <img
        src={cartItem.courseThumbnail}
        alt="Khóa học React Cơ Bản"
        className="w-24 h-24 rounded-xl border object-cover"
      />

      <div className="flex-1">
        <h2 className="font-semibold text-lg text-gray-800">
          {cartItem.courseTitle}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Giảng viên: {cartItem.instructorName}
        </p>
        <p className="text-base font-semibold mt-2 text-red-500">
          {formatterVND(cartItem.price)}
        </p>
      </div>

      <button
        onClick={handleRemove}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
      >
        Xóa
      </button>
    </div>
  );
};

export default CartItem;
