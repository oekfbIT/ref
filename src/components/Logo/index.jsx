// components
import { NavLink } from "react-router-dom";
import LOGO_H_DARK from "@assets/logo/SVG/LOGO_H_LIGHT.svg";
// utils
import PropTypes from "prop-types";

const Logo = ({ size = "md" }) => {
  let logoSize;

  // switch (size) {
  //   case "sm":
  //     logoSize = "250px"; // Adjust size as needed
  //     break;
  //   case "md":
  //     logoSize = "250px"; // Adjust size as needed
  //     break;
  //   case "xl":
  //     logoSize = "550px"; // Adjust size as needed
  //     break;
  //   default:
  //     logoSize = "350px"; // Default size
  // }

  return (
    <NavLink to="/">
      <img
        src={LOGO_H_DARK}
        alt="OEKFB Logo"
        style={{ width: "auto", height: "auto" }}
      />
    </NavLink>
  );
};

Logo.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "xl"]),
};

export default Logo;
