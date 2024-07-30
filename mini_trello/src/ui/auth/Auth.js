import { Outlet } from "react-router-dom";
import { ReactComponent as Banner } from "../../assets/images/auth-left.svg";
import "./Auth.scss";

export default function Auth() {
  return (
    <div className="noto-sans-hn row auth-container">
      <div className="col-6 banner">
        <Banner />
      </div>
      <div className="col-6">
        <Outlet />
      </div>
    </div>
  );
}
