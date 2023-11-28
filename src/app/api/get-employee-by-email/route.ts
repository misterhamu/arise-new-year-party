import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import prisma from "src/app/lib/prisma";

export const POST = async (req: Request, res: Response) => {
  const { email } = await req.json();
  try {
    const response = await prisma.employee.findFirst({
      where: {
        email: email,
      },
    });
    if (response) {
      return NextResponse.json(
        {
          message: "Success",
          data: { employeeId: response.employee_id },
        },
        { status: 200 }
      );
    } else {
      if (email.split("@")[1] == "arise.tech") {
        return NextResponse.json(
          {
            message: "Data not found",
            code: 4001,
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Data not found",
            code: 4002,
          },
          { status: 400 }
        );
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error",
        data: {},
      },
      {
        status: 500,
      }
    );
  }
};
