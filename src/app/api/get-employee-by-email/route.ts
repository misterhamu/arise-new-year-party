import { NextResponse } from "next/server";
import prisma from "src/app/lib/prisma";

export const POST = async (req: Request, res: Response) => {
  const { email } = await req.json();
  // const redis = createRedisInstance();
  const key = Math.floor(Math.random() * 99);

  // storing data
  // await redis.set(String(key), email);

  // getting data (using the same key as above)
  // const value = await redis.hget(`employee/${email}`, "size" );
  // console.log(value);

  // we can also increment a value by <N>
  // await redis.incrby(email, 1);

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
          data: { employeeId: response.employee_id, size: response.size },
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
