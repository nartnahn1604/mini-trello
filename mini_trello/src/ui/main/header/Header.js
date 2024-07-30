import "./Header.scss";
import logo from "../../../assets/images/portfolio.png";
import { ReactComponent as Avatar } from "../../../assets/images/avatar.svg";
import { ReactComponent as Notification } from "../../../assets/images/bell.svg";
export default function Header() {
  return (
    <div className="header d-flex align-items-center justify-content-between">
      <img src={logo} alt="logo" />
      <div className="right d-flex align-items-center justify-content-between">
        <div className="notification">
          <Notification />
          <div className="num-of-noti">1</div>
        </div>
        <Avatar />
      </div>
    </div>
  );
}
