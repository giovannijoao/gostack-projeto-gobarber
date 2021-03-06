import 'reflect-metadata';
import { eachHourOfInterval } from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProvidersMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('should be able to list the month availability from provider', async () => {
    const fullfilledDayHours = eachHourOfInterval({
      start: new Date(2020, 7, 20, 8, 0, 0),
      end: new Date(2020, 7, 20, 17, 0, 0),
    });
    await Promise.all(
      [
        new Date(2020, 7, 19, 8, 0, 0),
        new Date(2020, 7, 20, 8, 0, 0),
        new Date(2020, 7, 21, 8, 0, 0),
        new Date(2020, 7, 22, 9, 0, 0),
        new Date(2020, 8, 21, 8, 0, 0),
        ...fullfilledDayHours,
      ].map(date =>
        fakeAppointmentsRepository.create({
          date,
          user_id: 'user_id',
          provider_id: 'provider_id',
        }),
      ),
    );
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 7, 19, 11).getTime());
    const availability = await listProvidersMonthAvailability.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: 8,
    });
    expect(availability).toEqual(
      expect.arrayContaining([
        {
          day: 18,
          available: false,
        },
        {
          day: 19,
          available: true,
        },
        {
          day: 20,
          available: false,
        },
        {
          day: 21,
          available: true,
        },
        {
          day: 22,
          available: true,
        },
      ]),
    );
  });
});
