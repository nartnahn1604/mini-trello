import { useParams } from "react-router-dom";
import Button from "../../../../component/button/Button";
import FormInput from "../../../../component/formInput/FormInput";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useMQTT from "../../../../hooks/useMQTT";
import Constants from "../../../../utils/Constants";
import LibToast from "../../../../utils/Toast";
import { Utils } from "../../../../utils/Utils";
import "./Invitation.scss";
import * as Yup from "yup";

export default function Invitation({ close }) {
  const axiosPrivate = useAxiosPrivate();
  const { publishMessage } = useMQTT();
  const { id } = useParams();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email"
      ),
  });
  const onSubmit = (values) => {
    Utils.progress(true);
    setTimeout(async () => {
      try {
        const res = await axiosPrivate.put(Constants.END_POINT.MEMBER.INVITE, {
          ...values,
          boardId: id,
        });
        LibToast.toast(res?.data?.message, "info");
        publishMessage(
          "trello/update",
          JSON.stringify({ type: "board", id: id })
        );
        close();
      } catch (error) {
        console.log(error);
        LibToast.toast(
          error.response.data.error || error.response.data,
          "error"
        );
      } finally {
        Utils.progress(false);
      }
    }, 300);
  };
  return (
    <FormInput
      id="invitationForm"
      initialValues={{ email: "" }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      className="d-flex flex-column align-items-center"
    >
      <FormInput.Text
        type="email"
        name="email"
        className="form-group w-100"
        placeholder="Enter email"
      />
      <Button
        type="submit"
        variant="blue"
        className="w-100"
        formId="invitationForm"
      >
        <Button.Text text="Invite" />
      </Button>
    </FormInput>
  );
}
