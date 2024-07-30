import Button from "../../../component/button/Button";
import FormInput from "../../../component/formInput/FormInput";
import logo from "../../../assets/images/portfolio.png";
import "./SignUp.scss";
import useSignUp from "./useSignUp";

export default function SignUp() {
  const { initialValues, validationSchema, onSubmit } = useSignUp();
  return (
    <div className="sign-up">
      <img src={logo} alt="logo" />
      <h1>Welcome to HN Trello</h1>
      <FormInput
        id="signUpForm"
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <FormInput.Text
          name="email"
          className="form-group"
          required
          type="email"
          placeholder="Enter your email"
        />
        <Button
          type="submit"
          variant="blue"
          className="w-100"
          formId="signUpForm"
        >
          <Button.Text text="Continue" />
        </Button>
      </FormInput>
    </div>
  );
}
