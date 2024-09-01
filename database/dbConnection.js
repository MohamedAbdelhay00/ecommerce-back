import { connect } from "mongoose";

export const dbConn = connect("mongodb://localhost:27017/ecommerce").then(
  () => {
    console.log("Connected to database");
  }
);
