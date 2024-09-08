import React from 'react';
import './TransactionCard.css';  

const TransactionCard = ({ title, amount, date, status }) => {
  return (
    <div className="transaction-card">
      <h3>{title}</h3>
      <p>Amount: {amount.toFixed(2)} RSD</p>
      {status && <p className="status">{status}</p>}  {/* Dodali smo klasu za status */}
      <p>Date: {new Date(date).toLocaleDateString()}</p>
    </div>
  );
};

export default TransactionCard;
