export default interface Staff {
  id: string;
    isOpen: boolean;
    onClose: () => void;
    name: string;
    email: string;
    phoneNumber: number;
    address: string;
    status: "ACTIVE" | "INACTIVE";
    role: "ADMIN" | "DOCTOR" | "STAFF"
  }

  export interface Patient {
  id: string;
    name: string;
    phoneNumber: number;
    age: number;
    address: string;
    todayTurn: number
}