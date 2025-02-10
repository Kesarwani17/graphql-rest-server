// graphql-rest-server.js
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { gql } from "graphql-tag";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub, withFilter } from "graphql-subscriptions";
import fs from "fs";
import path from "path";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { fileURLToPath } from "url";

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express and PubSub
const app = express();
const pubsub = new PubSub();
app.use(express.json());

const MESSAGE_ADDED = "MESSAGE_ADDED";
const MESSAGE_UPDATED = "MESSAGE_UPDATED";

const dataFilePath = path.join(__dirname, "data.json");

// Helper functions remain the same
const readData = () =>
  fs.existsSync(dataFilePath)
    ? JSON.parse(fs.readFileSync(dataFilePath, "utf8"))
    : [];
const writeData = (data) =>
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

// Type definitions remain the same
const typeDefs = gql`
  type Message {
    id: ID!
    content: String!
    word: String
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    addMessage(content: String!): Message!
    updateMessage(id: ID!, content: String, word: String): Message!
  }

  type Subscription {
    messageAdded: Message!
    messageUpdated(id: ID!): Message!
  }
`;

// Resolvers remain the same
const resolvers = {
  Query: {
    messages: () => readData(),
  },
  Mutation: {
    addMessage: (_, { content, word }) => {
      const messages = readData();
      const newMessage = { id: messages.length + 1, content, word };
      messages.push(newMessage);
      writeData(messages);
      pubsub.publish(MESSAGE_ADDED, { messageAdded: newMessage });
      return newMessage;
    },
    updateMessage: (_, { id, content, word }) => {
      const messages = readData();
      const numericId = parseInt(id, 10);
      const index = messages.findIndex((m) => m.id === numericId);
      if (index === -1) throw new Error("Message not found");

      const updatedMessage = {
        ...messages[index],
        content: content ?? messages[index].content,
        word: word ?? messages[index].word,
      };

      messages[index] = updatedMessage;
      writeData(messages);
      pubsub.publish(MESSAGE_UPDATED, { messageUpdated: updatedMessage });
      return updatedMessage;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_ADDED),
    },
    messageUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_UPDATED),
        (payload, variables) => {
          return payload.messageUpdated.id === parseInt(variables.id, 10);
        }
      ),
    },
  },
};

// Schema creation remains the same
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo Server
const apolloServer = new ApolloServer({ schema });

// Create HTTP server
const httpServer = createServer(app);

// WebSocket server setup
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });

// Use WebSocket server with graphql-ws
useServer({ schema }, wsServer);

// Async startup
(async () => {
  await apolloServer.start();
  app.use("/graphql", expressMiddleware(apolloServer));

  // Home route for server check
  app.get("/test", (req, res) => {
    res.send("Server is up and running!");
  });
  // REST endpoint remains the same
  app.post("/messages", async (req, res) => {
    try {
      const { content, word } = req.body;
      if (!content)
        return res.status(400).json({ error: "Content is required" });

      const messages = readData();
      const newMessage = { id: messages.length + 1, content, word };
      messages.push(newMessage);
      writeData(messages);

      pubsub.publish(MESSAGE_ADDED, { messageAdded: { ...newMessage, word } });
      res.json(newMessage);
    } catch (error) {
      console.error("Error adding message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.put("/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { content, word } = req.body;
      const numericId = parseInt(id, 10);
      
      if (isNaN(numericId)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
  
      const messages = readData();
      const index = messages.findIndex(m => m.id === numericId);
      
      if (index === -1) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      const updatedMessage = {
        ...messages[index],
        content: content ?? messages[index].content,
        word: word ?? messages[index].word
      };
  
      messages[index] = updatedMessage;
      writeData(messages);
      
      // Publish update to subscribers
      pubsub.publish(MESSAGE_UPDATED, { messageUpdated: updatedMessage });
      
      res.json(updatedMessage);
    } catch (error) {
      console.error("Error updating message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  httpServer.listen(4000, () => {
    console.log("🚀 GraphQL Server running at http://localhost:4000/graphql");
    console.log("🌍 REST API Server running at http://localhost:4000/messages");
  });
})();
