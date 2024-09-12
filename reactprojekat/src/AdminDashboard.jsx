import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination, useGlobalFilter } from 'react-table'; // Dodajemo potrebne hookove
import './AdminDashboard.css'; // Dodaj stilove za tabelu

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsersData = async () => {
      const token = sessionStorage.getItem('auth_token');
      try {
        const usersResponse = await axios.get('http://127.0.0.1:8000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersData = usersResponse.data;

        // Mapiranje korisnika da dobijemo njihove troškove, plaćanja i prihode
        const transactionsPromises = usersData.map(async (user) => {
          const expensesResponse = await axios.get(`http://127.0.0.1:8000/api/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { paid_by: user.id }
          });

          const paymentsResponse = await axios.get(`http://127.0.0.1:8000/api/payments`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { payer_id: user.id }
          });

          const incomesResponse = await axios.get(`http://127.0.0.1:8000/api/incomes`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { receiver_id: user.id }
          });

          const expenses = expensesResponse.data;
          const payments = paymentsResponse.data;
          const incomes = incomesResponse.data;

          // Računanje ukupnih vrednosti
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

  const data = React.useMemo(() => users, [users]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'name', // Polje korisničkog imena
      },
      {
        Header: 'Total Transactions',
        accessor: 'totalTransactions',
      },
      {
        Header: 'Total Expenses (RSD)',
        accessor: 'totalExpenses',
        Cell: ({ value }) => value.toFixed(2),
      },
      {
        Header: 'Total Payments (RSD)',
        accessor: 'totalPayments',
        Cell: ({ value }) => value.toFixed(2),
      },
      {
        Header: 'Total Incomes (RSD)',
        accessor: 'totalIncomes',
        Cell: ({ value }) => value.toFixed(2),
      },
      {
        Header: 'Balance (RSD)',
        accessor: 'balance',
        Cell: ({ value }) => (value >= 0 ? value.toFixed(2) : `- ${Math.abs(value).toFixed(2)}`),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // paginated data
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
      initialState: { pageIndex: 0 }, // Paginacija počinje od prve stranice
    },
    useGlobalFilter, // Dodajemo globalni filter
    usePagination // Dodajemo paginaciju
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

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
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
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
