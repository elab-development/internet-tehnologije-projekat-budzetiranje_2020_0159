import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Dobrodošli u aplikaciju za praćenje i podelu troškova!</h1>
        <p>Jednostavno upravljanje troškovima među prijateljima, porodicom ili kolegama.</p>
      </header>
      
      <section className="features-section">
        <h2>Kako naša aplikacija funkcioniše?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Dodaj trošak</h3>
            <p>Beleži sve troškove, ko je platio i koliko je ko dužan.</p>
          </div>
          <div className="feature-card">
            <h3>Pregledaj troškove</h3>
            <p>Pogledaj detaljne izveštaje o troškovima i pravednoj podeli.</p>
          </div>
          <div className="feature-card">
            <h3>Refundacija</h3>
            <p>Automatski proračunaj ko treba da refundira kome.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Započni sada!</h2>
        <p>Prati sve troškove jednostavno i brzo.</p>
        <button className="cta-button">Kreiraj svoj nalog</button>
      </section>
    </div>
  );
};

export default HomePage;
