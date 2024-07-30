import { useFormik } from "formik";
import { object } from "yup";

export default function useValidate(
  onSubmit,
  initialValues = {},
  validationSchema = object({})
) {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  return formik;
}
