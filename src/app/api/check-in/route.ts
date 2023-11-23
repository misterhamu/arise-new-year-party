// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import prisma from "src/app/lib/prisma";

export const POST = async (req: Request, res: Response) => {
  const  {employeeId}  = await req.json();
  try {
    const response = await prisma.checkin.create({
      data: {
        employee_id: employeeId,
        created_time_date: new Date(),
        updated_time_date: new Date()
      },
    });

    console.log(response);
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
    return NextResponse.json({ message: "You have already checked in." }, { status: 400 });
  }
};
