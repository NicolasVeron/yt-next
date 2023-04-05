import * as yup from "yup"

export const videoFormValidation = yup.object({
   title: yup.string().required("Required field").max(30, "Must be less than 30 characters"),
   tags: yup.string().required("Required field"),
   description: yup.string().max(300, "Must be less than 300 characters")
})

export const loginFormValidation = yup.object({
   email: yup.string().required("Required field"),
   password: yup.string().required("Required field")
})

export const registerFormValidation = loginFormValidation.concat(
   yup.object().shape({
      name: yup.string().required("Required field").max(30, "Must be less than 30 characters")
   })
)

