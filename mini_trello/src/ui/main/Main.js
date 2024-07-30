import { Outlet } from "react-router-dom";
import Header from "./header/Header.js";
import "./Main.scss";
import SideBar from "./sideBar/SideBar.js";
import useMain from "./useMain.js";
import FormInput from "../../component/formInput/FormInput.js";
import Button from "../../component/button/Button.js";
import Logo from "../../assets/images/portfolio.png";
import { BoardProvider } from "./board/useBoard.js";

export default function Main() {
  const { auth, initValues, validationSchema, onSubmit } = useMain();
  return !auth?.isNewUser ? (
    <div className="main-container">
      <Header />
      <BoardProvider>
        <div className="row m-0 w-100">
          <div className="col-md-3 pe-0">
            <SideBar />
          </div>
          <div className="col-md-9 ps-0 pe-0">
            <div className="content">
              <Outlet />
            </div>
          </div>
        </div>
      </BoardProvider>
    </div>
  ) : (
    <div className="welcome">
      <div className="d-flex flex-column align-items-center">
        <img src={Logo} alt="logo" />
        <h1>Welcom to HN Trello</h1>
        <p>Please enter your fullname to get started</p>
      </div>
      <FormInput
        id="fullNameForm"
        initialValues={initValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <FormInput.Text
          name="fullname"
          className="form-group"
          type="text"
          placeholder="Enter your full name"
        />
        <Button
          type="submit"
          variant="blue"
          className="w-100"
          formId="fullNameForm"
        >
          <Button.Text text="Continue" />
        </Button>
      </FormInput>
    </div>
  );
}
