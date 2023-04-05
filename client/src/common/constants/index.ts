export const defaultImg = "https://res.cloudinary.com/dayt0wtlk/image/upload/v1678478287/yt-avatar/default_pslj9k.jpg"

export const videoFields = [
   {
      label: "Title",
      as: "input",
      name: "title",
      placeholder: "Video title.",
      max: 30
   },
   {
      label: "Tags",
      as: "input",
      name: "tags",
      placeholder: "Tags separated with a coma."
   },
   {
      label: "Description",
      as: "textarea",
      rows: 6,
      name: "description",
      placeholder: "Video description (optional).",
      max: 300
   }
]

export const loginFields = [
   {
      type: "email",
      name: "email",
      placeholder: "E-Mail",
   },
   {
      type: "password",
      name: "password",
      placeholder: "Password",
   }
]

export const registerFields = [
   ...loginFields,
   {
      type: "text",
      name: "name",
      placeholder: "Username",
   },
]