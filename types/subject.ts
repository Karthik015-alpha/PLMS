import type { IsoDateString } from "./auth";

export type SubjectId = string;

export interface SubjectBaseFields {
  title: string;
  description?: string;
}

export interface SubjectProgressFields {
  progress: number;
}

export interface SubjectTimestamps {
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Subject extends SubjectBaseFields, SubjectProgressFields, SubjectTimestamps {
  id: SubjectId;
}

export type SubjectCreatePayload = SubjectBaseFields;

export type SubjectUpdatePayload = Partial<SubjectBaseFields> &
  Partial<SubjectProgressFields>;

export type SubjectCreateRequest = SubjectCreatePayload;
export type SubjectUpdateRequest = SubjectUpdatePayload;

export interface SubjectError {
  code: string;
  message: string;
  field?: string;
}

export interface SubjectSuccessResponse<TData> {
  success: true;
  data: TData;
  message?: string;
}

export interface SubjectFailureResponse {
  success: false;
  error: SubjectError;
}

export type SubjectApiResponse<TData> =
  | SubjectSuccessResponse<TData>
  | SubjectFailureResponse;

export type SubjectResponse = SubjectApiResponse<Subject>;
export type SubjectsResponse = SubjectApiResponse<readonly Subject[]>;
