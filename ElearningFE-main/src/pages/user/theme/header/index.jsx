import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Logo from "../../../../assets/user/Logo.svg";
import { getToken } from "../../../../utils/getToken";
import Cookies from "js-cookie";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
  if (e.key === "Enter") {
    navigate(`/courses?search=${encodeURIComponent(searchText)}`);
  }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    Cookies.remove("refreshToken");
    navigate("/login");
  };
  return (
    <header className="sticky top-0 z-50 border-b border-red-200 shadow-md shadow-red-50 bg-white">
      <div className="max-w-7xl flex flex-wrap md:flex-nowrap mx-auto items-center justify-between px-4 py-3">
        <div className="">
          <img
            src={Logo}
            alt=""
            className="w-[120px] md:w-[160px] h-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="order-last md:order-none w-full md:w-auto md:flex-1 flex items-center border border-red-400 rounded-full px-3 py-3 md:py-4 hover:bg-red-50 focus-within:!bg-white focus-within:ring-2 focus-within:ring-red-500 md:mx-4 cursor-pointer transition-all">
          <Search className="text-gray-500 me-2 " size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung bất kỳ"
            className="flex-1 outline-none text-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <div className="flex space-x-2 items-center">
          <div className="px-2 py-2 md:px-3 md:py-3 rounded-md hover:bg-red-100 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              onClick={() => navigate("/cart")}
            >
              <path
                fill="#FF6367"
                d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4c.13-.17.2-.38.2-.6a1 1 0 0 0-1-1m-3 7H6.87l-.77 1.56L6 15a1 1 0 0 0 1 1h11v1H7a2 2 0 0 1-2-2a2 2 0 0 1 .25-.97l.72-1.47L2.34 4H1V3h2l.85 2H18a2 2 0 0 1 2 2c0 .5-.17.92-.45 1.26l-2.91 3.89c-.36.51-.96.85-1.64.85"
              />
            </svg>
          </div>
          {!token ? (
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => navigate("/login")}
                className="font-bold px-3 py-2 md:px-5 md:py-3 border border-red-400 rounded-md text-xs md:text-sm hover:bg-red-50 hover:border-red-500 whitespace-nowrap cursor-pointer hover:scale-[1.05] transition-all"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="font-bold px-3 py-2 md:px-5 md:py-3 bg-red-500 text-white rounded-md text-xs md:text-sm hover:bg-red-400 border whitespace-nowrap cursor-pointer hover:scale-[1.05] transition-all"
              >
                Đăng ký
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <div
                onClick={() => navigate("/profile")}
                className="px-2 py-2 md:me-5 md:px-3 md:py-3 rounded-md hover:bg-red-100 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22px"
                  height="22px"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#FF6367"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
                  />
                </svg>
              </div>
              <button
                onClick={() => handleLogout()}
                className="font-bold px-3 py-2 md:px-5 md:py-3 bg-red-500 text-white rounded-md text-xs md:text-sm hover:bg-red-400 border whitespace-nowrap cursor-pointer hover:scale-[1.05] transition-all"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
