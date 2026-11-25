app.post('/api/users/bulk', async (req, res) => {
  try {
    const users = req.body.users;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'users must be a non-empty array' });
    }

    let saved = 0;

    for (const u of users) {
      if (!u || !u.email || !u.password) {
        return res.status(400).json({ message: 'Each user must have email and password' });
      }
      const hash = await bcrypt.hash(u.password, 10);
      await User.create({ email: u.email, password: hash });
      saved++;
    }

    return res.status(201).json({ saved });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save users', error: err.message });
  }
});