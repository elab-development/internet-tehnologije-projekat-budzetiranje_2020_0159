import React from 'react';
import axios from 'axios';
import './TransactionCard.css';  
import { FaTrash, FaPencilAlt } from 'react-icons/fa';  

const TransactionCard = ({ id, title, amount, date, status, type, onDelete, onEdit }) => {
  const handleDelete = async () => {
    const token = sessionStorage.getItem('auth_token');
    try {
      let url = '';
      if (type === 'expense') {
        url = `http://127.0.0.1:8000/api/expenses/${id}`;
      } else if (type === 'payment') {
        url = `http://127.0.0.1:8000/api/payments/${id}`;
      } else if (type === 'income') {
        url = `http://127.0.0.1:8000/api/incomes/${id}`;
      }

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onDelete(id); // Notify parent component on successful deletion
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="transaction-card">
      <h3>{title}</h3>
      <p>Amount: {amount.toFixed(2)} RSD</p>
      {status && <p className="status">{status}</p>}
      <p>Date: {new Date(date).toLocaleDateString()}</p>
      <button className="delete-button" onClick={handleDelete}>
        <FaTrash />
      </button>
      <button className="edit-button" onClick={() => onEdit(id, type)}>
        <FaPencilAlt />
      </button>
    </div>
  );
};

export default TransactionCard;
