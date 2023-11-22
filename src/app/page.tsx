"use client";

import { JWTGoogleResponse } from "@/types/index";
import { Button, Divider, Input } from "@nextui-org/react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
export default function Home() {
  const [userInfo, setUserInfo] = useState<JWTGoogleResponse>();
  const [employee, setEmployee] = useState<string>("");
  const employeeIdRef = useRef<HTMLInputElement | null>(null);
  const domain = ["arise.tech", "infinitaskt.com"];
  useEffect(() => {
    if (userInfo) {
      employeeIdRef.current?.focus();
    }
  }, [userInfo]);

  const handleInputChange = (e: any) => {
    // Use regular expression to allow only numeric input
    let input = e.target.value.replace(/[^0-9]/g, "");
    input = input.slice(0, 6);
    setEmployee(input);
  };
  return (
    <>
      <div className="flex flex-col justify-start flex-wrap content-start gap-6 mt-12 px-6">
        {userInfo ? (
          <form className="w-full flex flex-col gap-6 text-center mt-[-200px]">
            <h1 className="text-6xl mb-6 italic font-bold">
              Arise New Year Party 2023
            </h1>
            <Input
              type="email"
              label="Email"
              disabled
              size="lg"
              value={userInfo?.email}
              className="input"
            />
            <Input
              type="text"
              label="First Name"
              disabled
              size="lg"
              value={userInfo?.given_name}
              className="input"
            />
            <Input
              type="text"
              label="Last Name"
              disabled
              size="lg"
              value={userInfo?.family_name}
              className="input"
            />
            <Input
              ref={employeeIdRef}
              type="tel"
              label="Empolyee Id"
              isClearable
              size="lg"
              className="input"
              onChange={handleInputChange}
              value={String(employee)}
              onClear={() => {
                setEmployee("");
              }}
            />
            <Button
              size="lg"
              className="relative  text-white bg-gradient-to-br
            from-pink-500 to-orange-400 hover:bg-gradient-to-bl
            font-small rounded-lg text-xl px-10 py-2 text-center mb-2 min-w-[160px] h-[64px]"
            >
              Register
            </Button>
          </form>
        ) : (
          <div className="w-full flex flex-col gap-6 text-center mt-[-200px]">
            <div>
              <h1 className="text-6xl  italic font-bold tex">
                Arise New Year Party 2023
              </h1>
              <h4 className="mt-6 text-lg">
                Kindly sign in using your credentials from either @arise.tech or
                @infinitaskt.com.
              </h4>
            </div>
            <Divider className="my-4" />
            <div className="flex w-full justify-center">
              <GoogleLogin
                logo_alignment="center"
                width={300}
                size={"medium"}
                onSuccess={async (credentialResponse) => {
                  if (await credentialResponse.credential) {
                    const data: JWTGoogleResponse = jwtDecode(
                      String(credentialResponse.credential)
                    );
                    const checkDomain = data.email.split("@");
                    if (domain.includes(checkDomain[1])) {
                      setUserInfo(
                        jwtDecode(String(credentialResponse.credential))
                      );
                    } else {
                      toast.error(
                        "Please sign in with an email from @arise.tech or @infinitaskt.com domains."
                      );
                    }
                  }
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
