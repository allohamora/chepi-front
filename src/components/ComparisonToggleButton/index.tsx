import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useComparison } from 'src/providers/ComparisonProvider';
import { ComparisonIcon } from '../Icon';
import { Container } from './style';

interface Props {
  id: string;
  className?: string;
}

export const ComparisonToggleButton: FC<Props> = ({ id, className }) => {
  const { t } = useTranslation('comparison-toggle-button');
  const { addPizzas, removePizzas, isInComparisonCheck } = useComparison();

  const isInComparison = isInComparisonCheck(id);
  const toggleComparisonState = () => {
    if (isInComparison) {
      return removePizzas(id);
    }

    return addPizzas(id);
  };

  const title = isInComparison ? t('remove-from-comparison') : t('add-to-comparison');

  return (
    <Container
      isInComparison={isInComparison}
      onClick={toggleComparisonState}
      type="button"
      title={title}
      className={className}
    >
      <ComparisonIcon />
    </Container>
  );
};
