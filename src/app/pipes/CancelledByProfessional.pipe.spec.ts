import { CancelledByProfessionalPipe } from './CancelledByProfessional.pipe';

describe('CancelledPipe', () => {
  it('create an instance', () => {
    const pipe = new CancelledByProfessionalPipe();
    expect(pipe).toBeTruthy();
  });
});
