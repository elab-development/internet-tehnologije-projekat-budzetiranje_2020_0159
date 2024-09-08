import React, { useState } from 'react';
import useExpenses from './useExpenses';
import usePayments from './usePayments';
import TransactionCard from './TransactionCard';
import './BalanceTable.css';
import axios from 'axios';

const BalanceTable = () => {
  const { expenses, setExpenses, loading: loadingExpenses, error: errorExpenses } = useExpenses();
  const { payments, setPayments, loading: loadingPayments, error: errorPayments } = usePayments();

  const [newExpense, setNewExpense] = useState({
    amount: '',
    date: '',
    category: '',
    description: ''
  });

  const [newPayment, setNewPayment] = useState({
   
    payee_id: '',
    amount: '',
    status: 'pending'
  });

  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for oldest first, 'desc' for newest first

  // Handle form input changes for new expenses and payments
  const handleExpenseChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
  };

  // Submit new expense
  const submitExpense = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('auth_token');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/expenses', newExpense, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses([...expenses, response.data]); // Add new expense to the list
      setNewExpense({ amount: '', date: '', category: '', description: '' }); // Reset the form
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  // Submit new payment
  const submitPayment = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('auth_token');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/payments', newPayment, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments([...payments, response.data]); // Add new payment to the list
      setNewPayment({ expense_id: '', payer_id: '', payee_id: '', amount: '', status: 'pending' }); // Reset the form
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  // Sorting by date
  const sortByDate = (array) => array.sort((a, b) => (sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at)));
  const sortedExpenses = sortByDate([...expenses]);
  const sortedPayments = sortByDate([...payments]);

  const toggleSortOrder = () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

  // Calculate final balance
  const totalExpenses = expenses.reduce((total, expense) => total + Number(expense.amount), 0);
  const totalPayments = payments.reduce((total, payment) => total + (payment.status === 'completed' ? Number(payment.amount) : 0), 0);
  const finalBalance = totalPayments - totalExpenses;  // This is the missing part

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
              id={expense.id}
              title={expense.category}
              amount={Number(expense.amount)}
              date={expense.created_at}
              type="expense"
              onDelete={() => setExpenses(expenses.filter((exp) => exp.id !== expense.id))}
            />
          ))}
        </div>

        <div className="payments-container">
          <h2>Payments</h2>
          {sortedPayments.map((payment) => (
            <TransactionCard
              key={payment.id}
              id={payment.id}
              title={`Payment ${payment.id}`}
              amount={Number(payment.amount)}
              date={payment.created_at}
              status={payment.status}
              type="payment"
              onDelete={() => setPayments(payments.filter((pay) => pay.id !== payment.id))}
            />
          ))}
        </div>
      </div>

      {/* Form for creating new expense */}
      <div className="form-container">
        <h2>Create New Expense</h2>
        <form onSubmit={submitExpense}>
          <input type="text" name="category" placeholder="Category" value={newExpense.category} onChange={handleExpenseChange} required />
          <input type="number" name="amount" placeholder="Amount" value={newExpense.amount} onChange={handleExpenseChange} required />
          <input type="date" name="date" value={newExpense.date} onChange={handleExpenseChange} required />
          <textarea name="description" placeholder="Description" value={newExpense.description} onChange={handleExpenseChange} />
          <button type="submit">Add Expense</button>
        </form>
      </div>

      {/* Form for creating new payment */}
      <div className="form-container">
        <h2>Create New Payment</h2>
        <form onSubmit={submitPayment}>
          <input type="text" name="payee_id" placeholder="Payee ID" value={newPayment.payee_id} onChange={handlePaymentChange} required />
          <input type="number" name="amount" placeholder="Amount" value={newPayment.amount} onChange={handlePaymentChange} required />
          <select name="status" value={newPayment.status} onChange={handlePaymentChange}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit">Add Payment</button>
        </form>
      </div>

      <div className="final-balance">
        <h2>Final Balance: {finalBalance >= 0 ? `${finalBalance.toFixed(2)} RSD` : `- ${Math.abs(finalBalance).toFixed(2)} RSD`}</h2>
      </div>
    </div>
  );
};

export default BalanceTable;
