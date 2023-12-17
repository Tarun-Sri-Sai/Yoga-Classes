# Yoga Classes Management System

## Requirements

- `node`: v20.5.1
- `npm`: v9.8.0

## Installation

1. Install create-vite using npm:

    ```bash
    npm install -g create-vite@5.0.1
    ```

1. Go to `frontend` and create a `.env`:

    ```dotenv
    VITE_SERVER_URL=http://localhost:5174
    ```

1. In the same folder, run:

    ```bash
    npm install
    ```

1. Go to `backend` and create a `.env`:

    ```dotenv
    FLASK_HOST=127.0.0.1
    FLASK_PORT=5174
    MONGODB_CONNECTION_STRING=your-mongodb-connection-string
    ```

1. In the same folder, run:

    ```bash
    Scripts/activate
    pip install -r requirements.txt
    ```

## Usage

1. Go to `backend` and run:

    ```bash
    Scripts/activate
    python src/server.py
    ```

1. Go to `frontend` and run:

    ```bash
    npm run dev
    ```
