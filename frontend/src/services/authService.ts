import instanceApi from "../lib/axios";

export const authService = {
  signIn: async (username: string, password: string) => {
    const response = await instanceApi.post(
      "/auth/signin",
      {
        username,
        password,
      },
      { withCredentials: true },
    );
    return response.data;
  },

  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    const response = await instanceApi.post(
      "/auth/signup",
      {
        username,
        password,
        email,
        firstName,
        lastName,
      },
      { withCredentials: true },
    );
    return response.data;
  },

  signOut: async () => {
    await instanceApi.post("/auth/signout", {}, { withCredentials: true });
  },

  fetchUserProfile: async () => {
    console.log("Fetching user profile from /users/me");
    const response = await instanceApi.get("/users/me", {
      withCredentials: true,
    });
    return response.data.user;
  },
};
