import {Review} from './review';

export interface Appointment {
  email: string;
  hour: string;
  comment?: string;
  review?: Review;
  acceptedByPatient?: boolean;
  acceptedByProfessional?: boolean;
  done?: boolean;
}
