// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import prisma from "src/app/lib/prisma";

export const POST = async (req: Request, res: Response) => {
  const  {employeeId , email }  = await req.json();
  const currentTime = new Date();
  const timeZoneOffset = 7 * 60;
  const adjustedTime = new Date(currentTime.getTime() + timeZoneOffset * 60 * 1000);

  try {
    const response = await prisma.checkin.create({
      data: {
        employee_id: employeeId,
        email: email,
        eligible: email.split("@")[1] === "arise.tech",
        is_claimed: false,
        created_time_date: adjustedTime,
        updated_time_date: adjustedTime,
      },
    });

    if(response){
      return NextResponse.json(
        {
          message: "Checked in successfully.",
        },
        { status: 201 }
      );
    } else{
      return NextResponse.json(
        {
          message: "Sorry, can't check in",
          data: {},
        },
        { status: 400 }
      );
    }
   
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "You have already checked in." }, { status: 400 });
  }
};
