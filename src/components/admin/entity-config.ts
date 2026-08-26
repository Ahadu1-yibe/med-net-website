export type FieldConfig = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "markdown"
    | "select"
    | "date"
    | "datetime"
    | "image"
    | "tags"
    | "number"
    | "checkbox";
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
  full?: boolean;
  side?: boolean;
};

export type EntityFormConfig = {
  fields: FieldConfig[];
  sidebarFields: FieldConfig[];
};
