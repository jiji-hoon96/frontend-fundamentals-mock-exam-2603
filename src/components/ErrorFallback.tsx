import { FallbackProps } from 'react-error-boundary';
import { Text, Button, Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        문제가 발생했습니다
      </Text>
      <Spacing size={8} />
      <Text typography="t7" color={colors.grey500}>
        {error?.message || '잠시 후 다시 시도해주세요.'}
      </Text>
      <Spacing size={20} />
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </div>
  );
};
