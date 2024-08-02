export type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";
export type FormErrorType = Record<string, string>;
export type SingleComment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  body: string;
  name: string;
};
