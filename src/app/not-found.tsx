import React from "react";

type Props = {};

export default function NotFound({}: Props) {
  return (
    <div>
      <h1 className="text-6xl font-bold">Oops, 404</h1>
      <p className="text-xl mt-2">Not Found Page</p>
    </div>
  );
}
