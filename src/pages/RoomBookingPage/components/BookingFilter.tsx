import { useFormContext, useWatch } from 'react-hook-form';
import { Text, Spacing, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS } from 'models/equipment';
import { formatYYYYMMDD } from 'utils/formatYYYYMMDD';
import { TIME_SLOTS } from 'utils/getTimelineOffset';
import type { BookingFormValues } from '../bookingSchema';

interface Props {
  floors: number[];
}

export const BookingFilter = ({ floors }: Props) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  const [startTime, endTime, equipment, preferredFloor] = useWatch<
    BookingFormValues,
    ['startTime', 'endTime', 'equipment', 'preferredFloor']
  >({
    name: ['startTime', 'endTime', 'equipment', 'preferredFloor'],
  });

  const toggleEquipment = (eq: BookingFormValues['equipment'][number]) => {
    const next = equipment.includes(eq) ? equipment.filter(e => e !== eq) : [...equipment, eq];
    setValue('equipment', next, { shouldValidate: true });
  };

  return (
    <div css={{ padding: '0 24px' }}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 조건
      </Text>
      <Spacing size={16} />

      <div css={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          날짜
        </Text>
        <input type="date" min={formatYYYYMMDD(new Date())} aria-label="날짜" css={inputStyle} {...register('date')} />
      </div>
      <Spacing size={14} />

      <div css={{ display: 'flex', gap: 12 }}>
        <div css={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            시작 시간
          </Text>
          <Select
            value={startTime}
            onChange={e => setValue('startTime', e.target.value, { shouldValidate: true })}
            aria-label="시작 시간"
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(0, -1).map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div css={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            종료 시간
          </Text>
          <Select
            value={endTime}
            onChange={e => setValue('endTime', e.target.value, { shouldValidate: true })}
            aria-label="종료 시간"
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(1).map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {errors.endTime && (
        <>
          <Spacing size={8} />
          <span css={{ color: colors.red500, fontSize: 14 }} role="alert">
            {errors.endTime.message}
          </span>
        </>
      )}
      <Spacing size={14} />

      <div css={{ display: 'flex', gap: 12 }}>
        <div css={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            참석 인원
          </Text>
          <input
            type="number"
            min={1}
            aria-label="참석 인원"
            css={inputStyle}
            {...register('attendees', { valueAsNumber: true })}
          />
          {errors.attendees && (
            <>
              <Spacing size={4} />
              <span css={{ color: colors.red500, fontSize: 14 }} role="alert">
                {errors.attendees.message}
              </span>
            </>
          )}
        </div>
        <div css={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            선호 층
          </Text>
          <Select
            value={preferredFloor}
            onChange={e => setValue('preferredFloor', e.target.value, { shouldValidate: true })}
            aria-label="선호 층"
          >
            <option value="">전체</option>
            {floors.map(f => (
              <option key={f} value={f}>
                {f}층
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Spacing size={14} />

      <div>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          필요 장비
        </Text>
        <Spacing size={8} />
        <div css={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ALL_EQUIPMENT.map(eq => {
            const selected = equipment.includes(eq);
            return (
              <button
                key={eq}
                type="button"
                onClick={() => toggleEquipment(eq)}
                aria-label={EQUIPMENT_LABELS[eq]}
                aria-pressed={selected}
                css={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: `1px solid ${selected ? colors.blue500 : colors.grey200}`,
                  background: selected ? colors.blue50 : colors.grey50,
                  color: selected ? colors.blue600 : colors.grey700,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: selected ? colors.blue500 : colors.grey400 },
                }}
              >
                {EQUIPMENT_LABELS[eq]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  boxSizing: 'border-box' as const,
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1.5,
  height: 48,
  backgroundColor: colors.grey50,
  borderRadius: 12,
  color: colors.grey800,
  width: '100%',
  border: `1px solid ${colors.grey200}`,
  padding: '0 16px',
  outline: 'none',
  transition: 'border-color 0.15s',
  '&:focus': { borderColor: colors.blue500 },
};
