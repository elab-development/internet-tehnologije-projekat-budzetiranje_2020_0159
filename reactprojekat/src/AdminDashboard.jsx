import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('RSD'); // Default valuta
  const [exchangeRates, setExchangeRates] = useState({}); // Čuvamo kursnu listu

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

  // Fetchovanje kursne liste iz API-ja
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
    if (currency === 'RSD' || !exchangeRates[currency]) return amount; // Ako je valuta RSD, nema potrebe za konverzijom
    return amount * exchangeRates[currency]; // Primena kursa
  };

  const data = React.useMemo(() => users, [users]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'name',
      },
      {
        Header: 'Total Transactions',
        accessor: 'totalTransactions',
      },
      {
        Header: `Total Expenses (${currency})`,
        accessor: 'totalExpenses',
        Cell: ({ value }) => convertCurrency(value).toFixed(2),
      },
      {
        Header: `Total Payments (${currency})`,
        accessor: 'totalPayments',
        Cell: ({ value }) => convertCurrency(value).toFixed(2),
      },
      {
        Header: `Total Incomes (${currency})`,
        accessor: 'totalIncomes',
        Cell: ({ value }) => convertCurrency(value).toFixed(2),
      },
      {
        Header: `Balance (${currency})`,
        accessor: 'balance',
        Cell: ({ value }) => convertCurrency(value).toFixed(2),
      },
    ],
    [currency, exchangeRates]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setGlobalFilter,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Odabir valute */}
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

      {/* Globalni filter */}
      <input
        type="text"
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search users..."
        className="search-input"
      />

      {/* Tabela sa paginacijom */}
      <table {...getTableProps()} className="dashboard-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Navigacija kroz paginaciju */}
      <div className="pagination">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
