import type {
  Topic,
  TopicApiResponse,
  TopicCreatePayload,
  TopicCreateRequest,
  TopicResponse,
  TopicsResponse,
  TopicStatus,
  TopicUpdatePayload,
  TopicUpdateRequest,
} from "@/types/topic";
import type { SubjectId } from "@/types/subject";
import type { TopicCreateInput, TopicUpdateInput } from "./topics.validation";

export type TopicFormMode = "create" | "edit";

export type TopicFormStatus = "idle" | "submitting" | "success" | "error";

export interface TopicFormValuesByMode {
  create: TopicCreateInput;
  edit: TopicUpdateInput;
}

export type TopicFormValues<TMode extends TopicFormMode> =
  TopicFormValuesByMode[TMode];

export type TopicFormFieldKey<TValues> = Extract<keyof TValues, string> | "form";

export type TopicFormFieldErrors<TValues> = Partial<
  Record<TopicFormFieldKey<TValues>, string>
>;

export type TopicSubmitHandler<TValues, TResponse> = (
  values: TValues,
) => Promise<TResponse> | TResponse;

export interface TopicBaseFormProps<TValues, TResponse> {
  onSubmit: TopicSubmitHandler<TValues, TResponse>;
  initialValues?: Partial<TValues>;
  errors?: TopicFormFieldErrors<TValues>;
  status?: TopicFormStatus;
  disabled?: boolean;
}

export type TopicFormProps<TMode extends TopicFormMode> = TopicBaseFormProps<
  TopicFormValues<TMode>,
  TopicFormResponse<TMode>
> & {
  mode: TMode;
};

export interface TopicCreateContext {
  subjectId: SubjectId;
}

export interface TopicUpdateContext {
  subjectId: SubjectId;
  topicId: Topic["id"];
}

export interface TopicFormMetadata {
  availableStatuses: readonly TopicStatus[];
}

export type TopicCreateFormValues = TopicFormValues<"create">;
export type TopicEditFormValues = TopicFormValues<"edit">;

export type TopicCreateFormProps = TopicFormProps<"create">;
export type TopicEditFormProps = TopicFormProps<"edit">;

export type CreateTopicRequest = TopicCreateRequest;
export type UpdateTopicRequest = TopicUpdateRequest;

export type CreateTopicPayload = TopicCreatePayload;
export type UpdateTopicPayload = TopicUpdatePayload;

export type CreateTopicResponse = TopicResponse;
export type UpdateTopicResponse = TopicResponse;
export type GetTopicResponse = TopicResponse;
export type ListTopicsResponse = TopicsResponse;
export type DeleteTopicResponse = TopicApiResponse<{ id: Topic["id"] }>;

export interface TopicFormResponseByMode {
  create: CreateTopicResponse;
  edit: UpdateTopicResponse;
}

export type TopicFormResponse<TMode extends TopicFormMode> =
  TopicFormResponseByMode[TMode];
