import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface Props {
  message?: string;
}

export const Loading = ({ message = '로딩 중...' }: Props) => {
  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 0',
      }}
    >
      <Text typography="t6" color={colors.grey500}>
        {message}
      </Text>
    </div>
  );
};
