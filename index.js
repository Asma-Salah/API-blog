import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const client = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>User Posts</h1>");
});

app.get("/users", async (req, res) => {
  try {
    const newUsers = await client.user.findMany();
    res.status(200).json(newUsers);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newId = await client.user.findFirst({
      where: {
        id,
      },
    });
    if (newId) {
      return res.status(200).json(newId);
    } else {
      return res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, username } = req.body;
    const createPost = await client.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        username,
      },
    });
    res.status(201).json(createPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//userPosts
app.get("/posts", async (req, res) => {
  try {
    const newPost = await client.post.findMany({
      where: {
        isDeleted: false,
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newSpecificId = await client.post.findFirst({
      where: {
        id,
      },
    });
    if (newSpecificId) {
      return res.status(200).json(newSpecificId);
    } else {
      return res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const newUserPost = await client.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    res.status(201).json(newUserPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.patch("/posts/:id", async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const { id } = req.params;
    const updatePost = await client.post.update({
      where: {
        id,
      },
      data: {
        title: title && title,
        content: content && content,
        authorId: authorId && authorId,
      },
    });
    res.status(200).json(updatePost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPostId = await client.post.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// const port = process.env.PORT || 5000;
let port;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = 5000;
}

app.listen(port, () => {
  console.log("app running on port 5000");
});
