import { Edit, Trash2, MoreVertical, Search } from "lucide-react";
import * as userService from "../../../service/admin/userService";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../../../utils/formatterDate";
import { useState } from "react";
import UserInformation from "./UserInformation";
import EditUser from "./EditUser";

const Users = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [openInfo, setOpenInfo] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async (page, size) => {
    const data = await userService.getAllUsers(page, size);
    return data;
  };

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users", page, size],
    queryFn: () => fetchUsers(page, size),
  });

  const userList = users?.data?.content || [];
  const totalPages = users?.data?.totalPages || 1;

  return (
    <div>
      <div className=" p-4 border-b border-red-200 shadow-sm flex items-center justify-between">
        <div className="font-bold text-2xl text-red-500">Tất cả người dùng</div>
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
              <th className="py-3 px-4">Người dùng</th>
              <th className="py-3 px-4">EMAIL</th>
              <th className="py-3 px-4">Ngày tạo</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Vai trò</th>
              <th className="py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-200">
            {users?.data?.content.map((u) => (
              <tr key={u.id}>
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={u.avatar || "https://static.vecteezy.com/system/resources/previews/024/766/958/non_2x/default-male-avatar-profile-icon-social-media-user-free-vector.jpg"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-red-200"
                  />
                  <span className="py-3 px-4 font-bold text-red-500 truncate">{u.fullName}</span>
                </td>
                <td className="py-3 px-4 text-gray-500">{u.email}</td>

                <td className="py-3 px-4">{formatDate(u.createdAt)}</td>
                <td className="py-3 px-4">
                  {u.isActive ? (
                    <span>
                      {" "}
                      <span className="px-3 py-1 rounded-full text-green-700 bg-green-100 text-xs font-medium">
                        Active
                      </span>
                    </span>
                  ) : (
                    <span>
                      {" "}
                      <span className="px-3 py-1 rounded-full text-red-700 bg-red-100 text-xs font-medium">
                        Inactive
                      </span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded-full text-red-500 bg-red-200 text-xs font-medium">
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-3 text-gray-500">
                    <button onClick={() => {setSelectedUserId(u.id); setOpenEdit(true)}}className="hover:text-red-500">
                      <Edit size={18} />
                    </button>
                    <button className="hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => {setSelectedUserId(u.id); setOpenInfo(true)}} className="hover:text-red-700">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center space-x-1 justify-center mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-red-200 disabled:opacity-50"
        >
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i)
          .filter(
            (n) =>
              n === 0 ||
              n === totalPages - 1 ||
              (n >= page - 2 && n <= page + 2)
          )
          .map((n, idx, arr) => {
            const isEllipsis =
              idx > 0 && n !== arr[idx - 1] + 1;

            return (
              <span key={n} className="flex items-center">
                {isEllipsis && <span className="px-2">...</span>}
                <button
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded ${
                    page === n
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 hover:bg-red-200"
                  }`}
                >
                  {n + 1}
                </button>
              </span>
            );
          })}

        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages - 1))
          }
          disabled={page === totalPages - 1}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-red-200 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {openInfo && (
        <UserInformation userId = {selectedUserId} onClose={() => setOpenInfo(false)} />
      )}
      {openEdit && (
        <EditUser userId = {selectedUserId} onClose={() => setOpenEdit(false)} />
      )}
    </div>
  );
};

export default Users;
