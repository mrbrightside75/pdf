# Early Intervention Case Management Backend

This backend API generates PDF letters for Early Intervention Case Management. The API allows you to create and store PDF letters in the database and retrieve them later for viewing.

## Prerequisites

Before testing this application, ensure you have the following installed:

-   **Node.js** (v14 or later)
-   **npm** (Node Package Manager)
-   **PostgreSQL** (with a properly configured database)
-   **Postman** (for API testing)

## Dependencies

The application uses the following dependencies:

-   **nodemon**: For automatic restarts during development
-   **postgres**: PostgreSQL database for storing PDF files
-   **sequelize**: For database interaction
-   **cors**: For Cross-Origin Resource Sharing
-   **pdf-lib**: For generating and manipulating PDF files

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mrbrightside75/pdf.git
cd pdf
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Database

Make sure to configure your database settings in the `db/db.js` file. Set up PostgreSQL with a database for storing the PDF files and ensure Sequelize is properly configured.

### 4. Start the Server

Once everything is set up, start the Node.js server with `nodemon`:

```bash
npm start
```

The server will start listening on `localhost:3001`.

### 5. Testing the API with Postman

Follow the steps below to test the PDF generation and other endpoints using Postman.

---

## API Endpoints

### 1. Create a User

-   **Endpoint**: `/user`
-   **Method**: POST
-   **Body**:
    ```json
    {
    	"firstname": "John",
    	"lastname": "Doe"
    }
    ```
-   **Response**:
    ```json
    {
    	"id": 1,
    	"firstname": "John",
    	"lastname": "Doe",
    	"createdAt": "2024-09-21T10:21:09.017Z",
    	"updatedAt": "2024-09-21T10:21:09.017Z"
    }
    ```

### 2. Create a Parent Letter PDF

-   **Endpoint**: `/create-parent-letter`
-   **Method**: POST
-   **Body** (JSON):
    ```json
    {
    	"date": "October 1, 2024",
    	"parentName": "Jane Doe",
    	"parentAddress": "789 Maple Street",
    	"cityStateZip": "Syracuse, NY 13210",
    	"childName": "Lucas Doe",
    	"serviceCoordinator": "Sarah Connor",
    	"phone": "315-456-7890",
    	"ext": "789"
    }
    ```
-   **Response**:
    ```json
    {
    	"message": "Parent Letter PDF created and saved to the database!",
    	"file": {
    		"id": 1,
    		"name": "parent_letter.pdf",
    		"data": "..." // Binary data stored in the database
    	}
    }
    ```

This will generate a PDF with the provided data and store it in the database as a BLOB.

### 3. Retrieve a PDF by ID

-   **Endpoint**: `/get-pdf/:id`
-   **Method**: GET
-   **Example**: `http://localhost:3001/get-pdf/1`
-   **Response**: The binary data of the PDF file will be returned. In Postman, select **Send and Download** to save the PDF.

---

## How to Test in Postman

1. **Launch Postman** and create a new **Collection** for your API testing.
2. **Add Requests** to the collection for each endpoint:
    - **POST /user**: To create users.
    - **POST /create-parent-letter**: To generate the PDF letters.
    - **GET /get-pdf/:id**: To retrieve and download the generated PDFs.
3. **Test the Endpoints**:
    - Start with the `/create-parent-letter` endpoint, using the example JSON provided above. Verify the response and check the database to ensure the PDF is stored.
    - Use the `/get-pdf/:id` endpoint to retrieve the saved PDF and view it in your browser or save it using Postman’s "Send and Download" option.

### Example Postman Setup:

1. **POST /create-parent-letter**:

    - URL: `http://localhost:3001/create-parent-letter`
    - Method: `POST`
    - Body (raw, JSON):
        ```json
        {
        	"date": "October 1, 2024",
        	"parentName": "Jane Doe",
        	"parentAddress": "789 Maple Street",
        	"cityStateZip": "Syracuse, NY 13210",
        	"childName": "Lucas Doe",
        	"serviceCoordinator": "Sarah Connor",
        	"phone": "315-456-7890",
        	"ext": "789"
        }
        ```

2. **GET /get-pdf/:id**:
    - URL: `http://localhost:3001/get-pdf/1`
    - Method: `GET`
    - Select **Send and Download** to download the PDF.

---

## Troubleshooting

1. **Server Not Starting**: Ensure your database is running and properly configured in `db/db.js`.
2. **Database Connection Issues**: Verify PostgreSQL is running, and you've created the database schema.
3. **PDF Not Displaying in Postman**: When retrieving the PDF, ensure you use **Send and Download** in Postman. Otherwise, it will show binary data instead of downloading.

---

## Contributing

Currently not accepting contributions

---

## License

This project is licensed under the MIT License.
