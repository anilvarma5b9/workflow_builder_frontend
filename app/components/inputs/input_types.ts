export const convertEnumToOptions = (enumObj: object): SelectOption[] => {
  return Object.values(enumObj).map((key) => ({
    key: key.toString(),
    label: key
      .toString()
      .replace(/([A-Z])/g, " $1")
      .trim(),
  }));
};

export interface SelectOption {
  label: string;
  key: string;
}

export const enumToOptions = (enumObj: object): SelectOption[] => {
  return Object.entries(enumObj).map(([key, label]) => ({
    label: label,
    key: key as string,
  }));
};

export const getEnumValues = (enumObj: object): string[] => {
  return Object.values(enumObj) as string[];
};

export const getEnumValues_ = <T extends Record<string, string>>(
  enumObj: T
): T[keyof T][] => {
  return Object.values(enumObj) as T[keyof T][];
};
