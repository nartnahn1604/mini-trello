import Button from "../../../component/button/Button";
import FormInput from "../../../component/formInput/FormInput";
import logo from "../../../assets/images/portfolio.png";
import "./Verification.scss";
import useVerification from "./useVerification";

export default function Verification() {
  const { initialValues, validationSchema, onSubmit } = useVerification();
  return (
    <div className="verification sign-up">
      <img src={logo} alt="logo" />
      <h1>Email verification</h1>

      <FormInput
        id="verificationForm"
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <p>
          Please enter your code that we sent to your email to verify your
          account
        </p>
        <FormInput.Text
          name="code"
          className="form-group"
          required
          type="number"
          placeholder="Enter your code"
        />
        <Button
          type="submit"
          variant="blue"
          className="w-100"
          formId="verificationForm"
        >
          <Button.Text text="Verify" />
        </Button>
      </FormInput>
    </div>
  );
}
