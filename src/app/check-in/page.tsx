"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

type Props = {};

export default function CheckInPage({}: Props) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [ariseSoul, setAriseSoul] = useState("/images/dark.png");
  useEffect(() => {
    theme === "light"
      ? setAriseSoul("/images/dark.png")
      : setAriseSoul("/images/light.png");
  }, [theme]);

  useEffect(() => {
    if (!sessionStorage.getItem("checkIn")) {
      router.replace("/");
    }
  }, []);

  return (
    <div className="flex flex-col justify-start flex-wrap content-start gap-6 mt-12 px-6">
      <div className="flex justify-center">
        <Image src={ariseSoul} alt="" width={300} height={200}></Image>
      </div>
      <div className="flex flex-col justify-center items-center gap-6">
        <h1 className="text-2xl  italic font-bold tracking-widest text-center">
          You are registered!
        </h1>
        <p className="text-xl  text-center">
          Please wear the given t-shirt and wristband to join the event and for
          your safety.
        </p>
        <h4 className="text-xl  text-yellow-500 font-bold text-center">
          All lucky draw rewards <br />
          are RESERVED <br />
          FOR ONSITE PARTICIPANTS only.
        </h4>
        <p className="text-xl text-center">Stay tuned. The winners can be you.</p>
      </div>
    </div>
  );
}
