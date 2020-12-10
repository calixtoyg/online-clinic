import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Calendar} from '../model/calendar';
import {Observable, pipe} from 'rxjs';
import {first, map, take, tap} from 'rxjs/operators';
import {AppointmentWithCalendarId} from '../model/appointment-with-calendar-id';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private store: AngularFirestore) {
  }

  saveCalendars(calendars: Calendar[]): Promise<void> {
    const batch = this.store.firestore.batch();
    calendars.forEach((calendar: Calendar) => {
      const calendarRef = this.store.collection<Calendar>('calendar').ref.doc();
      batch.set(calendarRef, calendar);
    });
    return batch.commit();
  }

  saveCalendar(calendar: Calendar, id: string): Promise<void> {
    id = id || this.store.createId();
    return this.store.collection<Calendar>('calendar').doc(id).set({...calendar});
  }

  updateCalendar(calendar: Calendar) {
    return this.store.collection<Calendar>('calendar').doc(calendar.id).set({...calendar});
  }

  getCalendars(): Observable<Calendar[]> {
    return this.store.collection<Calendar>('calendar').snapshotChanges().pipe(
      map(dataArray => dataArray.map(each => {
        const data = each.payload.doc.data() as Calendar;
        data.id = each.payload.doc.id;
        return data;
      }))
    );
  }

  getCalendarsByYear(year: number): Observable<Calendar[]> {
    return this.store.collection<Calendar>('calendar', ref => ref.where('year', '==', year)).snapshotChanges().pipe(
      map(dataArray => dataArray.map(each => {
        const data = each.payload.doc.data() as Calendar;
        data.id = each.payload.doc.id;
        return data;
      }))
    );
  }

  getCalendarsByYearMonthDay({year, month, day}: { year: number, month: number, day: number }): Observable<Calendar[]> {
    return this.store.collection<Calendar>('calendar', ref => ref
      .where('year', '==', year)
      .where('month', '==', month)
      .where('day', '==', day))
      .snapshotChanges()
      .pipe(
        map(dataArray => dataArray.map(each => {
          const data = each.payload.doc.data() as Calendar;
          data.id = each.payload.doc.id;
          return data;
        }))
      ).pipe(
        first()
      );
  }

  getCalendarsAppointmentsByYearMonthDay({year, month, day, email}: { year: number, month: number, day: number, email: string }): Observable<AppointmentWithCalendarId[]> {
    return this.store.collection<Calendar>('calendar', ref => ref
      .where('year', '==', year)
      .where('month', '==', month)
      .where('day', '==', day))
      .snapshotChanges()
      .pipe(
        map(dataArray => dataArray.map(each => {
          const data = each.payload.doc.data() as Calendar;
          data.id = each.payload.doc.id;
          return data;
        }))
      ).pipe(
        first()
      ).pipe(
        map(calendars => calendars.flatMap(calendar => {
          return calendar.schedule
            .filter(schedule => schedule.medicId === email)
            .flatMap(value => value.appointments.map(appointment => {
                return {
                  ...appointment,
                  calendarId: calendar.id,
                  date: new Date(calendar.year, calendar.month, calendar.day),
                } as AppointmentWithCalendarId;
              })
            );
        })));
  }

  getCalendarById(calendarId: string): Promise<Calendar> {
    return this.store.doc<Calendar>('calendar/' + calendarId).snapshotChanges()
      .pipe(
        map(dataArray => {
          const data = dataArray.payload.data() as Calendar;
          data.id = dataArray.payload.id;
          return data;
        }))
      .pipe(take(1)).toPromise();
  }

  getCalendarsAppointmentsByYearAndProfessionalEmail(year: number, email: string): Observable<any> {
    return this.getCalendarsByYear(year).pipe(
      map(
        calendarArray => {
          return calendarArray
            .flatMap(calendar => {
              return calendar.schedule
                .filter(schedule => schedule.medicId === email)
                .flatMap(value => value.appointments.map(appointment => {
                    return {
                      ...appointment,
                      calendarId: calendar.id,
                      date: new Date(calendar.year, calendar.month, calendar.day)
                    } as AppointmentWithCalendarId;
                  })
                );
            });
        }
      )
    );
  }

  getCalendarsAppointmentsByYear(year: number): Observable<any> {
    return this.getCalendarsByYear(year).pipe(
      map(
        calendarArray => {
          return calendarArray
            .flatMap(calendar => calendar.schedule
              .flatMap(value => value.appointments.map(appointment => {
                  return {...appointment, calendarId: calendar.id, date: new Date(calendar.year, calendar.month, calendar.day)};
                })
              ));
        }
      )
    )
      .pipe(
        tap(value => {
          console.log(value);
        })
      );
  }
}
