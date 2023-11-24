"use client";

import { FormSubmit, JWTGoogleResponse } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRef, useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import {
  CheckInReqest,
  GetEmployeeByEmailRequest,
  checkIn,
  getEmployeeId,
} from "./lib/api";
import { AxiosError } from "axios";

export default function Home() {
  const [userInfo, setUserInfo] = useState<JWTGoogleResponse | null>();
  const [employee, setEmployee] = useState<boolean>(false);
  const employeeIdRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
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
      } catch (err:any) {
          console.log(err.response.data.code)
      }
    },
    onSuccess: async (data, variables, context) => {
      if (data?.data) {
        console.log(data)
        setValue("employeeId", data.data.data.employeeId);
        trigger("employeeId");
        setEmployee(true);
      }
    },
    onError: async(err: any) =>{
      if(err.response.status === 404){
        setValue("employeeId", "");
        employeeIdRef.current?.focus();
      }
    }
  });

  const checkInParty = useMutation({
    mutationFn: async (employeeId: string) => {
      try {
        const req: CheckInReqest = {
          employeeId: employeeId,
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
        onOpen();
      }
    },
    onError: async (error: AxiosError) => {
      console.log(error);
      if (error) {
        toast.dismiss();
        setLoading(false);
        setUserInfo(null);
        // @ts-ignore
        toast.error(error.response?.data.message);
      }
    },
  });

  return (
    <>
      <div className="flex flex-col justify-start flex-wrap content-start gap-6 mt-12 px-6">
        {userInfo ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6 text-center"
          >
            <h1 className="text-4xl mb-6 italic font-bold">
              Arise New Year Party 2023
            </h1>
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

            <Controller
              control={control}
              name="employeeId"
              render={({ field }) => (
                <Input
                  {...field}
                  ref={employeeIdRef}
                  type="tel"
                  maxLength={6}
                  label="employee Id"
                  size="lg"
                  className="input"
                  autoComplete="off"
                  isDisabled={employee}
                />
              )}
            />

            <Button
              className="relative  text-white bg-gradient-to-br
            from-pink-500 to-orange-400 hover:bg-gradient-to-bl
            font-small rounded-lg text-xl px-10 py-2 text-center mb-2 min-w-[160px] h-[64px] font-semibold disabled:opacity-30"
              type="submit"
              color="primary"
              isLoading={loading}
              isDisabled={!isValid}
            >
              Check In
            </Button>
          </form>
        ) : (
          <div className="w-full flex flex-col gap-6 text-center">
            <div>
              <h1 className="text-4xl  italic font-bold tex">
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
                      getEmployeeIdByEmail.mutate(userInfo.email);
                    } else {
                      toast.dismiss();
                      toast.error(
                        "Please sign in with an email from @arise.tech or @infinitaskt.com domains."
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
              <ModalHeader className="flex flex-col gap-1">
              </ModalHeader>
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
