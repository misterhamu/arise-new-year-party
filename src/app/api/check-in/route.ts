// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "src/app/lib/prisma";

export const POST = async (req: Request, res: Response) => {
  const { employeeId, email } = await req.json();
  const currentTime = new Date();
  const timeZoneOffset = 7 * 60;
  const adjustedTime = new Date(
    currentTime.getTime() + timeZoneOffset * 60 * 1000
  );

  const blackList = [
    600322, 648107, 560907, 100000, 100001, 229010, 600093, 610651,667036
  ];

  try {
    const response = await prisma.checkin.create({
      data: {
        employee_id: employeeId,
        email: email,
        eligible: email.split("@")[1] === "arise.tech",
        is_claimed: blackList.includes(employeeId),
        created_time_date: adjustedTime,
        updated_time_date: adjustedTime,
      },
    });

    if (response) {
      return NextResponse.json(
        {
          message: "Checked in successfully.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "You have already checked in.", code: 4001 },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { message: "Failed to check-in please try again.", code: 4002 },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "System error please try again.", code: 5001 },
        { status: 500 }
      );
    }
  }
};
