import { useState, useEffect } from 'react';
import axios from 'axios';

const usePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const token = sessionStorage.getItem('auth_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/payments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load payments.');
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return { payments, loading, error };
};

export default usePayments;
