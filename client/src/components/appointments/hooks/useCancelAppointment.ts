import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';
import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useCancelAppointment(): UseMutateFunction<
  void,
  unknown,
  Appointment,
  unknown
> {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const { mutate } = useMutation(
    (appointment: Appointment) => removeAppointmentUser(appointment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.appointments]);
        toast({
          title: 'You have canceled the appointment!',
          status: 'warning',
        });
      },
    },
  );

  return mutate;
}
