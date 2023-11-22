"use client";

import { FormSubmit, JWTGoogleResponse } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

export default function Home() {
  const [userInfo, setUserInfo] = useState<JWTGoogleResponse | null>();
  const [employee, setEmployee] = useState<string>("");
  const employeeIdRef = useRef<HTMLInputElement | null>(null);
  const domain = ["arise.tech", "infinitaskt.com"];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const schema = yup
    .object({
      employeeId: yup
        .string()
        .min(6, "")
        .max(6, "")
        .required()
        .matches(/^[\d-]{6}$/, "Only numberic are allowed for this field"),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormSubmit>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    // defaultValues: {
    //   employeeId: "",
    // },
  });

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

  const onSubmit = (data: any) => {
    console.log(data);
    onOpen();
  };

  const onTriggerValidation = (event: any) => {
    const { name } = event.target;
    trigger(name);
  };
  return (
    <>
      <div className="flex flex-col justify-start flex-wrap content-start gap-6 mt-12 px-6">
        {userInfo ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6 text-center"
          >
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

            <Controller
              control={control}
              name="employeeId"
              render={({ field }) => (
                <Input
                  // {...register("employeeId")}
                  {...field}
                  ref={employeeIdRef}
                  type="tel"
                  maxLength={6}
                  label="Empolyee Id"
                  isClearable
                  size="lg"
                  className="input"
                  // onChange={onChange}
                  // onChange={handleInputChange}

                  // value={String(employee)}
                  autoComplete="off"
                  onClear={() => {
                    setEmployee("");
                    setValue("employeeId", "");
                    trigger("employeeId");
                  }}
                />
              )}
            />

            <button
              className="relative  text-white bg-gradient-to-br
          from-pink-500 to-orange-400 hover:bg-gradient-to-bl
          font-small rounded-lg text-xl px-10 py-2 text-center mb-2 min-w-[160px] h-[64px]
          disabled:opacity-25 font-bold
          "
              disabled={!isValid}
              type="submit"
            >
              Check In
            </button>
          </form>
        ) : (
          <div className="w-full flex flex-col gap-6 text-center">
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
                width={250}
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

      <Modal
        onClose={()=>{
          setValue("employeeId","");
          trigger("employeeId");
          setUserInfo(null);
        }}
        placement={"center"}
        isDismissable={false}
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
              {/* <h2 className="text-4xl">Congratulation!</h2> */}
              </ModalHeader>
              <ModalBody>
                <p className="text-2xl">
                <span className="font-semibold text-green-700">Checked In for the New Year party!</span> Eager to celebrate and hopeful to win exciting lucky draw prizes!
                </p>
              </ModalBody>
              <ModalFooter>

                <Button color="primary" onPress={onClose}
                className="bg-gradient-to-br
                from-pink-500 to-orange-400 hover:bg-gradient-to-bl text-lg
                font-small">
                  Enjoy :)
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
