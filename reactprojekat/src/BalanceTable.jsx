import React from 'react';
import useExpenses from './useExpenses';
import usePayments from './usePayments';
import './BalanceTable.css';

const BalanceTable = () => {
  const { expenses, loading: loadingExpenses, error: errorExpenses } = useExpenses();
  const { payments, loading: loadingPayments, error: errorPayments } = usePayments();

  // Izračunavanje krajnjeg bilansa
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const totalPayments = payments.reduce((total, payment) => {
    if (payment.status === 'completed') {
      return total + payment.amount;
    }
    return total;
  }, 0);
  const finalBalance = totalPayments - totalExpenses;

  if (loadingExpenses || loadingPayments) return <p>Loading...</p>;
  if (errorExpenses) return <p>{errorExpenses}</p>;
  if (errorPayments) return <p>{errorPayments}</p>;

  return (
    <div className="balance-table-container">
      <h1>Your Expenses and Payments</h1>
      <table className="balance-table">
        <thead>
          <tr>
            <th>Expenses</th>
            <th>Payments</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <ul>
                {expenses.map((expense) => (
                  <li key={expense.id}>
                    {expense.category} - {expense.amount} RSD ({expense.date})
                  </li>
                ))}
              </ul>
            </td>
            <td>
              <ul>
                {payments.map((payment) => (
                  <li key={payment.id}>
                    Payment {payment.id} - {payment.amount} RSD ({payment.status})
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="final-balance">
        <h2>Final Balance: {finalBalance >= 0 ? `${finalBalance} RSD` : `- ${Math.abs(finalBalance)} RSD`}</h2>
      </div>
    </div>
  );
};

export default BalanceTable;
