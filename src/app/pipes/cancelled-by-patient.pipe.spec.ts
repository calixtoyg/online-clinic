import { CancelledByPatientPipe } from './cancelled-by-patient.pipe';

describe('CancelledByPatientPipe', () => {
  it('create an instance', () => {
    const pipe = new CancelledByPatientPipe();
    expect(pipe).toBeTruthy();
  });
});
