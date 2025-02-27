class AuthService {
  constructor() {
    // this.baseURL = 'https://api.oekfb.eu/';
    this.baseURL = "https://test.oekfb.eu/";
    // this.baseURL = "http://localhost:8080";
  }

  async login(email, password) {
    const url = `${this.baseURL}/users/login`;
    const base64Credentials = btoa(`${email}:${password}`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login response data:", data); // Add this to check the response
        const token = data.token;

        if (!token) {
          console.error("Token is undefined in the response.");
          return {
            success: false,
            message: "Token is missing from the response.",
          };
        }

        if (data.user.type != "referee") {
          return {
            success: false,
            message: `Dieser User ist kein Schiedrichter sondern ${data.user.type}\`.`,
          };
        }

        const userId = data.user.id;

        // Fetch the full user data to get the ref information
        const fullUserData = await this.fetchUserData(userId, token);
        if (fullUserData && fullUserData.assignments) {
          const refID = fullUserData.id;

          // Set cookies for refID and token
          document.cookie = `refID=${refID}; path=/; max-age=${
            7 * 24 * 60 * 60
          }; secure; samesite=strict`;
          document.cookie = `authToken=${token}; path=/; max-age=${
            7 * 24 * 60 * 60
          }; secure; samesite=strict`;

          return { success: true, user: fullUserData.user };
        } else {
          return {
            success: false,
            message: "Failed to fetch team information.",
          };
        }
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Login failed" };
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, message: "An error occurred while logging in" };
    }
  }

  async fetchUserData(userId, token) {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`${this.baseURL}/referees/user/${userId}`, {
        headers,
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }

  getRefID() {
    return this.getCookie("refID");
  }

  getAuthToken() {
    return this.getCookie("authToken");
  }

  isAuthenticated() {
    const refID = this.getCookie("refID");
    const authToken = this.getCookie("authToken");
    return refID && authToken;
  }

  logoutUser() {
    document.cookie = "authToken=; path=/; max-age=0; secure; samesite=strict";
    document.cookie = "refID=; path=/; max-age=0; secure; samesite=strict";
  }
}

export default AuthService;
