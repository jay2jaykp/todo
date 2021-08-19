import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
// import bodyParser from "body-parser";
import expressNunjucks from "express-nunjucks";
import path from "path";
import { Todo } from "./api/routes";
import { ResetMigration } from "./knex";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

console.log(process.env.NODE_ENV);
// console.log(process.env.DATABASE_URL);
// console.log(
//   `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${
//     process.env.DB_HOST || "localhost"
//   }:${process.env.DB_PORT || 5431}/${process.env.DB_NAME}`
// );
app.set("views", path.resolve(__dirname, "../../client/build"));
expressNunjucks(app, {
  watch: false,
  noCache: true,
});

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: {
      maxAge: 31536000,
      preload: true,
    },
  })
);

if (process.env.NODE_ENV === "development") {
  // We don't need cors in production because we're serving both client assets and the web api
  // from the same origin.
  app.use(cors());
} else {
  // Disable options request in production to remove security vulnerability.  This is minor
  // and could be re-added in the future if OPTIONS are required.
  app.options("/*", function (req, res) {
    res.send(403);
  });
}

// Body Parser Middleware
app.use(express.json({ limit: "1mb" }));
app.use(
  express.urlencoded({
    limit: "1mb",
    extended: false,
    parameterLimit: 1000,
  })
);

// Router
app.use("/todo", Todo);

// handle static production build assets.  Development builds involves two separate services and client assets don't need to be
// served by the server.
// TODO:  Move these to a GCP CDN resource as part of a build and use dispatch.yaml to route accordingly
if (process.env.NODE_ENV === "production") {
  // The client statics that will be required by the index.html page that's served
  app.use(
    express.static(path.resolve(__dirname, "../../client/build"), {
      // we want the index file to be served by the * route so that we can set cache headers
      index: false,
    })
  );
  app.use(
    express.static(path.resolve(__dirname, "../../client/public"), {
      // we want the index file to be served by the * route so that we can set cache headers
      index: false,
    })
  );

  // fallback for SPA routes that the user may navigate directly to via bookmarks or other means
  app.get("*", function (req, res) {
    // make sure the index file isn't cached, since it's small, only loaded once and must
    // be updated whenever a new version of the codebase is deployed in order to point
    // to the correct bundle.
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");

    res.render(path.resolve(__dirname, "../../client/build/index.html"), {
      nonce: res.locals.nonce,
    });
  });
}

/**
 * Resetting DB Schema
 * and Inserting Seed Data
 *
 * @note to avoid unnecessary resets while in dev env
 * let's add condition to check the prod env for reseting
 */
if (process.env.NODE_ENV === "production") ResetMigration();

app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
