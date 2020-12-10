import {DoctorsReview} from './doctors-review';

export interface QuestionsAndAnswers {
  question: string;
  answer: string;
}

export interface AppointmentWithCalendarId {
  email: string;
  hour: string;
  questionsAndAnswers?: QuestionsAndAnswers[];
  review?: DoctorsReview;
  acceptedByPatient?: string | boolean;
  acceptedByProfessional?: string | boolean;
  done?: boolean;
  calendarId: string;
  date: Date;
  medicId?: string;
}
