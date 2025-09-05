import React from "react";
import Router from "next/router";

export default function Error() {
  React.useEffect(() => {
    Router.push("/admin/dashboard");
  });

  return <div />;
}
