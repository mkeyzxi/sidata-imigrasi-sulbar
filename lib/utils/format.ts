export const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return date.toLocaleDateString('id-ID', options);
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('id-ID');
};
