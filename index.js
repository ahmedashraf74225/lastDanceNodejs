const express = require("express");
const db = require("./config/db.js");
const app = express();

const router = express.Router();

//const models = require("./models/user_model");
const User = require("./models/user_model.js");
const Post = require("./models/post_model.js");

User.hasMany(Post, { foreignKey: 'UserID' });
Post.belongsTo(User, { foreignKey: 'UserID' });

app.use(express.json());

// config
db.authenticate().then(() => {
  db.sync({ force: true });
  console.log("connected");
});


router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// create  new user
router.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const [count, user] = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (count === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user[0]);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an existing user
router.delete("/users/:id", async (req, res) => {
  try {
    const count = await User.destroy({ where: { id: req.params.id } });
    if (count === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(204).end();
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new post (only for admin users)
router.post("/posts", async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const post = await Post.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve all posts (only for admin users)
router.get("/posts", async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const posts = await Post.findAll({ include: User });
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve a single post only for the admin user
router.get("/posts/:id", async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      include: User,
    });
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.json(post);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an existing post (only for admin users)
router.put("/posts/:id", async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const [count, post] = await Post.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (count === 0) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.json(post[0]);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an existing post (only for admin users)
router.delete("/posts/:id", async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const count = await Post.destroy({ where: { id: req.params.id } });
    if (count === 0) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.status(204).end();
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log(`Server listening on port 3000....`);
});

//____________________________________________________________________________

//app.use("/user",require("./routes/user.route"))
// app.get("/",async (req,res)=>{
//     const user = await User.findAll({
//     });
//     res.send(user);
// })

// app.post("/",async (req,res)=>{
//     const user = await User.create({
//          name: "Jane",
//          email: "Doe@gmail.com" ,
//          password:"Ahmed12345A"
//     });
//     res.send(user);
// })

// app.delete("/",async (req,res)=>{
//     const user = await User.delete({
//         where:{
//             name: "Jane",
//             email: "Doe@gmail.com"
//         }
//     });
//     req.send(user);
// });

// app.patch("/",async (req,res)=>{
//     const user = await User.update({
//         name:"Ahmed",
//         where:{
//             name:null
//         }
//     });

//     req.status(200).send(user);
// })
