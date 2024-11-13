import { useState, useEffect } from 'react';
import axios from 'axios';

const useIncomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      const token = sessionStorage.getItem('auth_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/incomes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIncomes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load incomes.');
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  return { incomes, setIncomes, loading, error };
};

export default useIncomes;
