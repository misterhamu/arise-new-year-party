"use client";

import { FormSubmit, JWTGoogleResponse } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import Image from "next/image";

import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import {
  CheckInReqest,
  GetEmployeeByEmailRequest,
  checkIn,
  getEmployeeId,
} from "./lib/api";
import { AxiosError } from "axios";
import { useLoading } from "./context/loadingContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<JWTGoogleResponse | null>();
  const [emailDomain, setEmailDomain] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [employee, setEmployee] = useState<boolean>(false);
  const employeeIdRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const domain = ["arise.tech", "infinitaskt.com", "@krungthai.com"];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const Loading = useLoading();
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
  });

  const onSubmit = (data: any) => {
    setLoading(!loading);
    checkInParty.mutate(data.employeeId);
  };

  const getEmployeeIdByEmail = useMutation({
    mutationFn: async (email: string) => {
      try {
        const req: GetEmployeeByEmailRequest = {
          email: email,
        };

        return getEmployeeId(req);
      } catch (err: any) {
        console.log(err.response.data.code);
      }
    },
    onMutate: () => {
      Loading.show();
    },
    onSuccess: async (data, variables, context) => {
      if (data?.data) {
        console.log(data);
        setValue("employeeId", data.data.data.employeeId);
        setSize(data.data.data.size  ?? "-" )
        sessionStorage.setItem("size", data.data.data.size  ?? "-")
        trigger("employeeId");
        setEmployee(true);
      }
    },
    onError: async (err: any) => {
      if (err.response.status === 400) {
        if (err.response.data.code == 4001) {
          setValue("employeeId", "");
          employeeIdRef.current?.focus();
        } else {
          setUserInfo(null);
          toast.error("You do not have permission to check in.");
        }
      }
    },
    onSettled: () => {
      Loading.hide();
    },
  });

  const checkInParty = useMutation({
    mutationFn: async (employeeId: string) => {
      if (!userInfo) {
        toast.error("user not found");
        return;
      }
      try {
        const req: CheckInReqest = {
          employeeId: employeeId,
          email: userInfo.email,
        };

        return checkIn(req);
      } catch (err) {
        toast.dismiss();
        toast.error("error");
        throw err;
      }
    },
    onMutate: () => {
      toast.dismiss();
    },
    onSuccess: async (data, variables, context) => {
      if (data?.data) {
        setLoading(false);
        // onOpen();
        sessionStorage.setItem("checkIn", "true");
        router.push("/check-in");
      }
    },
    onError: async (error: AxiosError) => {
      console.log(error);
      if (error) {
        toast.dismiss();
        setLoading(false);
        setUserInfo(null);
        // @ts-ignore
        if (error.response?.data.code === 4001) {
          sessionStorage.setItem("checkIn", "true");
          router.push("/check-in");
        } else {
          // @ts-ignore
          toast.error(error.response?.data.message);
        }
      }
    },
  });

  useEffect(() => {
    if (sessionStorage.getItem("checkIn")) {
      router.replace("/check-in");
    }
  }, []);
  
  return (
    <>
      <div className="flex flex-col justify-start flex-wrap content-start gap-6 mt-6 px-6">
        <div className="flex justify-center">
          <Image
            src={"/images/game.png"}
            alt=""
            width={300}
            height={200}
          ></Image>
        </div>
        {userInfo ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6 text-center"
          >
            <Input
              type="email"
              label="Email"
              isDisabled
              size="lg"
              value={userInfo?.email}
              className="input"
            />
            <Input
              type="text"
              label="First Name"
              isDisabled
              size="lg"
              value={userInfo?.given_name}
              className="input"
            />
            <Input
              type="text"
              label="Last Name"
              isDisabled
              size="lg"
              value={userInfo?.family_name}
              className="input"
            />

            <div className="flex w-full flex-nowrap gap-4">
              <Controller
                control={control}
                name="employeeId"
                render={({ field }) => (
                  <Input
                    {...field}
                    ref={employeeIdRef}
                    type="tel"
                    maxLength={6}
                    label="Employee Id"
                    size="lg"
                    className="input"
                    autoComplete="off"
                    isDisabled={employee}
                  />
                )}
              />
              <Input
                isDisabled
                type="text"
                size="lg"
                label="Size"
                placeholder=""
                className="text-4xl size"
                value={size}
              />
            </div>

            <Checkbox defaultSelected isDisabled>
              <p className="font-bold">
                Check to redeem your t-shirt and wristband to join Arise Connext
              </p>
            </Checkbox>

            <Button
              className="relative  text-white bg-gradient-to-br
            from-pink-500 to-orange-400 hover:bg-gradient-to-bl
             font-bold
             rounded-lg text-xl px-10 py-2 text-center mb-2 min-w-[160px] h-[64px] disabled:opacity-30"
              type="submit"
              color="primary"
              isLoading={loading}
              isDisabled={!isValid}
            >
              Check-in!
            </Button>
          </form>
        ) : (
          <div className="w-full flex flex-col gap-6 text-center">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl  italic font-bold tracking-widest">
                Welcome to <br />
                Staff Engagement Party
              </h1>
              <h4 className="mt-6 text-xl  text-yellow-500">
                Register to get a chance to win the Lucky Draw game!
              </h4>
            </div>
            {/* <Divider className="my-4" /> */}
            <div className="flex w-full justify-center mt-6">
              <GoogleLogin
                logo_alignment="center"
                width={250}
                size={"medium"}
                onSuccess={async (credentialResponse) => {
                  toast.dismiss();
                  if (await credentialResponse.credential) {
                    const data: JWTGoogleResponse = jwtDecode(
                      String(credentialResponse.credential)
                    );
                    const checkDomain = data.email.split("@");
                    if (domain.includes(checkDomain[1])) {
                      const userInfo: JWTGoogleResponse = jwtDecode(
                        String(credentialResponse.credential)
                      );
                      setUserInfo(userInfo);
                      setEmailDomain(checkDomain[1]);
                      getEmployeeIdByEmail.mutate(userInfo.email);
                    } else {
                      toast.dismiss();
                      toast.error(
                        "Please sign in with an email from @arise.tech, @infinitaskt.com, or @krungthai.com domains."
                      );
                    }
                  }
                }}
                onError={() => {
                  toast.dismiss();
                  console.log("Login Failed");
                }}
              />
            </div>
          </div>
        )}
      </div>

      <Modal
        onClose={() => {
          setValue("employeeId", "");
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
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <p className="text-2xl text-center">
                  <span className="font-semibold text-green-700">
                    Checked In for the New Year party!
                  </span>{" "}
                  Eager to celebrate and hopeful to win exciting lucky draw
                  prizes!
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  className="bg-gradient-to-br
                from-pink-500 to-orange-400 hover:bg-gradient-to-bl text-lg
                font-small"
                >
                  Good Luck :)
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
