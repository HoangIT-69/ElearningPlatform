import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { formatterVND } from "../../../utils/formatterVND";
import { formatDate } from "../../../utils/formatterDate";

const successfulPayment = () => {
   
    const navigate = useNavigate();

  return <div className="bg-red-50 h-screen flex flex-col items-center justify-center space-y-10">
    <div className="bg-white p-10 rounded-2xl shadow-lg border border-red-200 flex flex-col items-center">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 32 32"><path fill="green" d="M22.8 12.3c.304-.308.304-.808 0-1.12s-.796-.308-1.1 0l-7.75 7.86l-3.6-3.65a.77.77 0 0 0-1.1 0a.8.8 0 0 0 0 1.12l4.15 4.21a.77.77 0 0 0 1.1 0z"/><path fill="green" fillRule="evenodd" d="M32 16c0 8.84-7.16 16-16 16S0 24.84 0 16S7.16 0 16 0s16 7.16 16 16m-1 0c0 8.28-6.72 15-15 15S1 24.28 1 16S7.72 1 16 1s15 6.72 15 15" clipRule="evenodd"/></svg>
        </div>
        <div className="mt-7 text-center">
            <div className="font-bold text-4xl">Thanh toán thành công!</div>
            <div className="font-semibold text-gray-500 ">Đơn hàng của bạn đã được xác nhận</div>
        </div>
        
    </div>

    <button onClick={()=>navigate("/")} className="bg-red-500 text-white font-semibold rounded-2xl py-2 px-10 hover:bg-red-600">Quay về trang chủ</button>
  </div>;
};

export default successfulPayment;