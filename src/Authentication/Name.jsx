import React from "react";
import { Link } from "react-router-dom";

function Name({ nameUser }) {
  return (
    <li className="nav-item dropdown">
      <Link
        className="nav-link dropdown-toggle"
        style={{ cursor: "pointer" }}
        id="pagesDropdown"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        to=""
      >
        <i className="fas fa-user-alt mr-1 text-gray"></i>
        {nameUser}
      </Link>
      <div className="dropdown-menu mt-3" aria-labelledby="pagesDropdown">
        <Link
          className="dropdown-item border-0 transition-link"
          to={"/history"}
        >
          History
        </Link>
      </div>
    </li>
  );
}

export default Name;
