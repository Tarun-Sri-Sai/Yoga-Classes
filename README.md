# Yoga Classes Management System

## Requirements

- `node`: v20.5.1
- `npm`: v9.8.0
- `npx`: v9.8.0
- `python`: v3.12.1
- `pip`: v23.2.1

## Installation

1. Go to `frontend` and create a `.env`:

    ```dotenv
    VITE_SERVER_URL=http://localhost:5000
    ```

1. In the same folder, run:

    ```bash
    npm install
    ```

1. At the root of the project, run:

    ```bash
    python -m venv backend
    ```

1. Go to `backend` and create a `.env`:

    ```dotenv
    FLASK_HOST=0.0.0.0
    FLASK_PORT=5000
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

1. Go to `localhost:3000` to access the site.
