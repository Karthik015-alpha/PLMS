import type { IsoDateString } from "./auth";
import type { SubjectId } from "./subject";

export const TOPIC_STATUS_VALUES = [
  "Not Started",
  "In Progress",
  "Completed",
] as const;

export type TopicStatus = (typeof TOPIC_STATUS_VALUES)[number];

export type TopicId = string;

export interface TopicBaseFields {
  subjectId: SubjectId;
  title: string;
  status: TopicStatus;
  estimatedHours?: number;
}

export interface TopicTimestamps {
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface Topic extends TopicBaseFields, TopicTimestamps {
  id: TopicId;
}

export type TopicCreatePayload = TopicBaseFields;

export type TopicUpdatePayload = Partial<Omit<TopicBaseFields, "subjectId">>;

export type TopicCreateRequest = TopicCreatePayload;
export type TopicUpdateRequest = TopicUpdatePayload;

export interface TopicError {
  code: string;
  message: string;
  field?: string;
}

export interface TopicSuccessResponse<TData> {
  success: true;
  data: TData;
  message?: string;
}

export interface TopicFailureResponse {
  success: false;
  error: TopicError;
}

export type TopicApiResponse<TData> =
  | TopicSuccessResponse<TData>
  | TopicFailureResponse;

export type TopicResponse = TopicApiResponse<Topic>;
export type TopicsResponse = TopicApiResponse<readonly Topic[]>;
