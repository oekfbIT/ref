class AuthService {
  constructor() {
    this.baseURL = (process.env.REACT_APP_API_BASE_URL || "https://api.oekfb.eu")
      .replace(/\/+$/, "");
  }

  async login(email, password) {
    const url = `${this.baseURL}/app/auth/login`;
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
        const token = data.token;

        if (!token) {
          console.error("Token is undefined in the response.");
          return {
            success: false,
            message: "Token is missing from the response.",
          };
        }

        if (data.user.type !== "referee") {
          return {
            success: false,
            message: `Dieser User ist kein Schiedsrichter, sondern ${data.user.type}.`,
          };
        }

        // Resolve the referee profile from the authenticated token. The API does
        // not accept a caller-provided referee id here.
        const fullUserData = await this.fetchUserData(token);
        if (fullUserData && fullUserData.assignments) {
          const refID = fullUserData.id;

          // Set cookies for refID and token
          const secureCookie = window.location.protocol === "https:" ? "; secure" : "";
          document.cookie = `refID=${refID}; path=/; max-age=${
            7 * 24 * 60 * 60
          }${secureCookie}; samesite=strict`;
          document.cookie = `authToken=${encodeURIComponent(token)}; path=/; max-age=${
            7 * 24 * 60 * 60
          }${secureCookie}; samesite=strict`;

          return { success: true, user: data.user, referee: fullUserData };
        } else {
          return {
            success: false,
            message: "Failed to fetch team information.",
          };
        }
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.reason || errorData.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, message: "An error occurred while logging in" };
    }
  }

  async fetchUserData(token) {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await fetch(`${this.baseURL}/app/referee/me`, {
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
    if (match) return decodeURIComponent(match[2]);
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
