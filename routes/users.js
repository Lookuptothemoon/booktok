// ./routes/users.js
/* User Router */
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// get users
router.get("/", async (req, res) => {
    await User.find()
        .then((users) => res.status(200).send({users: users}))
        .catch((error) => res.status(400).send({message: error}));
});

router.get("/id/:id", async (req, res) => {
    await User.findById(req.params.id)
        .then((user) => res.status(200).send({user: user}))
        .catch((error) => res.status(400).send({message: error}));
});

router.get("/username/:username", async (req, res) => {
    await User.findOne({username: req.params.username})
        .then((user) => res.status(200).send({user: user}))
        .catch((error) => res.status(400).send({message: error}));
});

// create new user
router.post("/create", async (req, res) => {
    if(!req.body.first_name || !req.body.last_name|| !req.body.username || !req.body.bio || !req.body.email || !req.body.password) res.status(400).send("info required but not given");
    
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) return res.status(400).send({message: "username already exists"});

    const existingEmail = await User.findOne({email: req.body.email});
    if(existingEmail) return res.status(404).send("user with email already exists");

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        bio: req.body.bio,
        email: req.body.email,
        password: hashPassword
    });

    // attempt to add user to DB
    try {
        const savedUser = await user.save();
        return res.status(200).send({
        message: "user was registered successfully",
        user: user._id,
        });
    } catch (err) {
        return res.status(400).send({message: err});
    }
});

router.post("/update/:id", async (req, res) => {
    if(!req.body.first_name || !req.body.last_name|| !req.body.username || !req.body.bio || !req.body.email) res.status(400).send("info required but not given");

    let isChanged = false;
    
    // check if user exists
    const user = await User.findById(req.params.id).then((user));
    if(!user) {
        return res.status(404).send({message: "user not found"});
    }

    // check if username changed to another unique username
    if(user.username != req.body.username) {
        // check if new username is available
        const usernameExists = await User.findOne({username: req.body.username});
        if(usernameExists){
            return res.status(400).send({message: "username is taken"});
        }
        isChanged = true;
        user.username = req.body.username;
    }

    // check if email changed to another unique username
    if(user.email != req.body.email) {
        const emailExists = await User.findOne({email: req.body.email});
        if(emailExists) {
            return res.status(400).send({message: "email is taken"});
        }
        isChanged = true;
        user.email = req.body.email;
    }

    // check if bio changed
    if(user.bio != req.body.bio){
        isChanged = true;
        user.bio = req.body.bio;
    }
    // check if first name changed
    if(user.first_name != req.body.first_name) {
        isChanged = true;
        user.first_name = req.body.first_name;
    }
    // check if last_name changed
    if(user.last_name != req.body.last_name) {
        isChanged = true;
        user.last_name = req.body.last_name;
    }

    // update user fields
    if(isChanged) {
        // save updated fields
        await user.save()
        .then(() => res.status(200).send({message: "user updated successfully"}))
        .catch((error) => res.status(404).send({message: error}));
    }else{
        res.status(304).send({message: "no changes to user"});
    }
});

router.post("/updatePassword/:id", async (req, res) => {
    if(!req.body.oldPassword || !req.body.newPassword) res.status(400).send("info required but not given");

    await User.findById(req.user._id)
    .then(async (user) => {
      // validate old password
      const validPassword = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!validPassword) {
        return res.status(401).send({message: "Incorrect password"});
      }

      // check if old password and new password are the same
      if(req.body.oldPassword === req.body.newPassword){
        return res.status(403).send({message: "cannot use current password"});
      }

      // hash new password and assign to user
      const newPassword = req.body.newPassword;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashPassword;

      // save updated fields
      user
        .save()
        .then(() => res.status(200).send({message: "user password updated successfully"}))
        .catch((error) => res.status(400).send({message: error}));
    })
    .catch((error) => res.status(404).send({message: error}));
});

router.delete("/:id", async (req, res) => {
    // delete user
    await User.findOneAndDelete({ _id: req.params.id })
    .then((user) => res.status(200).send({message: "user deleted successfully"}))
    .catch((error) => res.status(400).send({message: error}));
});

module.exports = router;