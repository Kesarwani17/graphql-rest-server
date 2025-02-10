# GraphQL REST Server

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/220px-GraphQL_Logo.svg.png" alt="GraphServer Logo">
</p>
<p align="center">
  <img src="https://img.shields.io/badge/APIs-GraphQL%20%2B%20REST-success" alt="API Types">
  <img src="https://img.shields.io/badge/license-ISC-blue" alt="License">
  <img src="https://img.shields.io/badge/Node.js-v14%2B-green" alt="Node.js">
  <img src="https://img.shields.io/badge/npm-v6%2B-red" alt="npm">
</p>

GraphServer is a powerful and flexible server that supports both GraphQL and REST APIs. It is built using Node.js, Express, and Apollo Server, providing a robust solution for handling real-time data with subscriptions.

## Features

- **GraphQL API**: Query and mutate data using GraphQL.
- **REST API**: Traditional REST endpoints for data manipulation.
- **Subscriptions**: Real-time updates with GraphQL subscriptions.
- **WebSocket Support**: Integrated WebSocket server for real-time communication.
- **Modular Architecture**: Easily extendable and maintainable codebase.

## Technologies Used

| Technology    | Description                          | Logo                                                                      |
| ------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| Node.js       | JavaScript runtime                   | ![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)             |
| Express       | Web framework for Node.js            | ![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey)         |
| Apollo Server | GraphQL server implementation        | ![Apollo Server](https://img.shields.io/badge/Apollo%20Server-2.x-blue)   |
| WebSocket     | Protocol for real-time communication | ![WebSocket](https://img.shields.io/badge/WebSocket-Protocol-brightgreen) |

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/Kesarwani17/graphql-rest-server.git
cd graphql-rest-server
```

2. Install dependencies:

```sh
npm install
```

### Running the Server

To start the server, run:

```sh
npm run start
```

This will start both the GraphQL and REST servers.

### Available Scripts

- `npm run start`: Start both GraphQL and REST servers.

## Usage

### GraphQL API

Access the GraphQL API at:

```
http://localhost:4000/graphql
```

#### Example Query

```graphql
query {
  messages {
    id
    content
    word
  }
}
```

#### Example Mutation

```graphql
mutation {
  addMessage(content: "Hello, World!", word: "greeting") {
    id
    content
    word
  }
}
```

### REST API

Access the REST API at:

```
http://localhost:4000/messages
```

#### Example POST Request

```sh
curl -X POST http://localhost:4000/messages -H "Content-Type: application/json" -d '{"content": "Hello, World!", "word": "greeting"}'
```

#### Example PUT Request

```sh
curl -X PUT http://localhost:4000/messages/1 -H "Content-Type: application/json" -d '{"content": "Updated Content", "word": "updated"}'
```

## Project Structure

```
graphql-rest-server/
├── .vscode/
│   └── launch.json
├── node_modules/
├── data.json
├── .gitignore
├── package.json
├── graphql-rest-server.js
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [gauravkesarwani94@gmail.com](mailto:gauravkesarwani94@gmail.com).

<p align="center">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTObdyqwfaKeYwOWJTDlEEuFps-FoF-Hbxd4A&s" alt="GraphServer Screensho">
</p>