import React from 'react';
import axios from 'axios';
import './TransactionCard.css';  
import { FaTrash } from 'react-icons/fa'; // Import ikone kante

const TransactionCard = ({ id, title, amount, date, status, type, onDelete }) => {
  const handleDelete = async () => {
    const token = sessionStorage.getItem('auth_token');
    try {
      // Correct URL for DELETE request based on type
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
      {status && <p className="status">{status}</p>}  {/* Dodali smo klasu za status */}
      <p>Date: {new Date(date).toLocaleDateString()}</p>
      {/* Dugme za brisanje */}
      <button className="delete-button" onClick={handleDelete}>
        <FaTrash /> {/* Ikona kantice */}
      </button>
    </div>
  );
};

export default TransactionCard;
