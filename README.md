# GadgetZone Backend

This repository contains the backend code for the GadgetZone project, a full-stack e-commerce platform that enables users to search, filter, categorize, sort, and paginate tech gadget products. The backend is built using Node.js, Express.js, and MongoDB, and it is deployed on Vercel.

## Live Links

- **Frontend Repository**: [GadgetZone-Client](https://github.com/moriyam-mohona/GadgetZone-Client-)
- **Frontend Live Site**: [GadgetZone](https://gadgetzone-f7d41.web.app/)

## Features

- **Product Listing**: Fetches products from the MongoDB database with support for pagination.
- **Search**: Allows searching for products by name.
- **Filtering**: Supports filtering products by brand, category, and price range.
- **Sorting**: Products can be sorted by price (low to high, high to low) and by date added (newest first).
- **Google and Email Authentication**: Managed via Firebase on the frontend.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/moriyam-mohona/GadgetZone-Server.git
   cd GadgetZone-Server
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```bash
   PORT=5000
   DB_USER=<your-mongodb-username>
   DB_PASS=<your-mongodb-password>
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server should be running on [http://localhost:5000](http://localhost:5000).

### API Endpoints

- **GET /gadget**: Fetches products based on search, filters, pagination, and sorting criteria.
  - Query Parameters:
    - `search`: Search term for product names.
    - `page`: Page number for pagination.
    - `size`: Number of items per page.
    - `brand`: Filter by brand name.
    - `category`: Filter by category.
    - `minPrice`: Minimum price for filtering.
    - `maxPrice`: Maximum price for filtering.
    - `sortOrder`: Sort products by `price_asc`, `price_desc`, or `date_desc`.

### Deployment

The backend is deployed on Vercel. Follow the steps below to deploy:

1. Install the Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy the project:

   ```bash
   vercel
   ```

3. Follow the prompts to complete the deployment.

## Additional Information

- **CORS**: The backend allows requests from specific origins defined in the `corsOptions`.
- **Database**: MongoDB is used as the database for storing product data. You can either manually insert data or create an API for it.
