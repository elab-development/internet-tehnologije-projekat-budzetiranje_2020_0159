import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('RSD'); // Default currency
  const [exchangeRates, setExchangeRates] = useState({}); // Storing exchange rates
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const usersPerPage = 5; // Number of users per page

  useEffect(() => {
    const fetchUsersData = async () => {
      const token = sessionStorage.getItem('auth_token');
      try {
        const usersResponse = await axios.get('http://127.0.0.1:8000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersData = usersResponse.data;

        const transactionsPromises = usersData.map(async (user) => {
          const expensesResponse = await axios.get(`http://127.0.0.1:8000/api/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { paid_by: user.id },
          });

          const paymentsResponse = await axios.get(`http://127.0.0.1:8000/api/payments`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { payer_id: user.id },
          });

          const incomesResponse = await axios.get(`http://127.0.0.1:8000/api/incomes`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { receiver_id: user.id },
          });

          const expenses = expensesResponse.data;
          const payments = paymentsResponse.data;
          const incomes = incomesResponse.data;

          const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
          const totalPayments = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
          const totalIncomes = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);

          const totalTransactions = expenses.length + payments.length + incomes.length;
          const balance = totalIncomes - totalExpenses - totalPayments;

          return {
            ...user,
            totalExpenses,
            totalPayments,
            totalIncomes,
            totalTransactions,
            balance,
          };
        });

        const usersWithTransactions = await Promise.all(transactionsPromises);
        setUsers(usersWithTransactions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  // Fetching exchange rates from an API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/97881401fc7e1ad5c8095cd5/latest/RSD`
        );
        setExchangeRates(response.data.conversion_rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const convertCurrency = (amount) => {
    if (currency === 'RSD' || !exchangeRates[currency]) return amount; // If currency is RSD, no need for conversion
    return amount * exchangeRates[currency]; // Apply exchange rate
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    const token = sessionStorage.getItem('auth_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Currency selector */}
      <div className="currency-select">
        <label>Select Currency: </label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {Object.keys(exchangeRates).map((currencyCode) => (
            <option key={currencyCode} value={currencyCode}>
              {currencyCode}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Total Transactions</th>
            <th>Total Expenses ({currency})</th>
            <th>Total Payments ({currency})</th>
            <th>Total Incomes ({currency})</th>
            <th>Balance ({currency})</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.totalTransactions}</td>
              <td>{convertCurrency(user.totalExpenses).toFixed(2)}</td>
              <td>{convertCurrency(user.totalPayments).toFixed(2)}</td>
              <td>{convertCurrency(user.totalIncomes).toFixed(2)}</td>
              <td>{convertCurrency(user.balance).toFixed(2)}</td>
              <td>
                <button onClick={() => deleteUser(user.id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)} className={index + 1 === currentPage ? 'active' : ''}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
