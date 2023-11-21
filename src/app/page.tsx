"use client";

import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  Card,
} from "@nextui-org/react";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";
import { CardFooter, Image } from "@nextui-org/react";
import { useState } from "react";
export default function Home() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const [content, setContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(!loading);
    setTimeout(() => {
      setLoading(false);
      setContent(!content);
    }, 2000);
  };

  return (
    <>
      <div className="flex flex-col justify-start flex-wrap content-start gap-6">
        <div>
          <p className="text-4xl font-bold mb-2">Click Me :)</p>

          {content && (
            <Card isFooterBlurred radius="lg" className="border-none">
              <Image
                alt="Woman listing to music"
                className="object-cover"
                height={200}
                src="https://nextui.org/images/hero-card-complete.jpeg"
                width={200}
              />
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">Available soon.</p>
                <Button
                  className="text-tiny text-white bg-black/20"
                  variant="flat"
                  color="default"
                  radius="lg"
                  size="sm"
                >
                  Notify me
                </Button>
              </CardFooter>
            </Card>
          )}

          <div className="flex gap-2 mt-2 ">

              <Button color="primary" isLoading={loading} onClick={handleClick} isDisabled={content}>
                Click
              </Button>

              <Button
                onClick={() => {
                  setContent(false);
                  setLoading(false);
                }}
              >
                Clear
              </Button>

          </div>
        </div>
      </div>
    </>
  );
}
