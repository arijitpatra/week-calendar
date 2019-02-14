import React, { Component } from "react";
import "./loader.scss";

class Loader extends Component {
  render() {
    return (
      <div className="row p-0 m-0 justify-content-center align-items-center l-loader">
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
}

export default Loader;
