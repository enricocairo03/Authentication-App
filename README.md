# Authentication-App

## Panoramica

Questo progetto è un'applicazione di autenticazione realizzata con **Node.js**, **Express**, **JWT (JSON Web Tokens)** e **Handlebars** come motore di template. Include funzionalità di registrazione, login e gestione di rotte protette.

## Funzionalità

- Registrazione utente
- Login utente con autenticazione JWT
- Rotte protette
- Utilizzo di MySQL per la gestione del database

## Installazione

1. Clona il repository:
   
    git clone https://github.com/enricocairo03/Authentication-App.git
    
2. Installa le dipendenze:
    
    npm install
  
3. Configura un file `.env` con le seguenti informazioni:
    
    JWT_SECRET=tuo_secret_key
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=tua_password
    DB_NAME=authentication_app
    

4. Avvia l'applicazione:
    
    npm start
    

## Utilizzo

1. Vai su `http://localhost:3000` nel tuo browser.
2. Registra un nuovo account o accedi per poter accedere alle rotte protette.

## Tecnologie utilizzate

- **Node.js**
- **Express**
- **Handlebars**
- **JWT** per l'autenticazione
- **MySQL** per la gestione del database

## Licenza

Questo progetto è distribuito sotto licenza MIT.
