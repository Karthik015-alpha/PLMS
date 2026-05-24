import type {
  Subject,
  SubjectApiResponse,
  SubjectCreatePayload,
  SubjectCreateRequest,
  SubjectResponse,
  SubjectsResponse,
  SubjectUpdatePayload,
  SubjectUpdateRequest,
} from "@/types/subject";
import type {
  SubjectCreateInput,
  SubjectUpdateInput,
} from "./subjects.validation";

export type SubjectFormMode = "create" | "edit";

export type SubjectFormStatus = "idle" | "submitting" | "success" | "error";

export interface SubjectFormValuesByMode {
  create: SubjectCreateInput;
  edit: SubjectUpdateInput;
}

export type SubjectFormValues<TMode extends SubjectFormMode> =
  SubjectFormValuesByMode[TMode];

export type SubjectFormFieldKey<TValues> = Extract<keyof TValues, string> | "form";

export type SubjectFormFieldErrors<TValues> = Partial<
  Record<SubjectFormFieldKey<TValues>, string>
>;

export type SubjectSubmitHandler<TValues, TResponse> = (
  values: TValues,
) => Promise<TResponse> | TResponse;

export interface SubjectBaseFormProps<TValues, TResponse> {
  onSubmit: SubjectSubmitHandler<TValues, TResponse>;
  initialValues?: Partial<TValues>;
  errors?: SubjectFormFieldErrors<TValues>;
  status?: SubjectFormStatus;
  disabled?: boolean;
}

export type SubjectFormProps<TMode extends SubjectFormMode> = SubjectBaseFormProps<
  SubjectFormValues<TMode>,
  SubjectFormResponse<TMode>
> & {
  mode: TMode;
};

export type SubjectCreateFormValues = SubjectFormValues<"create">;
export type SubjectEditFormValues = SubjectFormValues<"edit">;

export type SubjectCreateFormProps = SubjectFormProps<"create">;
export type SubjectEditFormProps = SubjectFormProps<"edit">;

export type CreateSubjectRequest = SubjectCreateRequest;
export type UpdateSubjectRequest = SubjectUpdateRequest;

export type CreateSubjectPayload = SubjectCreatePayload;
export type UpdateSubjectPayload = SubjectUpdatePayload;

export type CreateSubjectResponse = SubjectResponse;
export type UpdateSubjectResponse = SubjectResponse;
export type GetSubjectResponse = SubjectResponse;
export type ListSubjectsResponse = SubjectsResponse;
export type DeleteSubjectResponse = SubjectApiResponse<{ id: Subject["id"] }>;

export interface SubjectFormResponseByMode {
  create: CreateSubjectResponse;
  edit: UpdateSubjectResponse;
}

export type SubjectFormResponse<TMode extends SubjectFormMode> =
  SubjectFormResponseByMode[TMode];
