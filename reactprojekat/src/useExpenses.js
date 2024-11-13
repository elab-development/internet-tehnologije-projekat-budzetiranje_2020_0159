import { useState, useEffect } from 'react';
import axios from 'axios';

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = sessionStorage.getItem('auth_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/expenses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load expenses.');
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return { expenses, setExpenses,loading, error };
};

export default useExpenses;
