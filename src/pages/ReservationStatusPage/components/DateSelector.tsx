import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { formatYYYYMMDD } from 'utils/formatYYYYMMDD';

interface Props {
  date: string;
  setDate: (date: string) => void;
}

export const DateSelector = ({ date, setDate }: Props) => {
  return (
    <div css={{ padding: '0 24px' }}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        날짜 선택
      </Text>
      <Spacing size={16} />
      <div css={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <input
          type="date"
          value={date}
          min={formatYYYYMMDD(new Date())}
          onChange={e => {
            if (e.target.value) setDate(e.target.value);
          }}
          aria-label="날짜"
          css={{
            boxSizing: 'border-box',
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
          }}
        />
      </div>
    </div>
  );
};
