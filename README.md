# Personal Finance Visualizer

A simple web application for tracking personal finances.

## Live Link

https://financetrackerz.vercel.app


## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)


## Overview

This web application helps users track and manage their personal finances efficiently, providing features like transaction tracking, category breakdowns, and budgeting insights.


## Installation

### 1. Fork & Clone the Repository

#### Fork the Repository:
Go to the repository URL and click on the Fork button to create a copy under your GitHub account.

#### Clone the Forked Repository:
In your terminal, clone the repository to your local machine:

```sh
git clone <your-forked-repository-url>
```
### Navigate to the Project Directory:

```sh
cd <project-directory>
```
### 2. Set Up the Client (Next.js)

#### Navigate to the Client Directory:

```sh
cd client
```

#### Install Dependencies:

```sh
npm install
```

#### Set up your environment variables:
Create a .env file in the frontend directory and add the following variables:

```sh
NEXT_PUBLIC_SERVER_URL="http://localhost:5001"
```

#### Start the Client:
Run the following command to start the client:

```sh
npm run dev
```

The client will typically be available at http://localhost:3000

### 3. Set Up the Server (Express)

#### Navigate to the Server Directory:

```sh
cd server
```

#### Install Dependencies:

```sh
npm install
```

#### Set up your environment variables:

Create a .env file in the backend directory and add the following variables:

```sh
PORT=5001
dbURL=<Your MongoDB URL>
```

#### Start the Server:

Run the following command to start the server:

```sh
npm run dev
```

The server will typically run on: http://localhost:5001



## API Endpoints

All API routes are prefixed with /api. Below are the available routes:

### *Dashboard*

Route: /api/dashboard
Description: Handles all dashboard-related operations.
Methods: GET, POST, etc. (Customize based on your actual implementation)

### *Category*

Route: /api/category
Description: Manages category data.
Methods: GET, POST, PUT, DELETE

### *Transaction*

Route: /api/transaction
Description: Manages single transaction operations.
Methods: GET, POST, PUT, DELETE

### *Transactions List*

Route: /api/transactions-list
Description: Provides access to a list of transactions.
Methods: GET (and additional methods if applicable)

### *Budget*

Route: /api/budget
Description: Handles budget-related operations.
Methods: GET, POST, PUT, DELETE


