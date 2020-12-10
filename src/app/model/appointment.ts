import {DoctorsReview} from './doctors-review';

export interface QuestionsAndAnswers {
  question: string;
  answer: string;
}

export interface Appointment {
    email: string;
  hour: string;
  questionsAndAnswers?: QuestionsAndAnswers[];
  review?: DoctorsReview;
  acceptedByPatient?: string | boolean;
  acceptedByProfessional?: string | boolean;
  done?: boolean;
}
