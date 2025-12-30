import { useLocation } from "react-router-dom";
import Footer from "../footer";
import Header from "../header";

function MasterLaypout({ children, ...props }) {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);
  return (
    <div {...props}>
      {!hideLayout && <Header />}
      <div className="min-h-screen">{children}</div>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default MasterLaypout;
