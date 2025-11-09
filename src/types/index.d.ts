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

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  cpf: string;
  birthday: string;
}

export interface RegisterStationData {
  cells: Array;
  latitude: number;
  longitude: number;
}

export interface Station {
  id: string;
  name: string;
  cells: { cellNumber: number; skateId: string | null }[];
  latitude: number;
  longitude: number;
}

export interface MapProps {
  latitude: number | null;
  longitude: number | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  stations: Array<{ latitude: number; longitude: number }>;
}


export interface Rental {
  id: string;
  userId: string;
  createdAt: string;
  endDate?: string | { seconds?: number; _seconds?: number; nanoseconds?: number; _nanoseconds?: number };
  price?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

export interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface TicketData {
  id: string;
  createdAt: FirebaseTimestamp;
  endDate?: FirebaseTimestamp;
  message: string;
  status: string;
  type: string;
  userId: string;
}