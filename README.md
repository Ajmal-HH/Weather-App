# Weather Dashboard Application

## Setup

### Backend

1. Navigate to the backend directory:
    ```bash
    cd server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the root directory with the following contents:
    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/weather_dashboard
    JWT_SECRET=your_jwt_secret
    ```
4. Run the Prisma migration:
    ```bash
    npx prisma migrate dev
    ```
5. Start the backend server:
    ```bash
    npm start
    ```

### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with the following contents:
    ```
    VITE_API_KEY=WEATHER-APP-API-KEY
    ``` 
4. Start the frontend development server:
    ```bash
    npm run dev
    ```
