export interface Appointment {
    email: string;
  hour: string;
  comment?: string;
  questions?: string[];
  answers?: string[];
  review?: string;
  acceptedByPatient?: string | boolean;
  acceptedByProfessional?: string | boolean;
  done?: boolean;
}
