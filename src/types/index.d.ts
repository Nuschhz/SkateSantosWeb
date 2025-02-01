import { IconDefinition } from "@fortawesome/free-solid-svg-icons"; 

export interface InputType {
    value: string;
    placeholder?: string;
    className?: string;
    type: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
export interface IndexButton {
  title: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}
export interface SubMenuProps {
  title: string;
  icon: IconDefinition;
  items: { label: string; href: string; icon: IconDefinition }[];
  isExpanded: boolean;
}

export interface User {
  id: string;
  cpf: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  credits: number;
  strikes: string;
}

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  cpf: string;
  birthday: string;
}
