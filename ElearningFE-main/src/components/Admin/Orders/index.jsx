import { MoreVertical, Eye, Search } from "lucide-react";

const Orders = () => {
  const orders = [
    {
      orderId: "#ORD-1234",
      customer: "Nguyễn Văn An",
      course: "Web Development Bootcamp",
      amount: 599000,
      date: "2024-03-20 14:30",
      status: "completed",
    },
    {
      orderId: "#ORD-1235",
      customer: "Trần Thị Bích",
      course: "React Complete Guide",
      amount: 599000,
      date: "2024-03-20 14:30",
      status: "pending",
    },
    {
      orderId: "#ORD-1236",
      customer: "Lê Minh Tuấn",
      course: "Python for Data Science",
      amount: 599000,
      date: "2024-03-20 14:30",
      status: "completed",
    },
  ];

  const fCurrency = (n) => "₫" + n.toLocaleString("vi-VN");
  return (
    <div>
      <div className=" p-4 border-b border-red-200 shadow-sm flex items-center justify-between">
        <div className="font-bold text-2xl text-red-500">All Orders</div>
        <div className="flex items-center border border-red-400 rounded-full px-3 py-4 hover:bg-red-50 focus-within:!bg-white focus-within:ring-2 focus-within:ring-red-500 mx-4 cursor-pointer ">
          <Search className="text-gray-500 me-2 " size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="flex-1 outline-none text-sm"
          />
        </div>
      </div>
      <div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b border-red-200 text-red-400 text-sm">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-200">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="py-3 px-4 font-semibold">{o.orderId}</td>
                <td className="py-3 px-4 font-semibold">{o.customer}</td>
                <td className="py-3 px-4 text-gray-500">{o.course}</td>
                <td className="py-3 px-4 font-semibold">
                  {fCurrency(o.amount)}
                </td>
                <td className="py-3 px-4">{o.date}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          o.status === "pending"
                            ? "text-yellow-700 bg-yellow-100"
                            : o.status === "completed"
                            ? "text-green-700 bg-green-100"
                            : "text-green-700 bg-green-100"
                        }
                    `}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-3 text-gray-500">
                    <button className="hover:text-red-500">
                      <Eye size={18} />
                    </button>
                    <button className="hover:text-red-700">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
