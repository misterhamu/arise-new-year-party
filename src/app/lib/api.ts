import HttpClient from "./http-clients";

export type GetEmployeeByEmailRequest = {
  email: string;
};

export type GetEmployeeByEmailResponse = {
  message: string;
  data: EmployeeId;
};

export interface EmployeeId {
  employeeId: string;
}

export const getEmployeeId = async (req: GetEmployeeByEmailRequest) => {
  return HttpClient.post<GetEmployeeByEmailResponse>(
    `/api/get-employee-by-email`,
    req
  );
};

export type CheckInReqest = {
  employeeId: string;
};

export const checkIn = async (req: CheckInReqest) => {
  return HttpClient.post("/api/check-in", req);
};
