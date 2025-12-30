import { useNavigate } from "react-router-dom";

const paymentFailed = () => {
    const navigate = useNavigate();
  return <div className="bg-red-50 h-screen flex flex-col items-center justify-center space-y-10">
    <div className="bg-white p-10 rounded-2xl shadow-lg border border-red-200 flex flex-col items-center">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 32 32"><path fill="red" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12"/><path fill="red" d="M15 8h2v11h-2zm1 14a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 22"/></svg>
        </div>
        <div className="mt-7 text-center">
            <div className="font-bold text-4xl">Thanh toán thất bại</div>
            <div className=" text-gray-500 ">Rất tiếc, chúng tôi không thể xử lý thanh toán của bạn</div>
        </div>
        <div className="bg-red-50 rounded-2xl p-5 mt-7 w-full border border-red-200">
            <h3 className="text-red-600 font-semibold">Lý do:</h3>
            <ul>
                <li class="text-red-500 pl-5">Thẻ của bạn đã bị từ chối</li>
                <li class="text-red-500 pl-5">Vui lòng kiểm tra lại thông tin thẻ</li>
                <li class="text-red-500 pl-5">Hạn mức thẻ có thể không đủ</li>
            </ul>
        </div>
    </div>

    <button onClick={()=>navigate("/")} className="bg-red-500 text-white font-semibold rounded-2xl py-2 px-10 hover:bg-red-600">Quay về trang chủ</button>
  </div>;
};

export default paymentFailed;