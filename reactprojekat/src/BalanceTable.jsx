import React, { useState } from 'react';
import useExpenses from './useExpenses';
import usePayments from './usePayments';
import TransactionCard from './TransactionCard';
import './BalanceTable.css';

const BalanceTable = () => {
  const { expenses, loading: loadingExpenses, error: errorExpenses } = useExpenses();
  const { payments, loading: loadingPayments, error: errorPayments } = usePayments();

  // State za sortiranje
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' za najstarije, 'desc' za najnovije

  // Izračunavanje krajnjeg bilansa
  const totalExpenses = expenses.reduce((total, expense) => {
    const amount = Number(expense.amount) || 0; // Ensure amount is a number
    return total + amount;
  }, 0);

  const totalPayments = payments.reduce((total, payment) => {
    if (payment.status === 'completed') {
      const amount = Number(payment.amount) || 0; // Ensure amount is a number
      return total + amount;
    }
    return total;
  }, 0);

  const finalBalance = totalPayments - totalExpenses;

  // Funkcija za sortiranje po datumu
  const sortByDate = (array) => {
    return array.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const sortedExpenses = sortByDate([...expenses]);
  const sortedPayments = sortByDate([...payments]);

  // Funkcija za promenu redosleda sortiranja
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loadingExpenses || loadingPayments) return <p>Loading...</p>;
  if (errorExpenses) return <p>{errorExpenses}</p>;
  if (errorPayments) return <p>{errorPayments}</p>;

  return (
    <div className="balance-table-container">
      <h1>Dashboard</h1>
      <button className="sort-button" onClick={toggleSortOrder}>
        Sort by Date ({sortOrder === 'asc' ? 'Oldest First' : 'Newest First'})
      </button>

      <div className="cards-container">
        <div className="expenses-container">
          <h2>Expenses</h2>
          {sortedExpenses.map((expense) => (
            <TransactionCard
              key={expense.id}
              title={expense.category}
              amount={Number(expense.amount)}
              date={expense.created_at} // Koristimo `created_at` za datum
            />
          ))}
        </div>

        <div className="payments-container">
          <h2>Payments</h2>
          {sortedPayments.map((payment) => (
            <TransactionCard
              key={payment.id}
              title={`Payment ${payment.id}`}
              amount={Number(payment.amount)}
              date={payment.created_at} // Koristimo `created_at` za datum
              status={payment.status}
            />
          ))}
        </div>
      </div>

      <div className="final-balance">
        <h2>Final Balance: {finalBalance >= 0 ? `${finalBalance.toFixed(2)} RSD` : `- ${Math.abs(finalBalance).toFixed(2)} RSD`}</h2>
      </div>
    </div>
  );
};

export default BalanceTable;
