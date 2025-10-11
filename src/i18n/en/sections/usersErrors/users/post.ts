export const postTranslations = {
  error: {
    validation: {
      title: "User creation validation failed",
      description: "Please check your user information and try again",
    },
    unauthorized: {
      title: "User creation unauthorized",
      description: "You don't have permission to create users",
    },
    forbidden: {
      title: "User creation forbidden",
      description: "You don't have permission to create users",
    },
    duplicate: {
      title: "User already exists",
      description:
        "A user with this email address already exists in the system",
    },
    server: {
      title: "User creation server error",
      description: "Unable to create user due to a server error",
    },
    unknown: {
      title: "User creation failed",
      description: "An unexpected error occurred while creating user",
    },
  },
  success: {
    title: "User created successfully",
    description: "The new user has been created and added to the system",
  },
};
