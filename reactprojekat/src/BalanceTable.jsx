import React, { useState } from 'react';
import useExpenses from './useExpenses';
import usePayments from './usePayments';
import useIncomes from './useIncomes';
import useUsers from './useUsers'; // Add the hook to fetch users
import TransactionCard from './TransactionCard';
import './BalanceTable.css';
import axios from 'axios';

const BalanceTable = () => {
  const { expenses, setExpenses, loading: loadingExpenses, error: errorExpenses } = useExpenses();
  const { payments, setPayments, loading: loadingPayments, error: errorPayments } = usePayments();
  const { incomes, setIncomes, loading: loadingIncomes, error: errorIncomes } = useIncomes();
  const { users, loading: loadingUsers, error: errorUsers } = useUsers(); // Use the hook to get users

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

  const [newIncome, setNewIncome] = useState({
    category: '',
    amount: '',
    date: '',
    status: 'pending'
  });

  const [sortOrder, setSortOrder] = useState('asc');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  // Handle form input changes for new expenses, payments, and incomes
  const handleExpenseChange = (e) => setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  const handlePaymentChange = (e) => setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
  const handleIncomeChange = (e) => setNewIncome({ ...newIncome, [e.target.name]: e.target.value });

  // Submit new expense
  const submitExpense = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('auth_token');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/expenses', newExpense, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses([...expenses, response.data]);
      setNewExpense({ amount: '', date: '', category: '', description: '' });
      setShowExpenseModal(false); // Close modal after submission
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
      setPayments([...payments, response.data]);
      setNewPayment({ payee_id: '', amount: '', status: 'pending' });
      setShowPaymentModal(false); // Close modal after submission
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  // Submit new income
  const submitIncome = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('auth_token');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/incomes', newIncome, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncomes([...incomes, response.data]);
      setNewIncome({ category: '', amount: '', date: '', status: 'pending' });
      setShowIncomeModal(false); // Close modal after submission
    } catch (error) {
      console.error('Error creating income:', error);
    }
  };

  // Sorting by date
  const sortByDate = (array) => array.sort((a, b) => (sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at)));
  const sortedExpenses = sortByDate([...expenses]);
  const sortedPayments = sortByDate([...payments]);
  const sortedIncomes = sortByDate([...incomes]);

  const toggleSortOrder = () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

  // Izračunavanje bilansa
  const totalExpenses = expenses.reduce((total, expense) => total + (Number(expense.amount) || 0), 0);
  const totalPayments = payments.reduce((total, payment) => total + (payment.status === 'completed' ? (Number(payment.amount) || 0) : 0), 0);
  const totalIncomes = incomes.reduce((total, income) => total + (income.status === 'completed' ? (Number(income.amount) || 0) : 0), 0);
  const finalBalance = totalIncomes - totalPayments - totalExpenses;

  if (loadingExpenses || loadingPayments || loadingIncomes || loadingUsers) return <p>Loading...</p>;
  if (errorExpenses || errorPayments || errorIncomes || errorUsers) return <p>Error loading data.</p>;

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

        <div className="incomes-container">
          <h2>Incomes</h2>
          {sortedIncomes.map((income) => (
            <TransactionCard
              key={income.id}
              id={income.id}
              title={income.category}
              amount={Number(income.amount)}
              date={income.created_at}
              status={income.status}
              type="income"
              onDelete={() => setIncomes(incomes.filter((inc) => inc.id !== income.id))}
            />
          ))}
        </div>
      </div>

      {/* Modal trigger buttons */}
      <button onClick={() => setShowExpenseModal(true)}>Add Expense</button>
      <button onClick={() => setShowPaymentModal(true)}>Add Payment</button>
      <button onClick={() => setShowIncomeModal(true)}>Add Income</button>

      {/* Modals for creating expenses, payments, and incomes */}
      {showExpenseModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowExpenseModal(false)}>&times;</span>
            <h2>Create New Expense</h2>
            <form onSubmit={submitExpense}>
              <input type="text" name="category" placeholder="Category" value={newExpense.category} onChange={handleExpenseChange} required />
              <input type="number" name="amount" placeholder="Amount" value={newExpense.amount} onChange={handleExpenseChange} required />
              <input type="date" name="date" value={newExpense.date} onChange={handleExpenseChange} required />
              <textarea name="description" placeholder="Description" value={newExpense.description} onChange={handleExpenseChange} />
              <button type="submit">Add Expense</button>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowPaymentModal(false)}>&times;</span>
            <h2>Create New Payment</h2>
            <form onSubmit={submitPayment}>
              {/* Select Dropdown for Payee */}
              <select name="payee_id" value={newPayment.payee_id} onChange={handlePaymentChange} required>
                <option value="">Select Payee</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <input type="number" name="amount" placeholder="Amount" value={newPayment.amount} onChange={handlePaymentChange} required />
              <select name="status" value={newPayment.status} onChange={handlePaymentChange}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button type="submit">Add Payment</button>
            </form>
          </div>
        </div>
      )}

      {showIncomeModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowIncomeModal(false)}>&times;</span>
            <h2>Create New Income</h2>
            <form onSubmit={submitIncome}>
              <input type="text" name="category" placeholder="Category" value={newIncome.category} onChange={handleIncomeChange} required />
              <input type="number" name="amount" placeholder="Amount" value={newIncome.amount} onChange={handleIncomeChange} required />
              <input type="date" name="date" value={newIncome.date} onChange={handleIncomeChange} required />
              <select name="status" value={newIncome.status} onChange={handleIncomeChange}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button type="submit">Add Income</button>
            </form>
          </div>
        </div>
      )}

      <div className="final-balance">
        <h2>Final Balance: {finalBalance >= 0 ? `${finalBalance.toFixed(2)} RSD` : `- ${Math.abs(finalBalance).toFixed(2)} RSD`}</h2>
      </div>
    </div>
  );
};

export default BalanceTable;
